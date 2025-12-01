import { StyleSheet, Text, View, ScrollView, TouchableOpacity, useColorScheme, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from '../ctx'; 
import { signOut } from 'firebase/auth'; // Import signOut
import { auth } from '../services/firebaseConfig'; // Import auth object

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useSession(); // Get the real Firebase User
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning,";
    if (hour < 17) return "Good Afternoon,";
    return "Good Evening,";
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // The _layout.tsx will handle the redirection to login automatically
    } catch (error) {
      Alert.alert("Error", "Failed to sign out");
    }
  };

  const MenuItem = ({ title, icon, color, route, desc }: any) => (
    <TouchableOpacity 
      style={[styles.menuItem, isDark && styles.menuItemDark]} 
      onPress={() => router.push(route)}
    >
      <View style={[styles.iconBox, { backgroundColor: color }]}>
        <Ionicons name={icon} size={28} color="white" />
      </View>
      <View style={styles.menuText}>
        <Text style={[styles.menuTitle, isDark && styles.textLight]}>{title}</Text>
        <Text style={[styles.menuDesc, isDark && styles.textGray]}>{desc}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={isDark ? "#555" : "#ccc"} />
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={[styles.container, isDark && styles.containerDark]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* BRANDING HEADER */}
      <View style={styles.brandingHeader}>
        <View style={styles.logoBadge}>
          <Ionicons name="flask" size={16} color="white" />
        </View>
        <Text style={[styles.brandingText, isDark && styles.textLight]}>Syscare.ng</Text>
      </View>

      {/* USER GREETING */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={[styles.username, isDark && styles.textLight]}>
            {user?.displayName || 'User'} 
          </Text>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.profileBtn, isDark && styles.profileBtnDark]} 
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={24} color={isDark ? "#fff" : "#555"} />
        </TouchableOpacity>
      </View>

      {/* INSIGHT CARD */}
      <View style={styles.insightCard}>
        <Ionicons name="trending-up" size={40} color="white" />
        <View style={styles.insightContent}>
          <Text style={styles.insightTitle}>Weekly Status</Text>
          <Text style={styles.insightText}>
            Regular tracking helps your doctor make better decisions.
          </Text>
        </View>
      </View>

      {/* MAIN ACTIONS */}
      <View style={styles.menuContainer}>
        <Text style={[styles.sectionTitle, isDark && styles.textLight]}>Health Management</Text>
        
        <MenuItem 
          title="Daily Tracker" 
          icon="pulse" 
          color="#3498db" 
          route="/tracker"
          desc="Log BP, Steps, and Food"
        />
        
        <MenuItem 
          title="My Medications" 
          icon="medkit" 
          color="#8e44ad" 
          route="/medications" 
          desc="Pill reminders & list"
        />

        <MenuItem 
          title="Doctor Report" 
          icon="document-text" 
          color="#e67e22" 
          route="/report" 
          desc="Share summary via WhatsApp/Email"
        />

        <MenuItem 
          title="Find Pharmacy" 
          icon="location" 
          color="#16a085" 
          route="/pharmacy" 
          desc="Locate nearest refills"
        />

        <MenuItem 
          title="Health Assistant" 
          icon="chatbubbles" 
          color="#f1c40f" 
          route="/chat"
          desc="Ask AI about symptoms"
        />
        
        <MenuItem 
          title="Heart Education" 
          icon="school" 
          color="#27ae60" 
          route="/learn" 
          desc="Tips & Mini-Game"
        />
      </View>

      {/* EMERGENCY SECTION */}
      <View style={styles.bottomSection}>
         <MenuItem 
          title="Emergency Info" 
          icon="warning" 
          color="#c0392b" 
          route="/emergency"
          desc="Hypertensive Crisis Guide"
        />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, paddingTop: 60, backgroundColor: '#f8f9fa' },
  containerDark: { backgroundColor: '#121212' },
  
  // Text Styles
  textLight: { color: '#ffffff' },
  textGray: { color: '#aaaaaa' },

  // Branding
  brandingHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20, 
    opacity: 0.8 
  },
  logoBadge: { 
    width: 24, height: 24, borderRadius: 6, backgroundColor: '#3498db', 
    alignItems: 'center', justifyContent: 'center', marginRight: 8 
  },
  brandingText: { fontWeight: 'bold', fontSize: 14, color: '#333', letterSpacing: 1 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  greeting: { fontSize: 18, color: '#7f8c8d' },
  username: { fontSize: 32, fontWeight: 'bold', color: '#2c3e50' },
  profileBtn: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  profileBtnDark: { backgroundColor: '#333' },

  // Insight Card
  insightCard: {
    backgroundColor: '#3498db',
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40, 
  },
  insightContent: { marginLeft: 15, flex: 1 },
  insightTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  insightText: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 5 },

  // Menu
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  menuContainer: { gap: 15, marginBottom: 30 },
  menuItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  menuItemDark: { backgroundColor: '#1e1e1e' },
  
  iconBox: {
    width: 50, height: 50, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginRight: 15,
  },
  menuText: { flex: 1 },
  menuTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  menuDesc: { fontSize: 13, color: '#999', marginTop: 2 },

  bottomSection: { marginBottom: 40 },
});