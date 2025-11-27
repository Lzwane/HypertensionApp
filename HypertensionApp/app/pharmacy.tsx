import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';

export default function PharmacyScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // 1. Request Permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      // 2. Get Current Location
      try {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      } catch (e) {
        setErrorMsg('Could not fetch location. Ensure GPS is on.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openMaps = () => {
    if (location) {
      const { latitude, longitude } = location.coords;
      // Opens Apple Maps (or Google Maps on Android) searching for 'Pharmacy' at this location
      const url = `http://maps.apple.com/?q=Pharmacy&ll=${latitude},${longitude}`;
      Linking.openURL(url);
    } else {
      Alert.alert("Waiting", "Still getting your location...");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find Refills</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="location" size={60} color="#e74c3c" />
        </View>

        <Text style={styles.title}>Locate Nearest Pharmacy</Text>
        <Text style={styles.subtitle}>
          Find medication refills quickly, especially when traveling.
        </Text>

        {loading ? (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.statusText}>Locating you...</Text>
          </View>
        ) : errorMsg ? (
          <View style={styles.statusContainer}>
            <Ionicons name="alert-circle" size={40} color="#e74c3c" />
            <Text style={[styles.statusText, { color: '#e74c3c' }]}>{errorMsg}</Text>
          </View>
        ) : (
          <View style={styles.statusContainer}>
            <Text style={styles.successText}>Location Found!</Text>
            <Text style={styles.coords}>
              Lat: {location?.coords.latitude.toFixed(4)}, Long: {location?.coords.longitude.toFixed(4)}
            </Text>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.button, (!location && !errorMsg) && styles.buttonDisabled]} 
          onPress={openMaps}
          disabled={!location && !errorMsg}
        >
          <Text style={styles.buttonText}>Search Pharmacies Near Me</Text>
          <Ionicons name="map" size={24} color="white" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 15, color: '#333' },
  content: { flex: 1, alignItems: 'center', padding: 30, justifyContent: 'center' },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fdedec',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#2c3e50' },
  subtitle: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginBottom: 40, lineHeight: 24 },
  statusContainer: { alignItems: 'center', marginBottom: 40, height: 80 },
  statusText: { marginTop: 10, color: '#3498db', fontSize: 16 },
  successText: { fontSize: 18, color: '#27ae60', fontWeight: 'bold' },
  coords: { fontSize: 14, color: '#95a5a6', marginTop: 5 },
  button: {
    backgroundColor: '#3498db',
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: { backgroundColor: '#bdc3c7' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});