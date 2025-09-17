import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../theme/tokens';
import { typography, spacing } from '../styles/responsive';
import { journeySchema } from '../schemas/journeySchemas';

interface AddJourneyModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (kmInicio: number, dataInicio: string) => void;
  loading: boolean;
}

const AddJourneyModal: React.FC<AddJourneyModalProps> = ({
  visible,
  onClose,
  onSubmit,
  loading,
}) => {
  const [kmInicio, setKmInicio] = useState("");
  const [dataInicio, setDataInicio] = useState(new Date().toISOString()); // Inicializa com a data e hora atuais

  const handleSubmit = () => {
    try {
      journeySchema.parse({ kmInicio: Number(kmInicio), dataInicio });
      onSubmit(Number(kmInicio), dataInicio);
    } catch (e: any) {
      Alert.alert('Erro de Validação', e.errors[0].message);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCancelButton}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Nova Jornada</Text>
          <TouchableOpacity onPress={handleSubmit} disabled={loading}>
            <Text style={styles.modalSaveButton}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Quilometragem Inicial *</Text>
            <TextInput
              style={styles.formInput}
              value={kmInicio}
              onChangeText={setKmInicio}
              placeholder="Ex: 12345"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.formLabel}>Data e Hora de Início *</Text>
            <TextInput
              style={styles.formInput}
              value={dataInicio}
              onChangeText={setDataInicio}
              placeholder="AAAA-MM-DDTHH:mm:ssZ"
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.borderLight,
    backgroundColor: lightTheme.colors.surface,
  },
  modalCancelButton: {
    ...typography.body,
    color: lightTheme.colors.primary,
  },
  modalTitle: {
    ...typography.h3,
    color: lightTheme.colors.text,
  },
  modalSaveButton: {
    ...typography.body,
    color: lightTheme.colors.primary,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: spacing[4],
  },
  formField: {
    marginBottom: spacing[4],
  },
  formLabel: {
    ...typography.body,
    color: lightTheme.colors.text,
    marginBottom: spacing[2],
    fontWeight: '600',
  },
  formInput: {
    borderWidth: 1,
    borderColor: lightTheme.colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    ...typography.body,
    color: lightTheme.colors.text,
    backgroundColor: lightTheme.colors.surface,
  },
});

export default AddJourneyModal;


