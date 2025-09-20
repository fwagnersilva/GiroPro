import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import { NotificationCenter } from './NotificationCenter';

interface NotificationBellProps {
  size?: number;
  color?: string;
  showBadge?: boolean;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  size = 24,
  color = '#1F2937',
  showBadge = true,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  // Query para contagem de não lidas
  const { data: unreadData } = useQuery({
    queryKey: ['unread-count'],
    queryFn: () => notificationService.getUnreadCount(),
    refetchInterval: 30 * 1000, // Atualizar a cada 30 segundos
    staleTime: 15 * 1000, // 15 segundos
  });

  const unreadCount = unreadData?.unread_count || 0;

  const handlePress = () => {
    setShowNotifications(true);
  };

  const handleClose = () => {
    setShowNotifications(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={handlePress}>
        {/* Ícone do sino */}
        <View style={[styles.bellIcon, { width: size, height: size }]}>
          <Text style={[styles.bellText, { fontSize: size * 0.8, color }]}>🔔</Text>
        </View>

        {/* Badge de contagem */}
        {showBadge && unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 99 ? '99+' : unreadCount.toString()}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Modal com centro de notificações */}
      <Modal
        visible={showNotifications}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <NotificationCenter onClose={handleClose} maxHeight={500} />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 4,
  },
  bellIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellText: {
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
});

