import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

export default function TrackerScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Daily Tracker</Text>
      
      {/* BP Logging Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Blood Pressure</Text>
        <Text style={styles.cardContent}>No reading recorded today.</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>+ Log BP Reading</Text>
        </TouchableOpacity>
      </View>

      {/* Food Logging Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Food Diary</Text>
        <Text style={styles.cardContent}>Track what you eat to monitor sodium.</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>+ Add Meal</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2c3e50',
  },
  cardContent: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});