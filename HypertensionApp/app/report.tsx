import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Share, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function ReportScreen() {
  const router = useRouter();
  const [reportText, setReportText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    try {
      // 1. Gather all data
      const bpData = await AsyncStorage.getItem('bp_readings');
      const medData = await AsyncStorage.getItem('medications');
      const foodData = await AsyncStorage.getItem('food_logs');

      const readings = bpData ? JSON.parse(bpData) : [];
      const meds = medData ? JSON.parse(medData) : [];
      const foods = foodData ? JSON.parse(foodData) : [];

      // 2. Build the Report String
      let report = `HEALTH REPORT - ${new Date().toDateString()}\n\n`;

      // -- BP Section
      report += `--- BLOOD PRESSURE LOG ---\n`;
      if (readings.length > 0) {
        // Take last 5 readings
        readings.slice(0, 5).forEach((r: any) => {
          report += `${r.systolic}/${r.diastolic} mmHg - ${new Date(r.date).toLocaleDateString()}\n`;
        });
      } else {
        report += `No readings recorded.\n`;
      }
      report += `\n`;

      // -- Meds Section
      report += `--- CURRENT MEDICATIONS ---\n`;
      if (meds.length > 0) {
        meds.forEach((m: any) => {
          report += `- ${m.name} (${m.dosage}): ${m.instructions}\n`;
        });
      } else {
        report += `No medications listed.\n`;
      }
      report += `\n`;

      // -- Food Section
      report += `--- RECENT MEALS ---\n`;
      if (foods.length > 0) {
        foods.slice(0, 3).forEach((f: any) => {
          report += `- ${f.meal} (${f.description})\n`;
        });
      } else {
        report += `No meals logged.\n`;
      }

      setReportText(report);
      setLoading(false);

    } catch (error) {
      console.error(error);
      setReportText('Error generating report.');
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
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 15, color: '#333' },
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
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
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