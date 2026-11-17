import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label = 'Progresso do Treino',
  showPercentage = true,
}) => {
  const percentage = total > 0 ? Math.min(Math.round((current / total) * 100), 100) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.countText}>
          <Text style={styles.currentCount}>{current}</Text>
          <Text style={styles.totalCount}> / {total} séries</Text>
          {showPercentage && <Text style={styles.percentage}> ({percentage}%)</Text>}
        </Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  countText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  currentCount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#16A34A',
  },
  totalCount: {
    fontWeight: '600',
    color: '#D1D5DB',
  },
  percentage: {
    fontWeight: '700',
    color: '#4ADE80',
  },
  track: {
    height: 8,
    backgroundColor: '#1E2924',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 4,
  },
});
