import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService, Notification } from '../services/notificationService';
import { LoadingSpinner } from './LoadingSpinner';
import { SkeletonLoader } from './SkeletonLoader';

interface NotificationCenterProps {
  onClose?: () => void;
  maxHeight?: number;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onClose,
  maxHeight = 400,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const queryClient = useQueryClient();

  // Query para buscar notificações
  const { data: notificationsData, isLoading, error, refetch } = useQuery({
    queryKey: ['notifications', filter, typeFilter],
    queryFn: () => notificationService.getNotifications({
      limit: 50,
      onlyUnread: filter === 'unread',
      tipo: typeFilter as any,
    }),
    staleTime: 30 * 1000, // 30 segundos
  });

  // Mutation para marcar como lida
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => notificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
    onError: (error: Error) => {
      Alert.alert('Erro', error.message);
    },
  });

  // Mutation para marcar todas como lidas
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
      Alert.alert('Sucesso', `${data.updated_count} notificações marcadas como lidas`);
    },
    onError: (error: Error) => {
      Alert.alert('Erro', error.message);
    },
  });

  // Mutation para deletar notificação
  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId: string) => notificationService.deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
    onError: (error: Error) => {
      Alert.alert('Erro', error.message);
    },
  });

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'success':
        return '#10B981'; // Verde
      case 'warning':
        return '#F59E0B'; // Amarelo
      case 'error':
        return '#EF4444'; // Vermelho
      case 'insight':
        return '#8B5CF6'; // Roxo
      case 'recommendation':
        return '#3B82F6'; // Azul
      case 'info':
      default:
        return '#6B7280'; // Cinza
    }
  };

  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'insight':
        return '💡';
      case 'recommendation':
        return '🎯';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  const getTypeLabel = (tipo: string) => {
    const labels = {
      info: 'Informação',
      warning: 'Aviso',
      success: 'Sucesso',
      error: 'Erro',
      insight: 'Insight',
      recommendation: 'Recomendação',
    };
    return labels[tipo as keyof typeof labels] || tipo;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}min atrás`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.lida) {
      markAsReadMutation.mutate(notification.id);
    }

    // Aqui você pode adicionar lógica para navegar para telas específicas
    // baseado no tipo de notificação ou dados extras
    if (notification.dados_extras) {
      console.log('Dados extras da notificação:', notification.dados_extras);
    }
  };

  const handleDeleteNotification = (notificationId: string) => {
    Alert.alert(
      'Deletar Notificação',
      'Tem certeza que deseja deletar esta notificação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Deletar', 
          style: 'destructive',
          onPress: () => deleteNotificationMutation.mutate(notificationId)
        },
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerTitle}>Notificações</Text>
        {notificationsData?.pagination.total_unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>
              {notificationsData.pagination.total_unread}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.headerActions}>
        {notificationsData?.pagination.total_unread > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
          >
            <Text style={styles.markAllButtonText}>Marcar Todas</Text>
          </TouchableOpacity>
        )}
        
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilterButton]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterButtonText, filter === 'all' && styles.activeFilterButtonText]}>
            Todas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, filter === 'unread' && styles.activeFilterButton]}
          onPress={() => setFilter('unread')}
        >
          <Text style={[styles.filterButtonText, filter === 'unread' && styles.activeFilterButtonText]}>
            Não Lidas
          </Text>
        </TouchableOpacity>

        {['insight', 'recommendation', 'warning', 'success'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterButton, typeFilter === type && styles.activeFilterButton]}
            onPress={() => setTypeFilter(typeFilter === type ? undefined : type)}
          >
            <Text style={[styles.filterButtonText, typeFilter === type && styles.activeFilterButtonText]}>
              {getTypeIcon(type)} {getTypeLabel(type)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderNotification = (notification: Notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationCard,
        !notification.lida && styles.unreadNotificationCard
      ]}
      onPress={() => handleNotificationPress(notification)}
      onLongPress={() => handleDeleteNotification(notification.id)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationTitleContainer}>
          <Text style={styles.notificationIcon}>
            {getTypeIcon(notification.tipo)}
          </Text>
          <Text style={[
            styles.notificationTitle,
            !notification.lida && styles.unreadNotificationTitle
          ]}>
            {notification.titulo}
          </Text>
        </View>
        
        <View style={styles.notificationMeta}>
          <Text style={styles.notificationTime}>
            {formatDate(notification.data_criacao)}
          </Text>
          {!notification.lida && <View style={styles.unreadDot} />}
        </View>
      </View>
      
      <Text style={styles.notificationMessage} numberOfLines={3}>
        {notification.mensagem}
      </Text>
      
      <View style={styles.notificationFooter}>
        <View style={[
          styles.typeBadge,
          { backgroundColor: getTypeColor(notification.tipo) }
        ]}>
          <Text style={styles.typeBadgeText}>
            {getTypeLabel(notification.tipo)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <SkeletonLoader height={80} />
          <SkeletonLoader height={80} />
          <SkeletonLoader height={80} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao carregar notificações</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!notificationsData?.notifications || notificationsData.notifications.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyText}>Nenhuma notificação</Text>
          <Text style={styles.emptySubtext}>
            {filter === 'unread' ? 'Todas as notificações foram lidas' : 'Você não tem notificações'}
          </Text>
        </View>
      );
    }

    return (
      <ScrollView 
        style={[styles.notificationsList, { maxHeight }]}
        showsVerticalScrollIndicator={false}
      >
        {notificationsData.notifications.map(renderNotification)}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderFilters()}
      {renderContent()}
      
      {/* Loading overlay para mutations */}
      {(markAsReadMutation.isPending || markAllAsReadMutation.isPending || deleteNotificationMutation.isPending) && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAllButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  markAllButtonText: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '500',
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  notificationsList: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#E5E7EB',
  },
  unreadNotificationCard: {
    backgroundColor: '#FFFFFF',
    borderLeftColor: '#3B82F6',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    flex: 1,
  },
  unreadNotificationTitle: {
    fontWeight: '600',
    color: '#1F2937',
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginRight: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  notificationMessage: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 8,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  loadingContainer: {
    padding: 16,
  },
  errorContainer: {
    padding: 32,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
});

