import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  getPlatforms,
  createPlatform,
  updatePlatform,
  deletePlatform,
  Platform,
} from '../../src/services/platformService';

const CadastroPlataformasScreen: React.FC = () => {
  const router = useRouter();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPlatformName, setNewPlatformName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadPlatforms();
  }, []);

  const loadPlatforms = async () => {
    try {
      setLoading(true);
      const data = await getPlatforms();
      setPlatforms(data);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar plataformas');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlatform = async () => {
    if (!newPlatformName.trim()) {
      Alert.alert('Atenção', 'Digite o nome da plataforma');
      return;
    }

    try {
      setIsAdding(true);
      await createPlatform({ nome: newPlatformName.trim(), ativa: true });
      setNewPlatformName('');
      Alert.alert('Sucesso', 'Plataforma adicionada com sucesso!');
      await loadPlatforms();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao adicionar plataforma');
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleActive = async (platform: Platform) => {
    try {
      await updatePlatform(platform.id, { ativa: !platform.ativa });
      await loadPlatforms();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao atualizar plataforma');
    }
  };

  const handleDeletePlatform = async (platform: Platform) => {
    if (platform.isPadrao) {
      Alert.alert(
        'Não permitido',
        'Plataformas padrão (Uber e 99) não podem ser excluídas. Você pode apenas desativá-las.'
      );
      return;
    }

    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir a plataforma "${platform.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePlatform(platform.id);
              Alert.alert('Sucesso', 'Plataforma excluída com sucesso!');
              await loadPlatforms();
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Erro ao excluir plataforma');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando plataformas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gerenciar Plataformas</Text>
        <Text style={styles.headerSubtitle}>
          Configure as plataformas que você utiliza
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Formulário de adição */}
        <View style={styles.addSection}>
          <Text style={styles.sectionTitle}>Adicionar Nova Plataforma</Text>
          <View style={styles.addForm}>
            <TextInput
              style={styles.input}
              placeholder="Nome da plataforma (ex: InDriver, Cabify)"
              value={newPlatformName}
              onChangeText={setNewPlatformName}
              editable={!isAdding}
            />
            <TouchableOpacity
              style={[styles.addButton, isAdding && styles.addButtonDisabled]}
              onPress={handleAddPlatform}
              disabled={isAdding}
            >
              {isAdding ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.addButtonText}>+ Adicionar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista de plataformas */}
        <View style={styles.platformsSection}>
          <Text style={styles.sectionTitle}>Suas Plataformas</Text>
          
          {/* Plataformas Padrão */}
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Plataformas Nativas</Text>
            <Text style={styles.subsectionDescription}>
              Estas plataformas são padrão do sistema e não podem ser excluídas
            </Text>
            {platforms
              .filter((p) => p.isPadrao)
              .map((platform) => (
                <View key={platform.id} style={styles.platformCard}>
                  <View style={styles.platformInfo}>
                    <Text style={styles.platformName}>{platform.nome}</Text>
                    <Text style={styles.platformBadge}>PADRÃO</Text>
                  </View>
                  <View style={styles.platformActions}>
                    <View style={styles.switchContainer}>
                      <Text style={styles.switchLabel}>
                        {platform.ativa ? 'Ativa' : 'Inativa'}
                      </Text>
                      <Switch
                        value={platform.ativa}
                        onValueChange={() => handleToggleActive(platform)}
                        trackColor={{ false: '#ccc', true: '#34C759' }}
                        thumbColor="#fff"
                      />
                    </View>
                  </View>
                </View>
              ))}
          </View>

          {/* Plataformas Customizadas */}
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Plataformas Personalizadas</Text>
            <Text style={styles.subsectionDescription}>
              Você pode adicionar, ativar/desativar e excluir estas plataformas
            </Text>
            {platforms.filter((p) => !p.isPadrao).length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  Nenhuma plataforma personalizada cadastrada
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Adicione uma nova plataforma usando o formulário acima
                </Text>
              </View>
            ) : (
              platforms
                .filter((p) => !p.isPadrao)
                .map((platform) => (
                  <View key={platform.id} style={styles.platformCard}>
                    <View style={styles.platformInfo}>
                      <Text style={styles.platformName}>{platform.nome}</Text>
                    </View>
                    <View style={styles.platformActions}>
                      <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>
                          {platform.ativa ? 'Ativa' : 'Inativa'}
                        </Text>
                        <Switch
                          value={platform.ativa}
                          onValueChange={() => handleToggleActive(platform)}
                          trackColor={{ false: '#ccc', true: '#34C759' }}
                          thumbColor="#fff"
                        />
                      </View>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeletePlatform(platform)}
                      >
                        <Text style={styles.deleteButtonText}>🗑️ Excluir</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
            )}
          </View>
        </View>

        {/* Informações */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>ℹ️ Informações</Text>
          <Text style={styles.infoText}>
            • Apenas plataformas <Text style={styles.infoBold}>ativas</Text> aparecerão
            na tela de jornadas
          </Text>
          <Text style={styles.infoText}>
            • Plataformas com jornadas registradas não podem ser excluídas
          </Text>
          <Text style={styles.infoText}>
            • Uber e 99 são plataformas nativas e não podem ser removidas
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  addSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  addForm: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  addButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  platformsSection: {
    marginBottom: 20,
  },
  subsection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  subsectionDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  platformCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  platformName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  platformBadge: {
    backgroundColor: '#007AFF',
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  platformActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: '#999',
  },
  infoSection: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: '600',
    color: '#333',
  },
});

export default CadastroPlataformasScreen;
