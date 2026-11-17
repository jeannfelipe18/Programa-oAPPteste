import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface PRItem {
  id: string;
  exerciseName: string;
  muscleGroup: string;
  maxWeight: number;
  reps: number;
  achievedAt: string;
  previousWeight?: number;
}

interface PRCardProps {
  item: PRItem;
}

export const PRCard: React.FC<PRCardProps> = ({ item }) => {
  const diff = item.previousWeight ? item.maxWeight - item.previousWeight : 0;
  const isIncrease = diff > 0;

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.trophyBadge}>
          <Text style={styles.trophyIcon}>🏆</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.exerciseName}>{item.exerciseName}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.muscleGroup}>{item.muscleGroup}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.date}>{item.achievedAt}</Text>
          </View>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={styles.weight}>
          {item.maxWeight} <Text style={styles.unit}>kg</Text>
        </Text>
        <Text style={styles.reps}>{item.reps} {item.reps === 1 ? 'rep' : 'reps'}</Text>
        {item.previousWeight !== undefined && (
          <View style={[styles.trendBadge, isIncrease ? styles.trendUp : styles.trendNeutral]}>
            <Text style={[styles.trendText, isIncrease ? styles.trendTextUp : styles.trendTextNeutral]}>
              {isIncrease ? `+${diff}kg` : 'Novo Recorde'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#131A17',
    borderRadius: 14,
    padding: 14,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#1E2924',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  trophyBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1F2923',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EAB308',
  },
  trophyIcon: {
    fontSize: 20,
  },
  info: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  muscleGroup: {
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '600',
  },
  dot: {
    fontSize: 12,
    color: '#6B7280',
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  right: {
    alignItems: 'flex-end',
  },
  weight: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  unit: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  reps: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 1,
  },
  trendBadge: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trendUp: {
    backgroundColor: 'rgba(22, 163, 74, 0.2)',
  },
  trendNeutral: {
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
  },
  trendText: {
    fontSize: 10,
    fontWeight: '700',
  },
  trendTextUp: {
    color: '#4ADE80',
  },
  trendTextNeutral: {
    color: '#EAB308',
  },
});
