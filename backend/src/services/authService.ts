import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { eq, and, sql } from 'drizzle-orm'; // Adicionado 'sql'
import { db } from '../db';
import { usuarios } from '../db/schema';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types';

export class AuthService {
  private static readonly SALT_ROUNDS = 12;
  private static readonly JWT_EXPIRES_IN = '7d';
  private static readonly REFRESH_TOKEN_EXPIRES_IN = '30d';
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCKOUT_TIME = 15; // minutos

  static async register(data: RegisterRequest): Promise<AuthResponse> {
    // Validações básicas
      this.validateEmail(data.email);
      this.validatePassword(data.senha);
      this.validateName(data.nome);

      // Verificar se o email já existe
      const existingUser = await db
        .select({ id: usuarios.id })
        .from(usuarios)
        .where(eq(usuarios.email, data.email.toLowerCase()))
        .limit(1);

      if (existingUser.length > 0) {
        throw new Error('Email já está em uso');
      }

      // Hash da senha
      const senhaHash = await bcrypt.hash(data.senha, this.SALT_ROUNDS);

      // Criar usuário
      const [newUser] = await db
        .insert(usuarios)
        .values({
          id: crypto.randomUUID(),
          nome: data.nome,
          email: data.email,
          senhaHash: senhaHash,
          statusConta: 'ativo',
          dataCadastro: new Date(),
          ultimaAtividade: new Date(),
        })
        .returning({
          id: usuarios.id,
          nome: usuarios.nome,
          email: usuarios.email,
          statusConta: usuarios.statusConta,
        });

      // Gerar tokens
      const token = this.generateToken(newUser.id, newUser.email, newUser.nome, newUser.role);
      const refreshToken = this.generateRefreshToken(newUser.id);

      return {
        token,
        refreshToken,
        user: {
          id: newUser.id,
          nome: newUser.nome,
          email: newUser.email,
          statusConta: newUser.statusConta,
        },
      };
  }

  static async login(data: LoginRequest): Promise<AuthResponse> {
// Buscar usuário por email
      const [user] = await db
        .select()
        .from(usuarios)
        .where(eq(usuarios.email, data.email.toLowerCase().trim()))
        .limit(1);

      if (!user) {
        throw new Error("Credenciais inválidas");
      }

      // Verificar se a conta está bloqueada
      if (await this.isAccountLocked(user)) {
        throw new Error("Conta temporariamente bloqueada devido a muitas tentativas de login. Tente novamente em 15 minutos.");
      }

      // Verificar se a conta está ativa
      if (user.statusConta !== "ativo") {
        throw new Error("Conta inativa ou suspensa");
      }

      // Verificar senha
      const senhaValida = await bcrypt.compare(data.senha, user.senhaHash);
      
      if (!senhaValida) {
        // Incrementar tentativas de login
        await this.incrementLoginAttempts(user.id);
        throw new Error("Credenciais inválidas");
      }

      // Reset das tentativas de login em caso de sucesso
      await this.resetLoginAttempts(user.id);

      // Atualizar última atividade
      await this.updateLastActivity(user.id);

      // Gerar tokens
      const token = this.generateToken(user.id, user.email, user.nome, user.role);
      const refreshToken = this.generateRefreshToken(user.id);

      return {
        token,
        refreshToken,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          statusConta: user.statusConta,
        },
      };
  }

  static async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
      
      // Verificar se o usuário ainda existe e está ativo
      const user = await this.getUserById(decoded.userId);
      if (user.statusConta !== 'ativo') {
        throw new Error('Usuário inativo');
      }

      // Gerar novos tokens
      const newToken = this.generateToken(user.id, user.email, user.nome, user.role);
      const newRefreshToken = this.generateRefreshToken(user.id);

      return {
        token: newToken,
        refreshToken: newRefreshToken,
      };
  }

  static async getUserById(userId: string) {
const [user] = await db
        .select({
          id: usuarios.id,
          nome: usuarios.nome,
          email: usuarios.email,
          statusConta: usuarios.statusConta,
          dataCadastro: usuarios.dataCadastro,
          ultimaAtividade: usuarios.ultimaAtividade,
        })
        .from(usuarios)
        .where(eq(usuarios.id, userId))
        .limit(1);

      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      return user;
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
// Buscar usuário
      const [user] = await db
        .select({ senhaHash: usuarios.senhaHash })
        .from(usuarios)
        .where(eq(usuarios.id, userId))
        .limit(1);

      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      // Verificar senha atual
      const senhaValida = await bcrypt.compare(currentPassword, user.senhaHash);
      if (!senhaValida) {
        throw new Error("Senha atual inválida");
      }

      // Validar nova senha
      this.validatePassword(newPassword);

      // Hash da nova senha
      const novaSenhaHash = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

      // Atualizar senha
      await db
        .update(usuarios)
        .set({ 
          senhaHash: novaSenhaHash,
          ultimaAtividade: new Date(),
        })
        .where(eq(usuarios.id, userId));
  }

  static async deactivateAccount(userId: string): Promise<void> {
    await db
        .update(usuarios)
        .set({ 
          statusConta: 'inativo',
          ultimaAtividade: new Date(),
        })
        .where(eq(usuarios.id, userId));
  }

  static async requestPasswordReset(email: string): Promise<void> {
    const [user] = await db.select().from(usuarios).where(eq(usuarios.email, email)).limit(1);

      if (!user) {
        // Não informar se o email não existe por segurança
        return;
      }

      // Gerar token de redefinição de senha (JWT com expiração curta)
      const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

      // TODO: Enviar email com o link de redefinição de senha (contendo o resetToken)
      console.log(`Link de redefinição de senha para ${email}: http://localhost:3000/reset-password?token=${resetToken}`);
  }

  static async resetPassword(token: string, newPassword: string): Promise<void> {
const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      const userId = decoded.userId;

      // Validar nova senha
      this.validatePassword(newPassword);

      // Hash da nova senha
      const novaSenhaHash = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

      // Atualizar senha
      await db
        .update(usuarios)
        .set({
          senhaHash: novaSenhaHash,
          ultimaAtividade: new Date(),
        })
        .where(eq(usuarios.id, userId));
  }

  private static generateToken(userId: string, email: string, nome: string, role: string): string {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET não configurado');
    }
    
    return jwt.sign(
      { 
        userId,
        email,
        type: 'access',
        iat: Math.floor(Date.now() / 1000),
      },
      process.env.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );
  }

  private static generateRefreshToken(userId: string): string {
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new Error('JWT_REFRESH_SECRET não configurado');
    }
    
    return jwt.sign(
      { 
        userId,
        type: 'refresh',
        iat: Math.floor(Date.now() / 1000),
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: this.REFRESH_TOKEN_EXPIRES_IN }
    );
  }

  static verifyToken(token: string): { userId: string; email: string; nome: string; role: string } {
if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não configurado");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    
    if (decoded.type !== "access") {
      throw new Error("Tipo de token inválido");
    }

    return { userId: decoded.userId, email: decoded.email, nome: decoded.nome, role: decoded.role };
  }

  // Métodos auxiliares privados
  private static async isAccountLocked(user: any): Promise<boolean> {
    if (user.tentativasLogin < this.MAX_LOGIN_ATTEMPTS) {
      return false;
    }

    const lockoutTime = new Date(user.ultimoLoginFalhado);
    lockoutTime.setMinutes(lockoutTime.getMinutes() + this.LOCKOUT_TIME);
    
    return new Date() < lockoutTime;
  }

  private static async incrementLoginAttempts(userId: string): Promise<void> {
    
    await db
      .update(usuarios)
      .set({
        tentativasLogin: sql`${usuarios.tentativasLogin} + 1`,
        ultimoLoginFalhado: new Date(),
      })
      .where(eq(usuarios.id, userId));
  }

  private static async resetLoginAttempts(userId: string): Promise<void> {
    
    await db
      .update(usuarios)
      .set({
        tentativasLogin: 0,
        ultimoLoginFalhado: null,
      })
      .where(eq(usuarios.id, userId));
  }

  private static async updateLastActivity(userId: string): Promise<void> {
    
    await db
      .update(usuarios)
      .set({ ultimaAtividade: new Date() })
      .where(eq(usuarios.id, userId));
  }

  private static validateEmail(email: string): void {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email || !emailRegex.test(email)) {
      throw new Error('Email inválido');
    }
  }

  private static validatePassword(password: string): void {
    if (!password || password.length < 8) {
      throw new Error('Senha deve ter pelo menos 8 caracteres');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      throw new Error('Senha deve conter pelo menos uma letra minúscula');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      throw new Error('Senha deve conter pelo menos uma letra maiúscula');
    }
    if (!/(?=.*\d)/.test(password)) {
      throw new Error('Senha deve conter pelo menos um número');
    }
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new Error('Nome deve ter pelo menos 2 caracteres');
    }
    if (name.trim().length > 100) {
      throw new Error('Nome deve ter no máximo 100 caracteres');
    }
  }
}


