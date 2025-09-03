import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Tipos de feedback háptico disponíveis
export enum HapticFeedbackType {
  // Feedback leve para interações sutis
  Light = 'light',
  // Feedback médio para ações importantes
  Medium = 'medium',
  // Feedback pesado para ações críticas
  Heavy = 'heavy',
  // Feedback de seleção para navegação
  Selection = 'selection',
  // Feedback de sucesso
  Success = 'success',
  // Feedback de aviso
  Warning = 'warning',
  // Feedback de erro
  Error = 'error',
  // Feedback de impacto leve
  ImpactLight = 'impactLight',
  // Feedback de impacto médio
  ImpactMedium = 'impactMedium',
  // Feedback de impacto pesado
  ImpactHeavy = 'impactHeavy',
}

// Configurações de feedback háptico
interface HapticConfig {
  enabled: boolean;
  intensity: number; // 0 a 1
  respectSystemSettings: boolean;
}

class HapticFeedbackManager {
  private config: HapticConfig = {
    enabled: true,
    intensity: 1.0,
    respectSystemSettings: true,
  };

  private lastFeedbackTime: number = 0;
  private minFeedbackInterval: number = 50; // ms entre feedbacks

  // Configurar o gerenciador de feedback háptico
  configure(config: Partial<HapticConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // Verificar se o feedback háptico está disponível
  isAvailable(): boolean {
    return Platform.OS !== 'web' && this.config.enabled;
  }

  // Verificar se deve executar o feedback (throttling)
  private shouldExecuteFeedback(): boolean {
    const now = Date.now();
    if (now - this.lastFeedbackTime < this.minFeedbackInterval) {
      return false;
    }
    this.lastFeedbackTime = now;
    return true;
  }

  // Executar feedback háptico
  async trigger(type: HapticFeedbackType): Promise<void> {
    if (!this.isAvailable() || !this.shouldExecuteFeedback()) {
      return;
    }

    try {
      switch (type) {
        case HapticFeedbackType.Light:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;

        case HapticFeedbackType.Medium:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;

        case HapticFeedbackType.Heavy:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;

        case HapticFeedbackType.Selection:
          await Haptics.selectionAsync();
          break;

        case HapticFeedbackType.Success:
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;

        case HapticFeedbackType.Warning:
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;

        case HapticFeedbackType.Error:
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;

        case HapticFeedbackType.ImpactLight:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;

        case HapticFeedbackType.ImpactMedium:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;

        case HapticFeedbackType.ImpactHeavy:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;

        default:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.warn('Erro ao executar feedback háptico:', error);
    }
  }

  // Feedback para diferentes tipos de interação
  async onButtonPress(isImportant: boolean = false): Promise<void> {
    const type = isImportant ? HapticFeedbackType.Medium : HapticFeedbackType.Light;
    await this.trigger(type);
  }

  async onToggle(): Promise<void> {
    await this.trigger(HapticFeedbackType.Selection);
  }

  async onSwipe(): Promise<void> {
    await this.trigger(HapticFeedbackType.Light);
  }

  async onLongPress(): Promise<void> {
    await this.trigger(HapticFeedbackType.Heavy);
  }

  async onSuccess(): Promise<void> {
    await this.trigger(HapticFeedbackType.Success);
  }

  async onError(): Promise<void> {
    await this.trigger(HapticFeedbackType.Error);
  }

  async onWarning(): Promise<void> {
    await this.trigger(HapticFeedbackType.Warning);
  }

  async onNavigation(): Promise<void> {
    await this.trigger(HapticFeedbackType.Selection);
  }

  async onRefresh(): Promise<void> {
    await this.trigger(HapticFeedbackType.Medium);
  }

  async onDelete(): Promise<void> {
    await this.trigger(HapticFeedbackType.Heavy);
  }

  async onAdd(): Promise<void> {
    await this.trigger(HapticFeedbackType.Medium);
  }

  async onEdit(): Promise<void> {
    await this.trigger(HapticFeedbackType.Light);
  }

  async onSave(): Promise<void> {
    await this.trigger(HapticFeedbackType.Success);
  }

  async onCancel(): Promise<void> {
    await this.trigger(HapticFeedbackType.Light);
  }

  async onConfirm(): Promise<void> {
    await this.trigger(HapticFeedbackType.Medium);
  }

  // Sequências de feedback para ações complexas
  async playSequence(types: HapticFeedbackType[], interval: number = 100): Promise<void> {
    for (let i = 0; i < types.length; i++) {
      await this.trigger(types[i]);
      if (i < types.length - 1) {
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }
  }

  // Feedback para diferentes estados de loading
  async onLoadingStart(): Promise<void> {
    await this.trigger(HapticFeedbackType.Light);
  }

  async onLoadingComplete(): Promise<void> {
    await this.trigger(HapticFeedbackType.Success);
  }

  async onLoadingError(): Promise<void> {
    await this.trigger(HapticFeedbackType.Error);
  }

  // Feedback para formulários
  async onFormFieldFocus(): Promise<void> {
    await this.trigger(HapticFeedbackType.Light);
  }

  async onFormFieldError(): Promise<void> {
    await this.trigger(HapticFeedbackType.Error);
  }

  async onFormSubmit(): Promise<void> {
    await this.trigger(HapticFeedbackType.Medium);
  }

  async onFormSuccess(): Promise<void> {
    await this.trigger(HapticFeedbackType.Success);
  }

  // Feedback para notificações
  async onNotificationReceived(priority: 'low' | 'medium' | 'high' = 'medium'): Promise<void> {
    switch (priority) {
      case 'low':
        await this.trigger(HapticFeedbackType.Light);
        break;
      case 'medium':
        await this.trigger(HapticFeedbackType.Medium);
        break;
      case 'high':
        await this.trigger(HapticFeedbackType.Heavy);
        break;
    }
  }

  // Feedback para gestos
  async onPinchStart(): Promise<void> {
    await this.trigger(HapticFeedbackType.Light);
  }

  async onPinchEnd(): Promise<void> {
    await this.trigger(HapticFeedbackType.Light);
  }

  async onRotateStart(): Promise<void> {
    await this.trigger(HapticFeedbackType.Light);
  }

  async onRotateEnd(): Promise<void> {
    await this.trigger(HapticFeedbackType.Light);
  }

  // Feedback para jogos/gamificação
  async onAchievementUnlocked(): Promise<void> {
    await this.playSequence([
      HapticFeedbackType.Medium,
      HapticFeedbackType.Success,
    ], 150);
  }

  async onLevelUp(): Promise<void> {
    await this.playSequence([
      HapticFeedbackType.Light,
      HapticFeedbackType.Medium,
      HapticFeedbackType.Heavy,
    ], 100);
  }

  async onPointsEarned(): Promise<void> {
    await this.trigger(HapticFeedbackType.Light);
  }

  // Desabilitar temporariamente o feedback
  disable(): void {
    this.config.enabled = false;
  }

  // Habilitar o feedback
  enable(): void {
    this.config.enabled = true;
  }

  // Obter configuração atual
  getConfig(): HapticConfig {
    return { ...this.config };
  }
}

// Instância global do gerenciador de feedback háptico
export const hapticFeedback = new HapticFeedbackManager();

// Hook para usar feedback háptico em componentes
export const useHapticFeedback = () => {
  return {
    trigger: hapticFeedback.trigger.bind(hapticFeedback),
    onButtonPress: hapticFeedback.onButtonPress.bind(hapticFeedback),
    onToggle: hapticFeedback.onToggle.bind(hapticFeedback),
    onSwipe: hapticFeedback.onSwipe.bind(hapticFeedback),
    onLongPress: hapticFeedback.onLongPress.bind(hapticFeedback),
    onSuccess: hapticFeedback.onSuccess.bind(hapticFeedback),
    onError: hapticFeedback.onError.bind(hapticFeedback),
    onWarning: hapticFeedback.onWarning.bind(hapticFeedback),
    onNavigation: hapticFeedback.onNavigation.bind(hapticFeedback),
    onRefresh: hapticFeedback.onRefresh.bind(hapticFeedback),
    onDelete: hapticFeedback.onDelete.bind(hapticFeedback),
    onAdd: hapticFeedback.onAdd.bind(hapticFeedback),
    onEdit: hapticFeedback.onEdit.bind(hapticFeedback),
    onSave: hapticFeedback.onSave.bind(hapticFeedback),
    onCancel: hapticFeedback.onCancel.bind(hapticFeedback),
    onConfirm: hapticFeedback.onConfirm.bind(hapticFeedback),
    isAvailable: hapticFeedback.isAvailable.bind(hapticFeedback),
    configure: hapticFeedback.configure.bind(hapticFeedback),
  };
};

// Utilitários para feedback contextual
export const contextualHaptics = {
  // Feedback para ações financeiras
  onExpenseAdded: () => hapticFeedback.onAdd(),
  onExpenseDeleted: () => hapticFeedback.onDelete(),
  onExpenseEdited: () => hapticFeedback.onEdit(),
  onGoalAchieved: () => hapticFeedback.onAchievementUnlocked(),
  onBudgetExceeded: () => hapticFeedback.onWarning(),
  
  // Feedback para navegação
  onTabSwitch: () => hapticFeedback.onNavigation(),
  onScreenTransition: () => hapticFeedback.onSelection(),
  onModalOpen: () => hapticFeedback.onLightPress(),
  onModalClose: () => hapticFeedback.onLightPress(),
  
  // Feedback para dados
  onDataRefresh: () => hapticFeedback.onRefresh(),
  onDataLoaded: () => hapticFeedback.onLoadingComplete(),
  onDataError: () => hapticFeedback.onLoadingError(),
  
  // Feedback para configurações
  onSettingChanged: () => hapticFeedback.onToggle(),
  onSettingSaved: () => hapticFeedback.onSave(),
  onSettingReset: () => hapticFeedback.onCancel(),
};

export default {
  HapticFeedbackType,
  hapticFeedback,
  useHapticFeedback,
  contextualHaptics,
};

