import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { usuarios } from '../db';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
  private static readonly SALT_ROUNDS = 12;
  private static readonly JWT_EXPIRES_IN = '7d';
  private static readonly REFRESH_TOKEN_EXPIRES_IN = '30d';

  static async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('📝 Iniciando registro:', { email: data.email });
      
      const existingUser = await db
        .select({ id: usuarios.id })
        .from(usuarios)
        .where(eq(usuarios.email, data.email.toLowerCase()));

      if (existingUser.length > 0) {
        throw new Error("Email já está em uso");
      }

      const senhaHash = await bcrypt.hash(data.senha, this.SALT_ROUNDS);
      const id = uuidv4();
      const now = new Date();

      console.log('💾 Inserindo usuário no banco...');
      
      await db
        .insert(usuarios)
        .values({
          id,
          nome: data.nome,
          email: data.email.toLowerCase(),
          senhaHash,
          statusConta: "ativo",
          dataCadastro: now,
          ultimaAtividade: now,
          updatedAt: now,
        });

      console.log('✅ Usuário criado:', id);

      const token = this.generateToken(id, data.email, data.nome, 'user');
      const refreshToken = this.generateRefreshToken(id);

      return {
        token,
        refreshToken,
        user: {
          id,
          nome: data.nome,
          email: data.email,
          statusConta: "ativo",
          role: 'user',
        },
      };
    } catch (error: any) {
      console.error('❌ Erro ao registrar:', error.message);
      throw error;
    }
  }

  static async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const user = await db
        .select()
        .from(usuarios)
        .where(eq(usuarios.email, data.email.toLowerCase()));

      if (user.length === 0) {
        throw new Error("Email ou senha inválidos");
      }

      const userData = user[0];
      const passwordMatch = await bcrypt.compare(data.senha, userData.senhaHash);

      if (!passwordMatch) {
        throw new Error("Email ou senha inválidos");
      }

      const token = this.generateToken(userData.id, userData.email, userData.nome, userData.role || 'user');
      const refreshToken = this.generateRefreshToken(userData.id);

      return {
        token,
        refreshToken,
        user: {
          id: userData.id,
          nome: userData.nome,
          email: userData.email,
          statusConta: userData.statusConta,
          role: userData.role,
        },
      };
    } catch (error: any) {
      console.error('❌ Erro ao fazer login:', error);
      throw error;
    }
  }

  static async refreshToken(refreshToken: string): Promise<any> {
    try {
      const decoded: any = jwt.verify(refreshToken, process.env.JWT_SECRET || 'default-secret');
      const token = this.generateToken(decoded.id, decoded.email, decoded.nome, decoded.role);
      const newRefreshToken = this.generateRefreshToken(decoded.id);

      return {
        token,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error("Token inválido ou expirado");
    }
  }

  private static generateToken(id: string, email: string, nome: string, role: string): string {
    return jwt.sign(
      { id, email, nome, role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: this.JWT_EXPIRES_IN }
    );
  }

  private static generateRefreshToken(id: string): string {
    return jwt.sign(
      { id },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: this.REFRESH_TOKEN_EXPIRES_IN }
    );
  }
}
