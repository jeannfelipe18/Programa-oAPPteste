import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface RestTimerDisplayProps {
  timeLeft: number;
  totalDuration: number;
  isRunning: boolean;
  formattedTime: string;
  onStart: (seconds: number) => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onAddTime: (seconds: number) => void;
}

export const RestTimerDisplay: React.FC<RestTimerDisplayProps> = ({
  timeLeft,
  totalDuration,
  isRunning,
  formattedTime,
  onStart,
  onPause,
  onResume,
  onReset,
  onAddTime,
}) => {
  const isTimerActive = timeLeft > 0;
  const progressPercent = totalDuration > 0 ? Math.min(100, Math.round(((totalDuration - timeLeft) / totalDuration) * 100)) : 0;

  return (
    <View style={styles.container}>
      {/* Cabeçalho do Timer */}
      <View style={styles.headerRow}>
        <View style={styles.titleArea}>
          <Text style={styles.icon}>⏱️</Text>
          <Text style={styles.title}>Cronômetro de Descanso</Text>
        </View>
        {isTimerActive && (
          <TouchableOpacity style={styles.skipBtn} onPress={onReset}>
            <Text style={styles.skipText}>Pular</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Visor Central */}
      <View style={styles.displayArea}>
        <Text style={[styles.timerDigits, isTimerActive && styles.timerDigitsActive]}>
          {isTimerActive ? formattedTime : '00:00'}
        </Text>
        <Text style={styles.statusText}>
          {isTimerActive
            ? isRunning
              ? 'Descansando...'
              : 'Pausado'
            : 'Selecione o tempo ou marque a série'}
        </Text>

        {/* Barra de progresso circular/horizontal do descanso */}
        {isTimerActive && (
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
        )}
      </View>

      {/* Presets de Tempo (60s / 90s / 120s) & Ações */}
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.presetBtn, totalDuration === 60 && isTimerActive && styles.presetBtnActive]}
          activeOpacity={0.7}
          onPress={() => onStart(60)}
        >
          <Text style={[styles.presetText, totalDuration === 60 && isTimerActive && styles.presetTextActive]}>
            60s
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.presetBtn, totalDuration === 90 && isTimerActive && styles.presetBtnActive]}
          activeOpacity={0.7}
          onPress={() => onStart(90)}
        >
          <Text style={[styles.presetText, totalDuration === 90 && isTimerActive && styles.presetTextActive]}>
            90s
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.presetBtn, totalDuration === 120 && isTimerActive && styles.presetBtnActive]}
          activeOpacity={0.7}
          onPress={() => onStart(120)}
        >
          <Text style={[styles.presetText, totalDuration === 120 && isTimerActive && styles.presetTextActive]}>
            120s
          </Text>
        </TouchableOpacity>

        {isTimerActive ? (
          <>
            <TouchableOpacity
              style={styles.addTimeBtn}
              activeOpacity={0.7}
              onPress={() => onAddTime(30)}
            >
              <Text style={styles.addTimeText}>+30s</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlBtn, isRunning ? styles.pauseBtn : styles.playBtn]}
              activeOpacity={0.7}
              onPress={isRunning ? onPause : onResume}
            >
              <Text style={styles.controlBtnText}>{isRunning ? '⏸' : '▶'}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.controlBtn, styles.playBtn]}
            activeOpacity={0.7}
            onPress={() => onStart(60)}
          >
            <Text style={styles.controlBtnText}>▶ Iniciar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#131A17',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E2924',
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 16,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D1D5DB',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  skipBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#1E2924',
    borderRadius: 6,
  },
  skipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  displayArea: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  timerDigits: {
    fontSize: 44,
    fontWeight: '900',
    color: '#4B5563',
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  timerDigitsActive: {
    color: '#16A34A',
  },
  statusText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  progressBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#1E2924',
    borderRadius: 2,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 2,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 8,
  },
  presetBtn: {
    flex: 1,
    height: 38,
    backgroundColor: '#1E2924',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2F3833',
  },
  presetBtnActive: {
    backgroundColor: '#142E1F',
    borderColor: '#16A34A',
  },
  presetText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  presetTextActive: {
    color: '#4ADE80',
  },
  addTimeBtn: {
    paddingHorizontal: 12,
    height: 38,
    backgroundColor: '#1E2924',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTimeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  controlBtn: {
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    backgroundColor: '#16A34A',
  },
  pauseBtn: {
    backgroundColor: '#D97706',
  },
  controlBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
