import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Tab screens
import { DashboardTab } from './tabs/DashboardTab';
import { TreinosTab } from './tabs/TreinosTab';
import { ExerciciosTab } from './tabs/ExerciciosTab';
import { PerfilTab } from './tabs/PerfilTab';
import { ProgressScreen } from './tracker/ProgressScreen';
import { ActiveWorkoutScreen } from './tracker/ActiveWorkoutScreen';

interface HomeScreenProps {
  userEmail?: string;
  isGuest: boolean;
  onLogout: () => void;
}

type TabName = 'dashboard' | 'treinos' | 'progresso' | 'exercicios' | 'perfil';

const TABS: { key: TabName; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Início', icon: '🏠' },
  { key: 'treinos', label: 'Treinos', icon: '💪' },
  { key: 'progresso', label: 'Progresso', icon: '📊' },
  { key: 'exercicios', label: 'Exercícios', icon: '📋' },
  { key: 'perfil', label: 'Perfil', icon: '👤' },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userEmail,
  isGuest,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<TabName>('dashboard');
  const [isLiveWorkoutOpen, setIsLiveWorkoutOpen] = useState(false);

  const startLiveWorkout = () => {
    setIsLiveWorkoutOpen(true);
  };

  const closeLiveWorkout = () => {
    setIsLiveWorkoutOpen(false);
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardTab
            userEmail={userEmail}
            isGuest={isGuest}
            onStartLiveWorkout={startLiveWorkout}
          />
        );
      case 'treinos':
        return (
          <TreinosTab
            isGuest={isGuest}
            onStartLiveWorkout={startLiveWorkout}
          />
        );
      case 'progresso':
        return <ProgressScreen />;
      case 'exercicios':
        return <ExerciciosTab />;
      case 'perfil':
        return (
          <PerfilTab
            userEmail={userEmail}
            isGuest={isGuest}
            onLogout={onLogout}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Conteúdo da Aba Ativa */}
      <View style={styles.content}>{renderTab()}</View>

      {/* Bottom Tab Bar (5 Abas Conforme Arquitetura e Protótipo) */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              activeOpacity={0.7}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
                {tab.icon}
              </Text>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Modal / Tela de Acompanhamento ao Vivo (Tela 08 - Integrante 4) */}
      <Modal
        visible={isLiveWorkoutOpen}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={closeLiveWorkout}
      >
        <SafeAreaView style={styles.liveWorkoutModal}>
          <StatusBar style="light" />
          <ActiveWorkoutScreen
            onFinishWorkout={closeLiveWorkout}
            onCancelWorkout={closeLiveWorkout}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1311',
    paddingTop: Platform.OS === 'android' ? 36 : 0,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#131A17',
    borderTopWidth: 1,
    borderTopColor: '#1E2924',
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    paddingHorizontal: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
    opacity: 0.4,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#16A34A',
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    top: 0,
    width: 20,
    height: 3,
    backgroundColor: '#16A34A',
    borderRadius: 2,
  },
  liveWorkoutModal: {
    flex: 1,
    backgroundColor: '#0E1311',
  },
});
