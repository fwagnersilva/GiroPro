import AsyncStorage from './AsyncStorage.web';

export interface RememberMeData {
  email: string;
  rememberMe: boolean;
}

export class RememberMeStorage {
  private static readonly REMEMBER_ME_KEY = 'rememberMe';
  private static readonly REMEMBERED_EMAIL_KEY = 'rememberedEmail';

  /**
   * Salva os dados do Remember Me
   */
  static async saveRememberMe(email: string, remember: boolean): Promise<void> {
    try {
      if (remember) {
        await AsyncStorage.setItem(this.REMEMBERED_EMAIL_KEY, email);
        await AsyncStorage.setItem(this.REMEMBER_ME_KEY, 'true');
      } else {
        await this.clearRememberMe();
      }
    } catch (error) {
      console.error('Erro ao salvar dados do Remember Me:', error);
      throw error;
    }
  }

  /**
   * Carrega os dados salvos do Remember Me
   */
  static async loadRememberMe(): Promise<RememberMeData | null> {
    try {
      const savedEmail = await AsyncStorage.getItem(this.REMEMBERED_EMAIL_KEY);
      const savedRememberMe = await AsyncStorage.getItem(this.REMEMBER_ME_KEY);
      
      if (savedEmail && savedRememberMe === 'true') {
        return {
          email: savedEmail,
          rememberMe: true
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao carregar dados do Remember Me:', error);
      return null;
    }
  }

  /**
   * Remove todos os dados do Remember Me
   */
  static async clearRememberMe(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.REMEMBERED_EMAIL_KEY);
      await AsyncStorage.removeItem(this.REMEMBER_ME_KEY);
    } catch (error) {
      console.error('Erro ao limpar dados do Remember Me:', error);
      throw error;
    }
  }

  /**
   * Verifica se o Remember Me está ativo
   */
  static async isRememberMeActive(): Promise<boolean> {
    try {
      const savedRememberMe = await AsyncStorage.getItem(this.REMEMBER_ME_KEY);
      return savedRememberMe === 'true';
    } catch (error) {
      console.error('Erro ao verificar status do Remember Me:', error);
      return false;
    }
  }
}

