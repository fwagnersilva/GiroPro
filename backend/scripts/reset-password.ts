import bcrypt from 'bcrypt';
import { initializeDatabase } from '../src/db';
import { usuarios } from '../src/db/schema.postgres';
import { eq } from 'drizzle-orm';

async function resetPassword() {
  const email = 'fwagnersilva@gmail.com';
  const newPassword = 'Giropro@123';
  
  await initializeDatabase();
  
  const { db } = await import('../src/db');
  const senhaHash = await bcrypt.hash(newPassword, 12);
  
  await db
    .update(usuarios)
    .set({ senhaHash, updatedAt: new Date() })
    .where(eq(usuarios.email, email));
  
  console.log('✅ Senha alterada com sucesso para:', email);
  process.exit(0);
}

resetPassword().catch(console.error);
