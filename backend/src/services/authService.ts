import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { usuarios } from '../db/schema';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types';

export class AuthService {
  private static readonly SALT_ROUNDS = 12;
  private static readonly JWT_EXPIRES_IN = '7d';

  static async register(data: RegisterRequest): Promise<AuthResponse> {
    // Verificar se o email já existe
    const existingUser = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, data.email))
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
        senha_hash: senhaHash,
        data_cadastro: new Date().toISOString(),
      })
      .returning({
        id: usuarios.id,
        nome: usuarios.nome,
        email: usuarios.email,
      });

    // Gerar token JWT
    const token = this.generateToken(newUser.id);

    return {
      token,
      user: newUser,
    };
  }

  static async login(data: LoginRequest): Promise<AuthResponse> {
    // Buscar usuário por email
    const [user] = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, data.email))
      .limit(1);

    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // Verificar se a conta está ativa
    if (user.status_conta !== 'Ativo') {
      throw new Error('Conta inativa ou suspensa');
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(data.senha, user.senha_hash);
    if (!senhaValida) {
      throw new Error('Credenciais inválidas');
    }

    // Gerar token JWT
    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
      },
    };
  }

  static async getUserById(userId: string) {
    const [user] = await db
      .select({
        id: usuarios.id,
        nome: usuarios.nome,
        email: usuarios.email,
        status_conta: usuarios.status_conta,
        data_cadastro: usuarios.data_cadastro,
      })
      .from(usuarios)
      .where(eq(usuarios.id, userId))
      .limit(1);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return user;
  }

  private static generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      { expiresIn: this.JWT_EXPIRES_IN }
    );
  }

  static verifyToken(token: string): { userId: string } {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      return { userId: decoded.userId };
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
}

