import nodemailer from 'nodemailer';
import { config } from '../config';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static transporter: nodemailer.Transporter | null = null;

  private static async createTransporter(): Promise<nodemailer.Transporter> {
    if (this.transporter) {
      return this.transporter;
    }

    // Configuração para desenvolvimento (usando Ethereal Email para testes)
    if (process.env.NODE_ENV === 'development' || !process.env.SMTP_HOST) {
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } else {
      // Configuração para produção
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }

    return this.transporter;
  }

  static async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const transporter = await this.createTransporter();
      
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@giropro.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      const info = await transporter.sendMail(mailOptions);
      
      // Em desenvolvimento, mostrar o link de preview do Ethereal
      if (process.env.NODE_ENV === 'development' || !process.env.SMTP_HOST) {
        console.log('📧 Email enviado (desenvolvimento):', nodemailer.getTestMessageUrl(info));
      } else {
        console.log('📧 Email enviado com sucesso para:', options.to);
      }
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      throw new Error('Falha ao enviar email');
    }
  }

  static async sendPasswordResetEmail(email: string, resetToken: string, userName: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redefinir Senha - GiroPro</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #007bff;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background-color: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 8px 8px;
          }
          .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
          }
          .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🚗 GiroPro</h1>
          <h2>Redefinição de Senha</h2>
        </div>
        
        <div class="content">
          <p>Olá, <strong>${userName}</strong>!</p>
          
          <p>Recebemos uma solicitação para redefinir a senha da sua conta no GiroPro.</p>
          
          <p>Para criar uma nova senha, clique no botão abaixo:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Redefinir Senha</a>
          </div>
          
          <p>Ou copie e cole este link no seu navegador:</p>
          <p style="word-break: break-all; background-color: #e9ecef; padding: 10px; border-radius: 5px;">
            ${resetUrl}
          </p>
          
          <div class="warning">
            <strong>⚠️ Importante:</strong>
            <ul>
              <li>Este link é válido por apenas <strong>1 hora</strong></li>
              <li>Se você não solicitou esta redefinição, ignore este email</li>
              <li>Sua senha atual permanecerá inalterada até que você crie uma nova</li>
            </ul>
          </div>
          
          <p>Se você tiver problemas com o link acima, entre em contato conosco.</p>
          
          <p>Atenciosamente,<br>
          <strong>Equipe GiroPro</strong></p>
        </div>
        
        <div class="footer">
          <p>Este é um email automático, por favor não responda.</p>
          <p>© ${new Date().getFullYear()} GiroPro. Todos os direitos reservados.</p>
        </div>
      </body>
      </html>
    `;

    const text = `
      GiroPro - Redefinição de Senha
      
      Olá, ${userName}!
      
      Recebemos uma solicitação para redefinir a senha da sua conta no GiroPro.
      
      Para criar uma nova senha, acesse o link abaixo:
      ${resetUrl}
      
      IMPORTANTE:
      - Este link é válido por apenas 1 hora
      - Se você não solicitou esta redefinição, ignore este email
      - Sua senha atual permanecerá inalterada até que você crie uma nova
      
      Se você tiver problemas, entre em contato conosco.
      
      Atenciosamente,
      Equipe GiroPro
      
      ---
      Este é um email automático, por favor não responda.
      © ${new Date().getFullYear()} GiroPro. Todos os direitos reservados.
    `;

    await this.sendEmail({
      to: email,
      subject: '🔐 GiroPro - Redefinir sua senha',
      html,
      text,
    });
  }

  static async sendWelcomeEmail(email: string, userName: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo ao GiroPro!</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #28a745;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background-color: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 8px 8px;
          }
          .button {
            display: inline-block;
            background-color: #28a745;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🚗 GiroPro</h1>
          <h2>Bem-vindo!</h2>
        </div>
        
        <div class="content">
          <p>Olá, <strong>${userName}</strong>!</p>
          
          <p>Seja bem-vindo ao <strong>GiroPro</strong>! 🎉</p>
          
          <p>Sua conta foi criada com sucesso e você já pode começar a gerenciar seus veículos, jornadas e despesas de forma inteligente.</p>
          
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="button">Acessar Dashboard</a>
          </div>
          
          <p><strong>O que você pode fazer no GiroPro:</strong></p>
          <ul>
            <li>📊 Gerenciar múltiplos veículos</li>
            <li>⛽ Controlar abastecimentos</li>
            <li>🛣️ Registrar jornadas</li>
            <li>💰 Acompanhar despesas</li>
            <li>📈 Visualizar relatórios detalhados</li>
          </ul>
          
          <p>Se precisar de ajuda, nossa equipe está sempre disponível!</p>
          
          <p>Atenciosamente,<br>
          <strong>Equipe GiroPro</strong></p>
        </div>
        
        <div class="footer">
          <p>Este é um email automático, por favor não responda.</p>
          <p>© ${new Date().getFullYear()} GiroPro. Todos os direitos reservados.</p>
        </div>
      </body>
      </html>
    `;

    const text = `
      GiroPro - Bem-vindo!
      
      Olá, ${userName}!
      
      Seja bem-vindo ao GiroPro! 🎉
      
      Sua conta foi criada com sucesso e você já pode começar a gerenciar seus veículos, jornadas e despesas de forma inteligente.
      
      Acesse: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard
      
      O que você pode fazer no GiroPro:
      - Gerenciar múltiplos veículos
      - Controlar abastecimentos
      - Registrar jornadas
      - Acompanhar despesas
      - Visualizar relatórios detalhados
      
      Se precisar de ajuda, nossa equipe está sempre disponível!
      
      Atenciosamente,
      Equipe GiroPro
      
      ---
      Este é um email automático, por favor não responda.
      © ${new Date().getFullYear()} GiroPro. Todos os direitos reservados.
    `;

    await this.sendEmail({
      to: email,
      subject: '🎉 Bem-vindo ao GiroPro!',
      html,
      text,
    });
  }
}

