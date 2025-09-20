import { Request, Response } from 'express';
import { db } from '../db';
import { usuarios, veiculos, jornadas, abastecimentos, despesas } from '../db/schema';
import { eq, gt, and, isNull } from 'drizzle-orm';
import logger from '../utils/logger';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

interface OfflineDataBatch {
  jornadas?: any[];
  abastecimentos?: any[];
  despesas?: any[];
  veiculos?: any[];
  timestamp: number;
}

interface SyncMetadata {
  lastSyncTimestamp: number;
  deviceId?: string;
  version?: string;
}

// Upload de dados coletados offline
export const uploadOfflineData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const { data, metadata }: { data: OfflineDataBatch; metadata: SyncMetadata } = req.body;

    if (!data || !metadata) {
      return res.status(400).json({ error: 'Dados ou metadados ausentes' });
    }

    // Iniciar transação
    const results = await db.transaction(async (tx) => {
      const processedData = {
        jornadas: 0,
        abastecimentos: 0,
        despesas: 0,
        veiculos: 0,
        conflicts: []
      };

      // Processar jornadas
      if (data.jornadas && data.jornadas.length > 0) {
        for (const jornada of data.jornadas) {
          try {
            // Verificar se já existe (idempotência)
            const existing = await tx.select()
              .from(jornadas)
              .where(and(
                eq(jornadas.id, jornada.id),
                eq(jornadas.idUsuario, userId)
              ))
              .limit(1);

            if (existing.length === 0) {
              await tx.insert(jornadas).values({
                ...jornada,
                idUsuario: userId,
                createdAt: new Date(jornada.createdAt || Date.now()),
                updatedAt: new Date()
              });
              processedData.jornadas++;
            } else {
              // Verificar conflito de versão
              const existingItem = existing[0];
              if (existingItem.updatedAt && new Date(jornada.updatedAt) < existingItem.updatedAt) {
                processedData.conflicts.push({
                  type: 'jornada',
                  id: jornada.id,
                  reason: 'server_newer'
                });
              } else {
                // Atualizar com dados mais recentes
                await tx.update(jornadas)
                  .set({
                    ...jornada,
                    updatedAt: new Date()
                  })
                  .where(eq(jornadas.id, jornada.id));
                processedData.jornadas++;
              }
            }
          } catch (error) {
            logger.error('Erro ao processar jornada:', error);
            processedData.conflicts.push({
              type: 'jornada',
              id: jornada.id,
              reason: 'processing_error'
            });
          }
        }
      }

      // Processar abastecimentos
      if (data.abastecimentos && data.abastecimentos.length > 0) {
        for (const abastecimento of data.abastecimentos) {
          try {
            const existing = await tx.select()
              .from(abastecimentos)
              .where(and(
                eq(abastecimentos.id, abastecimento.id),
                eq(abastecimentos.idUsuario, userId)
              ))
              .limit(1);

            if (existing.length === 0) {
              await tx.insert(abastecimentos).values({
                ...abastecimento,
                idUsuario: userId,
                createdAt: new Date(abastecimento.createdAt || Date.now()),
                updatedAt: new Date()
              });
              processedData.abastecimentos++;
            } else {
              const existingItem = existing[0];
              if (existingItem.updatedAt && new Date(abastecimento.updatedAt) < existingItem.updatedAt) {
                processedData.conflicts.push({
                  type: 'abastecimento',
                  id: abastecimento.id,
                  reason: 'server_newer'
                });
              } else {
                await tx.update(abastecimentos)
                  .set({
                    ...abastecimento,
                    updatedAt: new Date()
                  })
                  .where(eq(abastecimentos.id, abastecimento.id));
                processedData.abastecimentos++;
              }
            }
          } catch (error) {
            logger.error('Erro ao processar abastecimento:', error);
            processedData.conflicts.push({
              type: 'abastecimento',
              id: abastecimento.id,
              reason: 'processing_error'
            });
          }
        }
      }

      // Processar despesas
      if (data.despesas && data.despesas.length > 0) {
        for (const despesa of data.despesas) {
          try {
            const existing = await tx.select()
              .from(despesas)
              .where(and(
                eq(despesas.id, despesa.id),
                eq(despesas.idUsuario, userId)
              ))
              .limit(1);

            if (existing.length === 0) {
              await tx.insert(despesas).values({
                ...despesa,
                idUsuario: userId,
                createdAt: new Date(despesa.createdAt || Date.now()),
                updatedAt: new Date()
              });
              processedData.despesas++;
            } else {
              const existingItem = existing[0];
              if (existingItem.updatedAt && new Date(despesa.updatedAt) < existingItem.updatedAt) {
                processedData.conflicts.push({
                  type: 'despesa',
                  id: despesa.id,
                  reason: 'server_newer'
                });
              } else {
                await tx.update(despesas)
                  .set({
                    ...despesa,
                    updatedAt: new Date()
                  })
                  .where(eq(despesas.id, despesa.id));
                processedData.despesas++;
              }
            }
          } catch (error) {
            logger.error('Erro ao processar despesa:', error);
            processedData.conflicts.push({
              type: 'despesa',
              id: despesa.id,
              reason: 'processing_error'
            });
          }
        }
      }

      // Processar veículos
      if (data.veiculos && data.veiculos.length > 0) {
        for (const veiculo of data.veiculos) {
          try {
            const existing = await tx.select()
              .from(veiculos)
              .where(and(
                eq(veiculos.id, veiculo.id),
                eq(veiculos.idUsuario, userId)
              ))
              .limit(1);

            if (existing.length === 0) {
              await tx.insert(veiculos).values({
                ...veiculo,
                idUsuario: userId,
                createdAt: new Date(veiculo.createdAt || Date.now()),
                updatedAt: new Date()
              });
              processedData.veiculos++;
            } else {
              const existingItem = existing[0];
              if (existingItem.updatedAt && new Date(veiculo.updatedAt) < existingItem.updatedAt) {
                processedData.conflicts.push({
                  type: 'veiculo',
                  id: veiculo.id,
                  reason: 'server_newer'
                });
              } else {
                await tx.update(veiculos)
                  .set({
                    ...veiculo,
                    updatedAt: new Date()
                  })
                  .where(eq(veiculos.id, veiculo.id));
                processedData.veiculos++;
              }
            }
          } catch (error) {
            logger.error('Erro ao processar veículo:', error);
            processedData.conflicts.push({
              type: 'veiculo',
              id: veiculo.id,
              reason: 'processing_error'
            });
          }
        }
      }

      return processedData;
    });

    logger.info(`Sincronização offline processada para usuário ${userId}:`, results);

    res.json({
      success: true,
      message: 'Dados sincronizados com sucesso',
      processed: results,
      timestamp: Date.now()
    });

  } catch (error) {
    logger.error('Erro no upload de dados offline:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Falha ao processar dados offline'
    });
  }
};

// Download de dados para sincronização inicial
export const downloadInitialData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    // Buscar todos os dados do usuário
    const [userVeiculos, userJornadas, userAbastecimentos, userDespesas] = await Promise.all([
      db.select()
        .from(veiculos)
        .where(and(
          eq(veiculos.idUsuario, userId),
          isNull(veiculos.deletedAt)
        )),
      
      db.select()
        .from(jornadas)
        .where(and(
          eq(jornadas.idUsuario, userId),
          isNull(jornadas.deletedAt)
        )),
      
      db.select()
        .from(abastecimentos)
        .where(and(
          eq(abastecimentos.idUsuario, userId),
          isNull(abastecimentos.deletedAt)
        )),
      
      db.select()
        .from(despesas)
        .where(and(
          eq(despesas.idUsuario, userId),
          isNull(despesas.deletedAt)
        ))
    ]);

    const syncData = {
      veiculos: userVeiculos,
      jornadas: userJornadas,
      abastecimentos: userAbastecimentos,
      despesas: userDespesas,
      metadata: {
        syncType: 'initial',
        timestamp: Date.now(),
        totalRecords: userVeiculos.length + userJornadas.length + userAbastecimentos.length + userDespesas.length
      }
    };

    logger.info(`Sincronização inicial para usuário ${userId}: ${syncData.metadata.totalRecords} registros`);

    res.json({
      success: true,
      data: syncData
    });

  } catch (error) {
    logger.error('Erro no download de dados iniciais:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Falha ao buscar dados para sincronização inicial'
    });
  }
};

// Download de dados para sincronização incremental
export const downloadIncrementalData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const { lastSync } = req.query;
    
    if (!lastSync) {
      return res.status(400).json({ error: 'Timestamp da última sincronização é obrigatório' });
    }

    const lastSyncDate = new Date(Number(lastSync));

    // Buscar dados modificados desde a última sincronização
    const [updatedVeiculos, updatedJornadas, updatedAbastecimentos, updatedDespesas] = await Promise.all([
      db.select()
        .from(veiculos)
        .where(and(
          eq(veiculos.idUsuario, userId),
          gt(veiculos.updatedAt, lastSyncDate)
        )),
      
      db.select()
        .from(jornadas)
        .where(and(
          eq(jornadas.idUsuario, userId),
          gt(jornadas.updatedAt, lastSyncDate)
        )),
      
      db.select()
        .from(abastecimentos)
        .where(and(
          eq(abastecimentos.idUsuario, userId),
          gt(abastecimentos.updatedAt, lastSyncDate)
        )),
      
      db.select()
        .from(despesas)
        .where(and(
          eq(despesas.idUsuario, userId),
          gt(despesas.updatedAt, lastSyncDate)
        ))
    ]);

    const syncData = {
      veiculos: updatedVeiculos,
      jornadas: updatedJornadas,
      abastecimentos: updatedAbastecimentos,
      despesas: updatedDespesas,
      metadata: {
        syncType: 'incremental',
        lastSync: lastSyncDate.toISOString(),
        timestamp: Date.now(),
        totalRecords: updatedVeiculos.length + updatedJornadas.length + updatedAbastecimentos.length + updatedDespesas.length
      }
    };

    logger.info(`Sincronização incremental para usuário ${userId}: ${syncData.metadata.totalRecords} registros atualizados`);

    res.json({
      success: true,
      data: syncData
    });

  } catch (error) {
    logger.error('Erro no download de dados incrementais:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Falha ao buscar dados para sincronização incremental'
    });
  }
};

// Obter timestamp da última sincronização
export const getLastSyncTimestamp = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    // Buscar o registro mais recente de qualquer entidade do usuário
    const [latestVeiculo, latestJornada, latestAbastecimento, latestDespesa] = await Promise.all([
      db.select({ updatedAt: veiculos.updatedAt })
        .from(veiculos)
        .where(eq(veiculos.idUsuario, userId))
        .orderBy(veiculos.updatedAt)
        .limit(1),
      
      db.select({ updatedAt: jornadas.updatedAt })
        .from(jornadas)
        .where(eq(jornadas.idUsuario, userId))
        .orderBy(jornadas.updatedAt)
        .limit(1),
      
      db.select({ updatedAt: abastecimentos.updatedAt })
        .from(abastecimentos)
        .where(eq(abastecimentos.idUsuario, userId))
        .orderBy(abastecimentos.updatedAt)
        .limit(1),
      
      db.select({ updatedAt: despesas.updatedAt })
        .from(despesas)
        .where(eq(despesas.idUsuario, userId))
        .orderBy(despesas.updatedAt)
        .limit(1)
    ]);

    const timestamps = [
      latestVeiculo[0]?.updatedAt,
      latestJornada[0]?.updatedAt,
      latestAbastecimento[0]?.updatedAt,
      latestDespesa[0]?.updatedAt
    ].filter(Boolean);

    const lastSyncTimestamp = timestamps.length > 0 
      ? Math.max(...timestamps.map(t => new Date(t).getTime()))
      : Date.now();

    res.json({
      success: true,
      lastSyncTimestamp,
      lastSyncDate: new Date(lastSyncTimestamp).toISOString()
    });

  } catch (error) {
    logger.error('Erro ao obter timestamp da última sincronização:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Falha ao obter timestamp da última sincronização'
    });
  }
};

