import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useCallback, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';

interface BPReading {
  id: number;
  systolic: string;
  diastolic: string;
  date: string;
}

interface FoodLog {
  id: number;
  meal: string;
  description: string;
  date: string;
}

export default function TrackerScreen() {
  const router = useRouter();
  const [lastReading, setLastReading] = useState<BPReading | null>(null);
  const [lastMeal, setLastMeal] = useState<FoodLog | null>(null);
  
  // Pedometer States
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  // Load Data (BP & Food)
  const loadData = async () => {
    try {
      const bpData = await AsyncStorage.getItem('bp_readings');
      if (bpData) {
        const readings = JSON.parse(bpData);
        if (readings.length > 0) setLastReading(readings[0]);
      }
      const foodData = await AsyncStorage.getItem('food_logs');
      if (foodData) {
        const logs = JSON.parse(foodData);
        if (logs.length > 0) setLastMeal(logs[0]);
      }
    } catch (error) {
      console.log('Error loading data', error);
    }
  };

  // Setup Pedometer (Runs once when app loads)
  useEffect(() => {
    let subscription: any;

    const subscribe = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable));

      if (isAvailable) {
        // Request Permission
        const perm = await Pedometer.requestPermissionsAsync();
        if (perm.granted) {
            // Get steps for today so far
            const end = new Date();
            const start = new Date();
            start.setHours(0,0,0,0);
            
            const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
            if (pastStepCountResult) {
                setCurrentStepCount(pastStepCountResult.steps);
            }

            // Watch for live updates
            subscription = Pedometer.watchStepCount(result => {
                // This API returns steps since the subscription started, 
                // so in a real app you'd add this to the historical total.
                // For this simple demo, we just increment.
                setCurrentStepCount(prev => prev + result.steps);
            });
        }
      }
    };

    subscribe();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Daily Tracker</Text>

      {/* STEP COUNTER CARD */}
      <View style={styles.stepCard}>
        <View style={styles.stepHeader}>
            <View>
                <Text style={styles.stepTitle}>Activity</Text>
                <Text style={styles.stepSubtitle}>Steps Today</Text>
            </View>
            <Ionicons name="footsteps" size={32} color="white" />
        </View>
        
        <View style={styles.stepContent}>
            <Text style={styles.stepCount}>{currentStepCount}</Text>
            <Text style={styles.stepGoal}> / 6,000 Goal</Text>
        </View>

        {isPedometerAvailable === 'false' && (
            <Text style={styles.warningText}>Sensor not available on this device.</Text>
        )}
      </View>
      
      {/* BP Logging Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Blood Pressure</Text>
        {lastReading ? (
          <View style={styles.readingContainer}>
            <Text style={styles.readingValue}>
              {lastReading.systolic}/{lastReading.diastolic}
            </Text>
            <Text style={styles.readingLabel}>mmHg</Text>
            <Text style={styles.readingDate}>
              {new Date(lastReading.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        ) : (
          <Text style={styles.cardContent}>No reading recorded today.</Text>
        )}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/bp-log')}
        >
          <Text style={styles.buttonText}>
            {lastReading ? '+ Log Another' : '+ Log BP Reading'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Food Logging Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Food Diary</Text>
        {lastMeal ? (
          <View style={styles.readingContainer}>
            <Text style={styles.foodName}>{lastMeal.meal}</Text>
            <Text style={styles.foodDesc}>{lastMeal.description}</Text>
            <Text style={styles.readingDate}>
              {new Date(lastMeal.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        ) : (
          <Text style={styles.cardContent}>Track what you eat to monitor sodium.</Text>
        )}
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#27ae60' }]} 
          onPress={() => router.push('/food-log')}
        >
          <Text style={styles.buttonText}>
            {lastMeal ? '+ Add Another Meal' : '+ Add Meal'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  
  // Step Card Styles
  stepCard: {
    backgroundColor: '#e67e22', // Orange for activity
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#e67e22',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  stepHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  stepTitle: { color: 'rgba(255,255,255,0.9)', fontSize: 16, fontWeight: '600' },
  stepSubtitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 5 },
  stepContent: { flexDirection: 'row', alignItems: 'baseline', marginTop: 20 },
  stepCount: { color: 'white', fontSize: 48, fontWeight: 'bold' },
  stepGoal: { color: 'rgba(255,255,255,0.8)', fontSize: 18, marginLeft: 10 },
  warningText: { color: 'rgba(0,0,0,0.4)', marginTop: 10, fontSize: 12 },

  // General Card Styles
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10, color: '#2c3e50' },
  cardContent: { fontSize: 14, color: '#7f8c8d', marginBottom: 15 },
  
  readingContainer: { marginBottom: 15 },
  readingValue: { fontSize: 32, fontWeight: 'bold', color: '#2c3e50' },
  readingLabel: { fontSize: 14, color: '#95a5a6' },
  readingDate: { fontSize: 12, color: '#bdc3c7', marginTop: 5 },
  
  foodName: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50' },
  foodDesc: { fontSize: 16, color: '#7f8c8d', marginTop: 2 },
  
  button: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});