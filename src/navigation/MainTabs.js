import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MoodCheckinScreen } from '../screens/MoodCheckinScreen';
import { StudentDashboardScreen } from '../screens/StudentDashboardScreen';
import { useTheme } from '../theme';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Dashboard: { active: 'home', inactive: 'home-outline' },
  Mood: { active: 'heart', inactive: 'heart-outline' },
};

/**
 * Signed-in Student Bottom Tab Navigation.
 * We will add Screen Time, Activity, and Consent/Profile tabs in the next two steps.
 */
export function MainTabs() {
  const { colors, shadows } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.surfaceBorderSubtle,
          borderTopWidth: 1,
          height: 66,
          paddingBottom: 10,
          paddingTop: 8,
          ...shadows.elevated,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const pair = TAB_ICONS[route.name] || {
            active: 'ellipse',
            inactive: 'ellipse-outline',
          };
          return (
            <Ionicons
              name={focused ? pair.active : pair.inactive}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={StudentDashboardScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="Mood"
        component={MoodCheckinScreen}
        options={{ title: 'Mood' }}
      />
    </Tab.Navigator>
  );
}
