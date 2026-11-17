import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configura o manipulador de notificações quando o app está aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

let activeTimerNotificationId: string | null = null;

/**
 * Solicita permissões de notificação ao usuário
 */
export async function registerForPushNotificationsAsync(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Permissão para notificações não foi concedida.');
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('workout-timer', {
        name: 'Descanso de Treino',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#16A34A',
        sound: 'default',
      });

      await Notifications.setNotificationChannelAsync('daily-reminder', {
        name: 'Lembretes Diários',
        importance: Notifications.AndroidImportance.DEFAULT,
        sound: 'default',
      });
    }

    return true;
  } catch (err) {
    console.error('Erro ao configurar permissão de notificações:', err);
    return false;
  }
}

/**
 * Agenda notificação para o fim do tempo de descanso
 */
export async function scheduleRestTimerNotification(seconds: number, exerciseName?: string): Promise<string | null> {
  if (Platform.OS === 'web' || seconds <= 0) return null;

  try {
    // Cancela notificação anterior se houver
    await cancelRestTimerNotification();

    const title = '⏰ Hora da Próxima Série!';
    const body = exerciseName
      ? `Seu descanso terminou. Prepare-se para: ${exerciseName}!`
      : 'O tempo de descanso acabou. Vamos para a próxima série!';

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { type: 'rest_timer_end' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds,
        repeats: false,
      },
    });

    activeTimerNotificationId = id;
    return id;
  } catch (error) {
    console.warn('Falha ao agendar notificação de descanso:', error);
    return null;
  }
}

/**
 * Cancela a notificação de descanso ativa
 */
export async function cancelRestTimerNotification(): Promise<void> {
  if (activeTimerNotificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(activeTimerNotificationId);
    } catch {
      // Ignora erro se já tiver disparado
    } finally {
      activeTimerNotificationId = null;
    }
  }
}

/**
 * Agenda lembrete diário de treino
 */
export async function scheduleDailyWorkoutReminder(hour: number = 9, minute: number = 0): Promise<string | null> {
  if (Platform.OS === 'web') return null;

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '💪 Hora de Treinar! | GymFlow',
        body: 'Mantenha o foco e a consistência. Seu treino de hoje está te esperando!',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
    return id;
  } catch (error) {
    console.warn('Erro ao agendar lembrete diário:', error);
    return null;
  }
}
