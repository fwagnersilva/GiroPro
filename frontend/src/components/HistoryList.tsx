import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency, formatDate, formatTime } from '../utils/formatters';

export interface HistoryItem {
  id: string;
  date: string;
  type: 'journey' | 'fueling' | 'expense';
  title: string;
  subtitle?: string;
  amount?: number;
  status?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  onPress?: () => void;
}

interface HistoryListProps {
  data: HistoryItem[];
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onItemPress?: (item: HistoryItem) => void;
  emptyMessage?: string;
  emptyIcon?: keyof typeof Ionicons.glyphMap;
}

const HistoryList: React.FC<HistoryListProps> = ({
  data,
  loading,
  refreshing,
  hasMore,
  onRefresh,
  onLoadMore,
  onItemPress,
  emptyMessage = 'Nenhum registro encontrado',
  emptyIcon = 'document-text-outline',
}) => {
  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadMore = useCallback(async () => {
    if (hasMore && !loading && !loadingMore) {
      setLoadingMore(true);
      try {
        await onLoadMore();
      } catch (error) {
        console.error('Erro ao carregar mais itens:', error);
        Alert.alert('Erro', 'Não foi possível carregar mais itens');
      } finally {
        setLoadingMore(false);
      }
    }
  }, [hasMore, loading, loadingMore, onLoadMore]);

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        if (item.onPress) {
          item.onPress();
        } else if (onItemPress) {
          onItemPress(item);
        }
      }}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        <View style={[styles.iconContainer, { backgroundColor: `${item.iconColor}20` }]}>
          <Ionicons name={item.icon} size={20} color={item.iconColor} />
        </View>
        
        <View style={styles.itemDetails}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.itemDate}>
              {formatDate(item.date)}
            </Text>
          </View>
          
          {item.subtitle && (
            <Text style={styles.itemSubtitle} numberOfLines={1}>
              {item.subtitle}
            </Text>
          )}
          
          <View style={styles.itemFooter}>
            {item.amount !== undefined && (
              <Text style={[
                styles.itemAmount,
                item.type === 'journey' ? styles.positiveAmount : styles.negativeAmount
              ]}>
                {item.type === 'journey' ? '+' : '-'}{formatCurrency(Math.abs(item.amount))}
              </Text>
            )}
            
            {item.status && (
              <View style={[
                styles.statusBadge,
                item.status === 'active' && styles.activeBadge,
                item.status === 'completed' && styles.completedBadge,
                item.status === 'cancelled' && styles.cancelledBadge,
              ]}>
                <Text style={[
                  styles.statusText,
                  item.status === 'active' && styles.activeText,
                  item.status === 'completed' && styles.completedText,
                  item.status === 'cancelled' && styles.cancelledText,
                ]}>
                  {getStatusLabel(item.status)}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    
    return (
      <View style={styles.footerContainer}>
        {loadingMore ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : (
          <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
            <Text style={styles.loadMoreText}>Carregar mais</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name={emptyIcon} size={64} color="#C7C7CC" />
      </View>
      <Text style={styles.emptyTitle}>Nada por aqui ainda</Text>
      <Text style={styles.emptyMessage}>{emptyMessage}</Text>
    </View>
  );

  if (loading && data.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.container}
      contentContainerStyle={data.length === 0 ? styles.emptyContentContainer : undefined}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#007AFF']}
          tintColor="#007AFF"
        />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const getStatusLabel = (status: string): string => {
  const labels: { [key: string]: string } = {
    active: 'Em andamento',
    completed: 'Finalizada',
    cancelled: 'Cancelada',
    pending: 'Pendente',
    paid: 'Pago',
  };
  return labels[status] || status;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  emptyContentContainer: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 12,
  },
  itemContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
    marginRight: 8,
  },
  itemDate: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  positiveAmount: {
    color: '#34C759',
  },
  negativeAmount: {
    color: '#FF3B30',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  activeBadge: {
    backgroundColor: '#FF950020',
  },
  completedBadge: {
    backgroundColor: '#34C75920',
  },
  cancelledBadge: {
    backgroundColor: '#FF3B3020',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeText: {
    color: '#FF9500',
  },
  completedText: {
    color: '#34C759',
  },
  cancelledText: {
    color: '#FF3B30',
  },
  separator: {
    height: 1,
    backgroundColor: 'transparent',
  },
  footerContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadMoreButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  loadMoreText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default HistoryList;

