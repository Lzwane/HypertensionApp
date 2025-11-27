import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: isDark ? '#888' : '#999',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
          borderTopColor: isDark ? '#333' : '#eee',
        }
      }}>
      
      {/* 1. Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />

      {/* 2. Tracker */}
      <Tabs.Screen
        name="tracker"
        options={{
          title: 'Tracker',
          tabBarIcon: ({ color }) => <Ionicons name="pulse" size={24} color={color} />,
        }}
      />

      {/* 3. Medications */}
      <Tabs.Screen
        name="medications"
        options={{
          title: 'Meds',
          tabBarIcon: ({ color }) => <Ionicons name="medkit" size={24} color={color} />,
        }}
      />

      {/* 4. Education */}
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color }) => <Ionicons name="school" size={24} color={color} />,
        }}
      />

      {/* 5. AI Chat */}
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Assistant',
          tabBarIcon: ({ color }) => <Ionicons name="chatbubbles" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}