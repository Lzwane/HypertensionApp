import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  const MenuItem = ({ title, icon, color, route, desc }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={() => router.push(route)}>
      <View style={[styles.iconBox, { backgroundColor: color }]}>
        <Ionicons name={icon} size={28} color="white" />
      </View>
      <View style={styles.menuText}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuDesc}>{desc}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.username}>User</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <Ionicons name="person" size={24} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Main Action Grid */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      
      <View style={styles.menuContainer}>
        <MenuItem 
          title="Find Pharmacy" 
          icon="location" 
          color="#e74c3c" 
          route="/pharmacy"
          desc="Locate nearby refills"
        />
        
        <MenuItem 
          title="Generate Report" 
          icon="document-text" 
          color="#27ae60" 
          route="/report" 
          desc="Share data with doctor"
        />

        <MenuItem 
          title="Emergency Info" 
          icon="medical" 
          color="#c0392b" 
          route="/emergency" // Linking to mergency
          desc="BP > 180/120 guide"
        />
      </View>

      {/* Insight Card */}
      <View style={styles.insightCard}>
        <Ionicons name="trending-up" size={40} color="white" />
        <View style={styles.insightContent}>
          <Text style={styles.insightTitle}>Weekly Status</Text>
          <Text style={styles.insightText}>You've tracked your BP 0 times this week. Keep it up!</Text>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, paddingTop: 60, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  greeting: { fontSize: 18, color: '#7f8c8d' },
  username: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50' },
  profileBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  menuContainer: { gap: 15, marginBottom: 30 },
  menuItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  menuText: { flex: 1 },
  menuTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  menuDesc: { fontSize: 13, color: '#999', marginTop: 2 },
  
  insightCard: {
    backgroundColor: '#3498db',
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightContent: { marginLeft: 15, flex: 1 },
  insightTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  insightText: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 5 },
});