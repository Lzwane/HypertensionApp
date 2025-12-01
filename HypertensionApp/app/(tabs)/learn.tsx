import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { getDailyTipAI } from '../services/ai';

export default function LearnScreen() {
  const router = useRouter();
  const [dailyTip, setDailyTip] = useState('');
  const [loadingTip, setLoadingTip] = useState(true);

  useEffect(() => {
    initializeDailyFeatures();
  }, []);

  const initializeDailyFeatures = async () => {
    await checkDailyTip();
    await scheduleDailyNotification();
  };

  // 1. Daily Tip Logic
  const checkDailyTip = async () => {
    try {
      const today = new Date().toDateString();
      const storedDate = await AsyncStorage.getItem('tip_date');
      const storedTip = await AsyncStorage.getItem('daily_tip');

      if (storedDate === today && storedTip) {
        setDailyTip(storedTip);
        setLoadingTip(false);
      } else {
        // Fetch new tip from AI
        const newTip = await getDailyTipAI();
        setDailyTip(newTip);
        await AsyncStorage.setItem('tip_date', today);
        await AsyncStorage.setItem('daily_tip', newTip);
        setLoadingTip(false);
      }
    } catch (e) {
      console.log(e);
      setDailyTip("Eat more vegetables today!");
      setLoadingTip(false);
    }
  };

  // 2. Notification Logic
  const scheduleDailyNotification = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;

    // Check if already scheduled to avoid duplicates
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const hasDailyTip = scheduled.some(n => n.content.title === "💡 New Daily Tip");

    if (!hasDailyTip) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "💡 New Daily Tip",
          body: "Your new hypertension health tip is ready. Check it out!",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 9, // 9:00 AM every day
          minute: 0,
        },
      });
    }
  };

  const refreshTip = async () => {
    setLoadingTip(true);
    const newTip = await getDailyTipAI();
    setDailyTip(newTip);
    // Update storage so it persists for the rest of the day
    await AsyncStorage.setItem('daily_tip', newTip);
    setLoadingTip(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Learn & Play</Text>

      {/* DAILY TIP CARD */}
      <View style={styles.tipCard}>
        <View style={styles.tipHeader}>
          <Ionicons name="bulb" size={24} color="#f1c40f" />
          <Text style={styles.tipTitle}>Tip of the Day</Text>
          <TouchableOpacity onPress={refreshTip}>
            <Ionicons name="refresh" size={20} color="white" />
          </TouchableOpacity>
        </View>
        {loadingTip ? (
          <ActivityIndicator color="white" style={{ marginTop: 10 }} />
        ) : (
          <Text style={styles.tipText}>"{dailyTip}"</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Mini Games</Text>

      {/* GAME 1: AI QUIZ */}
      <TouchableOpacity style={styles.gameCard} onPress={() => router.push('/quiz')}>
        <View style={[styles.iconBox, { backgroundColor: '#3498db' }]}>
          <Ionicons name="school" size={32} color="white" />
        </View>
        <View style={styles.gameContent}>
          <Text style={styles.gameTitle}>BP Master Quiz</Text>
          <Text style={styles.gameDesc}>AI-generated questions to test your knowledge.</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </TouchableOpacity>

      {/* GAME 2: SODIUM SORTER */}
      <TouchableOpacity style={styles.gameCard} onPress={() => router.push('/sodium-game')}>
        <View style={[styles.iconBox, { backgroundColor: '#e67e22' }]}>
          <Ionicons name="nutrition" size={32} color="white" />
        </View>
        <View style={styles.gameContent}>
          <Text style={styles.gameTitle}>Sodium Sorter</Text>
          <Text style={styles.gameDesc}>Swipe or tap: Is this food High or Low sodium?</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, paddingTop: 60, backgroundColor: '#f8f9fa' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  
  tipCard: {
    backgroundColor: '#8e44ad',
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: '#8e44ad', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5,
  },
  tipHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  tipTitle: { color: 'white', fontWeight: 'bold', fontSize: 18, flex: 1, marginLeft: 10 },
  tipText: { color: 'white', fontSize: 16, lineHeight: 24, fontStyle: 'italic' },

  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' },

  gameCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 3,
  },
  iconBox: { width: 60, height: 60, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  gameContent: { flex: 1 },
  gameTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  gameDesc: { fontSize: 13, color: '#7f8c8d', marginTop: 4 },
});