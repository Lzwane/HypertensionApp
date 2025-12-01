import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Share, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// Firebase
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, auth } from './services/firebaseConfig';

export default function ReportScreen() {
  const router = useRouter();
  const [reportText, setReportText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    try {
      if (!auth.currentUser) {
        setReportText("Please log in to view your report.");
        setLoading(false);
        return;
      }

      const uid = auth.currentUser.uid;

      // 1. Fetch BP History (Last 10)
      const bpQ = query(collection(db, 'bp_readings'), where('userId', '==', uid), orderBy('date', 'desc'), limit(10));
      const bpSnap = await getDocs(bpQ);

      // 2. Fetch Meds
      const medQ = query(collection(db, 'medications'), where('userId', '==', uid));
      const medSnap = await getDocs(medQ);

      // 3. Fetch Food (Last 5)
      const foodQ = query(collection(db, 'food_logs'), where('userId', '==', uid), orderBy('date', 'desc'), limit(5));
      const foodSnap = await getDocs(foodQ);

      // 4. Fetch Symptoms (Last 5)
      const symQ = query(collection(db, 'symptoms'), where('userId', '==', uid), orderBy('date', 'desc'), limit(5));
      const symSnap = await getDocs(symQ);

      // --- Build String ---
      let report = `HEALTH REPORT\nPatient: ${auth.currentUser.displayName || 'User'}\nDate: ${new Date().toDateString()}\n\n`;

      report += `=== BLOOD PRESSURE LOG (Last 10) ===\n`;
      if (bpSnap.empty) report += `No readings recorded.\n`;
      bpSnap.forEach(doc => {
        const d = doc.data();
        report += `${d.systolic}/${d.diastolic} mmHg - ${new Date(d.date).toLocaleDateString()}\n`;
      });
      report += `\n`;

      report += `=== MEDICATIONS ===\n`;
      if (medSnap.empty) report += `No medications listed.\n`;
      medSnap.forEach(doc => {
        const d = doc.data();
        report += `- ${d.name} (${d.dosage}): ${d.instructions}\n`;
      });
      report += `\n`;

      report += `=== RECENT SYMPTOMS ===\n`;
      if (symSnap.empty) report += `No symptoms reported.\n`;
      symSnap.forEach(doc => {
        const d = doc.data();
        report += `- ${d.symptom} (Severity: ${d.severity}/5) - ${new Date(d.date).toLocaleDateString()}\n`;
      });
      report += `\n`;

      report += `=== FOOD DIARY (Last 5 Meals) ===\n`;
      if (foodSnap.empty) report += `No meals logged.\n`;
      foodSnap.forEach(doc => {
        const d = doc.data();
        report += `- ${d.meal} (${d.description})\n`;
      });

      setReportText(report);
      setLoading(false);

    } catch (error) {
      console.error(error);
      setReportText('Error generating report. Please try again.');
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: reportText,
        title: 'My Health Report',
      });
    } catch (error) {
      console.log('Error sharing', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Summary</Text>
        <TouchableOpacity onPress={generateReport} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#3498db" />
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>
        Review your data below before sharing with your doctor.
      </Text>

      <ScrollView style={styles.previewContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#3498db" style={{marginTop: 50}} />
        ) : (
          <Text style={styles.reportText}>{reportText}</Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>Share with Doctor</Text>
          <Ionicons name="share-outline" size={24} color="white" style={{marginLeft: 10}} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingTop: 50 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  backButton: { padding: 5 },
  refreshButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  description: { paddingHorizontal: 20, color: '#666', marginBottom: 20 },
  
  previewContainer: {
    flex: 1,
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  reportText: {
    fontFamily: 'Courier', // Monospace font looks more like a document
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
  },
  
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  shareButton: {
    backgroundColor: '#27ae60',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  shareButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});