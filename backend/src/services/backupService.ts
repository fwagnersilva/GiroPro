import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Logger } from "../utils/logger";
import { cacheService } from './cacheService';

const execAsync = promisify(exec);

interface BackupConfig {
  enabled: boolean;
  schedule: string; // Cron expression
  retention: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  storage: {
    local: {
      enabled: boolean;
      path: string;
    };
    s3?: {
      enabled: boolean;
      bucket: string;
      region: string;
      accessKeyId: string;
      secretAccessKey: string;
    };
  };
  compression: boolean;
  encryption: boolean;
}

interface BackupResult {
  success: boolean;
  filename: string;
  size: number;
  duration: number;
  error?: string;
}

class BackupService {
  private config: BackupConfig;
  private isRunning = false;

  constructor() {
    this.config = {
      enabled: process.env.BACKUP_ENABLED === 'true',
      schedule: process.env.BACKUP_SCHEDULE || '0 2 * * *', // 2:00 AM diariamente
      retention: {
        daily: parseInt(process.env.BACKUP_RETENTION_DAILY || '7'),
        weekly: parseInt(process.env.BACKUP_RETENTION_WEEKLY || '4'),
        monthly: parseInt(process.env.BACKUP_RETENTION_MONTHLY || '12')
      },
      storage: {
        local: {
          enabled: true,
          path: process.env.BACKUP_LOCAL_PATH || './backups'
        },
        s3: process.env.BACKUP_S3_ENABLED === 'true' ? {
          enabled: true,
          bucket: process.env.BACKUP_S3_BUCKET || '',
          region: process.env.BACKUP_S3_REGION || 'us-east-1',
          accessKeyId: process.env.BACKUP_S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.BACKUP_S3_SECRET_ACCESS_KEY || ''
        } : undefined
      },
      compression: process.env.BACKUP_COMPRESSION !== 'false',
      encryption: process.env.BACKUP_ENCRYPTION === 'true'
    };
  }

  // Executar backup completo
  async performBackup(): Promise<BackupResult> {
    if (this.isRunning) {
      throw new Error('Backup já está em execução');
    }

    this.isRunning = true;
    const startTime = Date.now();

    try {
      logger.info('Iniciando backup automático');

      // Criar diretório de backup se não existir
      await this.ensureBackupDirectory();

      // Gerar nome do arquivo de backup
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `giropro-backup-${timestamp}.sql`;
      const filepath = path.join(this.config.storage.local.path, filename);

      // Executar backup do banco de dados
      await this.backupDatabase(filepath);

      // Comprimir se habilitado
      let finalFilepath = filepath;
      if (this.config.compression) {
        finalFilepath = await this.compressBackup(filepath);
        await fs.unlink(filepath); // Remover arquivo não comprimido
      }

      // Criptografar se habilitado
      if (this.config.encryption) {
        finalFilepath = await this.encryptBackup(finalFilepath);
        if (this.config.compression) {
          await fs.unlink(filepath.replace('.sql', '.sql.gz')); // Remover arquivo não criptografado
        } else {
          await fs.unlink(filepath); // Remover arquivo não criptografado
        }
      }

      // Obter tamanho do arquivo final
      const stats = await fs.stat(finalFilepath);
      const fileSize = stats.size;

      // Upload para S3 se configurado
      if (this.config.storage.s3?.enabled) {
        await this.uploadToS3(finalFilepath);
      }

      // Limpar backups antigos
      await this.cleanupOldBackups();

      const duration = Date.now() - startTime;

      // Salvar informações do backup no cache
      await this.saveBackupInfo({
        timestamp: Date.now(),
        filename: path.basename(finalFilepath),
        size: fileSize,
        duration,
        success: true
      });

      logger.info('Backup concluído com sucesso', {
        filename: path.basename(finalFilepath),
        size: `${(fileSize / 1024 / 1024).toFixed(2)}MB`,
        duration: `${duration}ms`
      });

      return {
        success: true,
        filename: path.basename(finalFilepath),
        size: fileSize,
        duration
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error('Erro durante backup:', error);

      await this.saveBackupInfo({
        timestamp: Date.now(),
        filename: '',
        size: 0,
        duration,
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });

      return {
        success: false,
        filename: '',
        size: 0,
        duration,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    } finally {
      this.isRunning = false;
    }
  }

  // Backup do banco de dados PostgreSQL
  private async backupDatabase(filepath: string): Promise<void> {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL não configurada');
    }

    // Extrair informações da URL do banco
    const url = new URL(dbUrl);
    const host = url.hostname;
    const port = url.port || '5432';
    const database = url.pathname.slice(1);
    const username = url.username;
    const password = url.password;

    // Comando pg_dump
    const command = `PGPASSWORD="${password}" pg_dump -h ${host} -p ${port} -U ${username} -d ${database} --no-password --verbose --clean --if-exists --create > "${filepath}"`;

    try {
      await execAsync(command);
    } catch (error) {
      throw new Error(`Erro no pg_dump: ${error}`);
    }
  }

  // Comprimir backup
  private async compressBackup(filepath: string): Promise<string> {
    const compressedPath = `${filepath}.gz`;
    const command = `gzip "${filepath}"`;

    try {
      await execAsync(command);
      return compressedPath;
    } catch (error) {
      throw new Error(`Erro na compressão: ${error}`);
    }
  }

  // Criptografar backup
  private async encryptBackup(filepath: string): Promise<string> {
    const encryptedPath = `${filepath}.enc`;
    const password = process.env.BACKUP_ENCRYPTION_PASSWORD;

    if (!password) {
      throw new Error('BACKUP_ENCRYPTION_PASSWORD não configurada');
    }

    const command = `openssl enc -aes-256-cbc -salt -in "${filepath}" -out "${encryptedPath}" -pass pass:"${password}"`;

    try {
      await execAsync(command);
      return encryptedPath;
    } catch (error) {
      throw new Error(`Erro na criptografia: ${error}`);
    }
  }

  // Upload para S3 (implementação básica)
  private async uploadToS3(filepath: string): Promise<void> {
    if (!this.config.storage.s3) {
      return;
    }

    // Aqui seria implementado o upload para S3
    // Por simplicidade, apenas logamos que seria feito
    logger.info('Upload para S3 seria executado aqui', {
      bucket: this.config.storage.s3.bucket,
      file: path.basename(filepath)
    });
  }

  // Garantir que o diretório de backup existe
  private async ensureBackupDirectory(): Promise<void> {
    try {
      await fs.access(this.config.storage.local.path);
    } catch {
      await fs.mkdir(this.config.storage.local.path, { recursive: true });
    }
  }

  // Limpar backups antigos
  private async cleanupOldBackups(): Promise<void> {
    try {
      const files = await fs.readdir(this.config.storage.local.path);
      const backupFiles = files
        .filter(file => file.startsWith('giropro-backup-'))
        .map(file => ({
          name: file,
          path: path.join(this.config.storage.local.path, file),
          timestamp: this.extractTimestampFromFilename(file)
        }))
        .sort((a, b) => b.timestamp - a.timestamp);

      // Manter apenas os backups conforme política de retenção
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      const oneWeek = 7 * oneDay;
      const oneMonth = 30 * oneDay;

      const toDelete = backupFiles.filter((file, index) => {
        const age = now - file.timestamp;

        if (age <= oneDay) {
          // Backups do último dia: manter conforme retention.daily
          return index >= this.config.retention.daily;
        } else if (age <= oneWeek) {
          // Backups da última semana: manter 1 por dia
          const daysSinceBackup = Math.floor(age / oneDay);
          const sameDayBackups = backupFiles.filter(f => {
            const fAge = now - f.timestamp;
            return Math.floor(fAge / oneDay) === daysSinceBackup;
          });
          return sameDayBackups.indexOf(file) > 0;
        } else if (age <= oneMonth) {
          // Backups do último mês: manter conforme retention.weekly
          const weeksSinceBackup = Math.floor(age / oneWeek);
          const sameWeekBackups = backupFiles.filter(f => {
            const fAge = now - f.timestamp;
            return Math.floor(fAge / oneWeek) === weeksSinceBackup;
          });
          return sameWeekBackups.indexOf(file) >= this.config.retention.weekly;
        } else {
          // Backups mais antigos: manter conforme retention.monthly
          const monthsSinceBackup = Math.floor(age / oneMonth);
          const sameMonthBackups = backupFiles.filter(f => {
            const fAge = now - f.timestamp;
            return Math.floor(fAge / oneMonth) === monthsSinceBackup;
          });
          return sameMonthBackups.indexOf(file) >= this.config.retention.monthly;
        }
      });

      // Deletar arquivos antigos
      for (const file of toDelete) {
        await fs.unlink(file.path);
        logger.info(`Backup antigo removido: ${file.name}`);
      }

    } catch (error) {
      logger.error('Erro ao limpar backups antigos:', error);
    }
  }

  // Extrair timestamp do nome do arquivo
  private extractTimestampFromFilename(filename: string): number {
    const match = filename.match(/giropro-backup-(.+?)\./);
    if (match) {
      const timestampStr = match[1].replace(/-/g, ':').replace(/T/, 'T').replace(/Z$/, '.000Z');
      return new Date(timestampStr).getTime();
    }
    return 0;
  }

  // Salvar informações do backup no cache
  private async saveBackupInfo(info: any): Promise<void> {
    try {
      const backupHistory: any[] = await cacheService.get("backup:history") || [];
      backupHistory.unshift(info);
      
      // Manter apenas os últimos 50 registros
      if (backupHistory.length > 50) {
        backupHistory.splice(50);
      }

      await cacheService.set('backup:history', backupHistory, 86400 * 30); // 30 dias
      await cacheService.set('backup:last', info, 86400 * 7); // 7 dias
    } catch (error) {
      logger.error('Erro ao salvar informações do backup:', error);
    }
  }

  // Obter histórico de backups
  async getBackupHistory(): Promise<any[]> {
    try {
      return await cacheService.get('backup:history') || [];
    } catch (error) {
      logger.error('Erro ao obter histórico de backups:', error);
      return [];
    }
  }

  // Obter último backup
  async getLastBackup(): Promise<any | null> {
    try {
      return await cacheService.get('backup:last');
    } catch (error) {
      logger.error('Erro ao obter último backup:', error);
      return null;
    }
  }

  // Verificar se backup está habilitado
  isEnabled(): boolean {
    return this.config.enabled;
  }

  // Verificar se backup está em execução
  isBackupRunning(): boolean {
    return this.isRunning;
  }

  // Obter configuração de backup
  getConfig(): BackupConfig {
    return { ...this.config };
  }

  // Restaurar backup (implementação básica)
  async restoreBackup(filename: string): Promise<boolean> {
    try {
      const filepath = path.join(this.config.storage.local.path, filename);
      
      // Verificar se arquivo existe
      await fs.access(filepath);

      logger.warn('Restauração de backup solicitada', { filename });
      
      // Aqui seria implementada a lógica de restauração
      // Por segurança, apenas logamos a tentativa
      
      return true;
    } catch (error) {
      logger.error('Erro ao restaurar backup:', error);
      return false;
    }
  }
}

export const backupService = new BackupService();

