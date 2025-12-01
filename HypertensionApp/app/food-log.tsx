import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from './services/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { analyzeFoodImageAI } from './services/ai';

export default function FoodLogScreen() {
  const router = useRouter();
  const [meal, setMeal] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{ verdict: string, reason: string } | null>(null);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert('Permission needed', 'Camera and gallery permissions are required.');
      return false;
    }
    return true;
  };

  const pickImage = async (useCamera: boolean) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    let result;
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true, // We need base64 for the AI
    };

    if (useCamera) {
      result = await ImagePicker.launchCameraAsync(options);
    } else {
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      
      if (asset.base64) {
        performAIAnalysis(asset.base64);
      }
    }
  };

  const performAIAnalysis = async (base64: string) => {
    setAnalyzing(true);
    setAiAnalysis(null);
    
    try {
      const result = await analyzeFoodImageAI(base64);
      
      if (result) {
        setMeal(result.foodName);
        setAiAnalysis({
          verdict: result.verdict,
          reason: result.reason
        });
        
        // Auto-fill description with the AI reason
        if (!description) {
          setDescription(result.reason);
        }
      } else {
        Alert.alert("AI Error", "Could not analyze the food.");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Something went wrong during analysis.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!meal) {
      Alert.alert('Missing Data', 'Please enter what you ate.');
      return;
    }

    if (!auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to save data.');
      return;
    }

    try {
      await addDoc(collection(db, 'food_logs'), {
        userId: auth.currentUser.uid, // User Separation
        meal,
        description,
        date: new Date().toISOString(),
        aiVerdict: aiAnalysis?.verdict || null,
        // In a real app, you'd upload the image to Firebase Storage and save the URL here
        // imageUri: uploadedUrl 
      });

      Alert.alert('Success', 'Meal recorded!');
      router.back(); 
    } catch (error) {
      Alert.alert('Error', 'Could not save to cloud');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Log Meal</Text>

      {/* AI Analysis Section */}
      <View style={styles.aiSection}>
        <Text style={styles.sectionLabel}>AI Food Checker 📸</Text>
        <Text style={styles.helperText}>Take a photo to check if it's safe!</Text>
        
        <View style={styles.imageButtons}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => pickImage(true)}>
            <Ionicons name="camera" size={24} color="white" />
            <Text style={styles.iconBtnText}>Camera</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: '#34495e' }]} onPress={() => pickImage(false)}>
            <Ionicons name="images" size={24} color="white" />
            <Text style={styles.iconBtnText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        {imageUri && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            {analyzing && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>Analyzing...</Text>
              </View>
            )}
          </View>
        )}

        {aiAnalysis && (
          <View style={[
            styles.resultCard, 
            aiAnalysis.verdict === 'Safe' ? styles.safeCard : 
            aiAnalysis.verdict === 'Avoid' ? styles.avoidCard : styles.moderateCard
          ]}>
            <Text style={styles.resultTitle}>
              Verdict: {aiAnalysis.verdict.toUpperCase()}
            </Text>
            <Text style={styles.resultReason}>{aiAnalysis.reason}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>What did you eat?</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Jollof Rice" 
          value={meal}
          onChangeText={setMeal}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Notes (Sodium/Portion)</Text>
        <TextInput 
          style={[styles.input, { height: 80 }]} 
          placeholder="e.g. A little salty, small portion" 
          multiline
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Meal</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, paddingTop: 60, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 8, color: '#333', fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
    backgroundColor: '#f9f9f9',
  },
  
  // AI Section Styles
  aiSection: {
    backgroundColor: '#f0f4f8',
    padding: 15,
    borderRadius: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#e1e8ed'
  },
  sectionLabel: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5 },
  helperText: { fontSize: 14, color: '#7f8c8d', marginBottom: 15 },
  imageButtons: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  iconBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  iconBtnText: { color: 'white', fontWeight: '600' },
  
  imagePreviewContainer: { position: 'relative', marginBottom: 15, borderRadius: 10, overflow: 'hidden' },
  imagePreview: { width: '100%', height: 200, borderRadius: 10 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: { color: 'white', marginTop: 10, fontWeight: 'bold' },

  resultCard: { padding: 15, borderRadius: 10, borderWidth: 1 },
  safeCard: { backgroundColor: '#d4edda', borderColor: '#c3e6cb' },
  moderateCard: { backgroundColor: '#fff3cd', borderColor: '#ffeeba' },
  avoidCard: { backgroundColor: '#f8d7da', borderColor: '#f5c6cb' },
  resultTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  resultReason: { fontSize: 14, color: '#555' },

  saveButton: {
    backgroundColor: '#27ae60', // Green color for food
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  cancelButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: { color: '#e74c3c', fontSize: 16 },
});