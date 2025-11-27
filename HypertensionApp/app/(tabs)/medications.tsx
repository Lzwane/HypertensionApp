import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  instructions: string;
  reminder: boolean;
}

export default function MedicationsScreen() {
  const router = useRouter();
  const [meds, setMeds] = useState<Medication[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadMeds();
    }, [])
  );

  const loadMeds = async () => {
    try {
      const existingData = await AsyncStorage.getItem('medications');
      if (existingData) {
        setMeds(JSON.parse(existingData));
      }
    } catch (error) {
      console.log('Error loading meds', error);
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Delete Medication",
      "Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            const newMeds = meds.filter(m => m.id !== id);
            setMeds(newMeds);
            await AsyncStorage.setItem('medications', JSON.stringify(newMeds));
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Medication }) => (
    <View style={styles.card}>
      <View style={styles.cardIcon}>
        <Ionicons name="medkit" size={24} color="#8e44ad" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.medName}>{item.name}</Text>
        <Text style={styles.medDosage}>{item.dosage}</Text>
        <Text style={styles.medInstructions}>{item.instructions}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={22} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Medications</Text>
      
      {meds.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No medications added yet.</Text>
          <Text style={styles.emptySubText}>Keep track of your prescriptions here.</Text>
        </View>
      ) : (
        <FlatList
          data={meds}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => router.push('/add-med')}
      >
        <Text style={styles.addButtonText}>+ Add New Medication</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  list: {
    paddingBottom: 100, // Space for the floating button
  },
  card: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3e5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  medName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  medDosage: {
    fontSize: 14,
    color: '#8e44ad',
    fontWeight: '600',
    marginTop: 2,
  },
  medInstructions: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  deleteBtn: {
    padding: 5,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#bdc3c7',
  },
  emptySubText: {
    fontSize: 14,
    color: '#bdc3c7',
    marginTop: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#8e44ad',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});