import { db } from './connection';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

export async function initializeMemoryDatabase() {
  try {
    console.log('🔧 Inicializando banco em memória com SQL direto...');
    
    // Ler o arquivo de migração SQL
    const migrationPath = path.join(process.cwd(), 'drizzle', '0000_adorable_gunslinger.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Dividir o SQL em statements individuais
    const statements = migrationSQL
      .split('--> statement-breakpoint')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('-->'));
    
    // Executar cada statement
    for (const statement of statements) {
      if (statement.trim()) {
        await db.run(sql.raw(statement));
      }
    }
    
    console.log('✅ Banco em memória inicializado com sucesso!');
    
    // Verificar se as tabelas foram criadas
    const tables = await db.all(sql`SELECT name FROM sqlite_master WHERE type='table'`);
    console.log('📊 Tabelas criadas:', tables.map((t: any) => t.name).join(', '));
    
  } catch (error) {
    console.error('❌ Erro ao inicializar banco em memória:', error);
    throw error;
  }
}

