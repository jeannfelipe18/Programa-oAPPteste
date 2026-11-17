import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';

export interface SerieItem {
  id: string;
  setNumber: number;
  previousWeight?: number;
  previousReps?: number;
  weight: number;
  reps: number;
  completed: boolean;
}

interface SeriesGridProps {
  series: SerieItem[];
  onToggleComplete: (id: string) => void;
  onUpdateWeight: (id: string, weight: number) => void;
  onUpdateReps: (id: string, reps: number) => void;
  onAddSet: () => void;
  onRemoveSet: (id: string) => void;
}

export const SeriesGrid: React.FC<SeriesGridProps> = ({
  series,
  onToggleComplete,
  onUpdateWeight,
  onUpdateReps,
  onAddSet,
  onRemoveSet,
}) => {
  return (
    <View style={styles.container}>
      {/* Cabeçalho da Tabela */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCol, styles.colSet]}>SET</Text>
        <Text style={[styles.headerCol, styles.colPrev]}>ANTERIOR</Text>
        <Text style={[styles.headerCol, styles.colKg]}>KG</Text>
        <Text style={[styles.headerCol, styles.colReps]}>REPS</Text>
        <Text style={[styles.headerCol, styles.colCheck]}>CHECK</Text>
      </View>

      {/* Linhas das Séries */}
      {series.map((item) => {
        const isDone = item.completed;
        return (
          <View
            key={item.id}
            style={[styles.row, isDone && styles.rowCompleted]}
          >
            {/* Número da Série */}
            <View style={[styles.cell, styles.colSet]}>
              <View style={[styles.setBadge, isDone && styles.setBadgeDone]}>
                <Text style={[styles.setText, isDone && styles.setTextDone]}>
                  {item.setNumber}
                </Text>
              </View>
            </View>

            {/* Histórico Anterior */}
            <View style={[styles.cell, styles.colPrev]}>
              <Text style={styles.prevText}>
                {item.previousWeight ? `${item.previousWeight}kg × ${item.previousReps}` : '—'}
              </Text>
            </View>

            {/* Campo Carga (kg) */}
            <View style={[styles.cell, styles.colKg]}>
              <TextInput
                style={[styles.input, isDone && styles.inputDone]}
                keyboardType="numeric"
                value={item.weight > 0 ? item.weight.toString() : ''}
                placeholder="0"
                placeholderTextColor="#6B7280"
                onChangeText={(text) => {
                  const val = parseFloat(text) || 0;
                  onUpdateWeight(item.id, val);
                }}
                editable={!isDone}
              />
            </View>

            {/* Campo Repetições */}
            <View style={[styles.cell, styles.colReps]}>
              <TextInput
                style={[styles.input, isDone && styles.inputDone]}
                keyboardType="numeric"
                value={item.reps > 0 ? item.reps.toString() : ''}
                placeholder="0"
                placeholderTextColor="#6B7280"
                onChangeText={(text) => {
                  const val = parseInt(text, 10) || 0;
                  onUpdateReps(item.id, val);
                }}
                editable={!isDone}
              />
            </View>

            {/* Botão de Checkbox Verde */}
            <View style={[styles.cell, styles.colCheck]}>
              <TouchableOpacity
                style={[styles.checkBtn, isDone && styles.checkBtnDone]}
                activeOpacity={0.7}
                onPress={() => onToggleComplete(item.id)}
              >
                <Text style={[styles.checkIcon, isDone && styles.checkIconDone]}>
                  ✓
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      {/* Botões de Ação da Tabela */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.addSetBtn}
          activeOpacity={0.7}
          onPress={onAddSet}
        >
          <Text style={styles.addSetText}>+ Adicionar Série</Text>
        </TouchableOpacity>

        {series.length > 1 && (
          <TouchableOpacity
            style={styles.removeSetBtn}
            activeOpacity={0.7}
            onPress={() => onRemoveSet(series[series.length - 1].id)}
          >
            <Text style={styles.removeSetText}>- Remover Última</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#131A17',
    borderRadius: 14,
    padding: 12,
    marginVertical: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2924',
    marginBottom: 6,
  },
  headerCol: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
  },
  colSet: { width: 44 },
  colPrev: { flex: 1.2, textAlign: 'center' },
  colKg: { flex: 1, textAlign: 'center' },
  colReps: { flex: 1, textAlign: 'center' },
  colCheck: { width: 50, textAlign: 'center' },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 8,
  },
  rowCompleted: {
    backgroundColor: 'rgba(22, 163, 74, 0.08)',
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  setBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1E2924',
    alignItems: 'center',
    justifyContent: 'center',
  },
  setBadgeDone: {
    backgroundColor: '#16A34A',
  },
  setText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  setTextDone: {
    color: '#FFFFFF',
  },
  prevText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  input: {
    width: 56,
    height: 36,
    backgroundColor: '#1E2924',
    borderRadius: 8,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#2F3833',
  },
  inputDone: {
    backgroundColor: '#142E1F',
    borderColor: '#16A34A',
    color: '#4ADE80',
  },
  checkBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1E2924',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  checkBtnDone: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  checkIcon: {
    fontSize: 16,
    fontWeight: '800',
    color: '#6B7280',
  },
  checkIconDone: {
    color: '#FFFFFF',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1E2924',
  },
  addSetBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#1E2924',
    borderRadius: 8,
  },
  addSetText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
  },
  removeSetBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  removeSetText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#EF4444',
  },
});
