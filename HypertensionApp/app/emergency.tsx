import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EmergencyScreen() {
  const router = useRouter();

  const handleCall = () => {
    // 112 is the standard emergency number in Nigeria (and many places)
    Linking.openURL('tel:112');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close-circle" size={32} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.alertIcon}>
        <Ionicons name="warning" size={80} color="#c0392b" />
      </View>

      <Text style={styles.title}>Hypertensive Crisis</Text>
      <Text style={styles.subtitle}>
        If your Blood Pressure is higher than 180/120 mmHg, you may be in danger.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚠️ Check for Symptoms</Text>
        <Text style={styles.cardText}>• Severe chest pain</Text>
        <Text style={styles.cardText}>• Severe headache with confusion</Text>
        <Text style={styles.cardText}>• Nausea and vomiting</Text>
        <Text style={styles.cardText}>• Severe anxiety</Text>
        <Text style={styles.cardText}>• Shortness of breath</Text>
        <Text style={styles.cardText}>• Seizures or unresponsiveness</Text>
      </View>

      <View style={styles.actionContainer}>
        <Text style={styles.actionTitle}>What to do:</Text>
        <Text style={styles.actionText}>
          1. Wait 5 minutes and test again. {'\n'}
          2. If readings remain high, contact a doctor immediately. {'\n'}
          3. If you have the symptoms above, call Emergency Services.
        </Text>
      </View>

      <TouchableOpacity style={styles.callButton} onPress={handleCall}>
        <Ionicons name="call" size={24} color="white" style={{ marginRight: 10 }} />
        <Text style={styles.callButtonText}>Call Emergency (112)</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, paddingTop: 50, backgroundColor: '#fff' },
  header: { alignItems: 'flex-end', marginBottom: 10 },
  backButton: { padding: 5 },
  alertIcon: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#c0392b', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#333', textAlign: 'center', marginBottom: 30, lineHeight: 24 },
  
  card: {
    backgroundColor: '#fdedec',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#c0392b',
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#c0392b', marginBottom: 10 },
  cardText: { fontSize: 16, color: '#333', marginBottom: 5, marginLeft: 10 },

  actionContainer: { marginBottom: 30, paddingHorizontal: 10 },
  actionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  actionText: { fontSize: 16, lineHeight: 26, color: '#555' },

  callButton: {
    backgroundColor: '#c0392b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: '#c0392b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
    marginBottom: 20,
  },
  callButtonText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
});