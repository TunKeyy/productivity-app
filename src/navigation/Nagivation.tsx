import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Define the type for the tab navigator param list
type TabParamList = {
  Statistic: undefined;
  Calendar: undefined;
  Home: undefined;
  'AI Assistant': undefined;
  Dairy: undefined;
};

// Placeholder components for each screen
const StatisticScreen: React.FC = () => <View style={styles.screen}><Text>Statistic Screen</Text></View>;
const CalendarScreen: React.FC = () => <View style={styles.screen}><Text>Calendar Screen</Text></View>;
const HomeScreen: React.FC = () => <View style={styles.screen}><Text>Home Screen</Text></View>;
const AIAssistantScreen: React.FC = () => <View style={styles.screen}><Text>AI Assistant Screen</Text></View>;
const DairyScreen: React.FC = () => <View style={styles.screen}><Text>Dairy Screen</Text></View>;

const Tab = createBottomTabNavigator<TabParamList>();

export const Navigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'alert-circle';

            if (route.name === 'Statistic') {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            } else if (route.name === 'Calendar') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'AI Assistant') {
              iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
            } else if (route.name === 'Dairy') {
              iconName = focused ? 'book' : 'book-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { paddingBottom: 5 },
        })}
      >
        <Tab.Screen name="Statistic" component={StatisticScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <View style={styles.homeIconContainer}>
                <Ionicons name={focused ? 'home' : 'home-outline'} size={30} color={color} />
              </View>
            ),
          }}
        />
        <Tab.Screen name="AI Assistant" component={AIAssistantScreen} />
        <Tab.Screen name="Dairy" component={DairyScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20,
    borderWidth: 2,
    borderColor: 'tomato',
  },
});
