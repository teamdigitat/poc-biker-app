import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { Slot, useRouter } from 'expo-router';
import { useAuth } from '@/components/auth-context';
import { useCustomTheme } from '@/components/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DrawerContextType {
  openDrawer: () => void;
  closeDrawer: () => void;
  isDrawerOpen: boolean;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
};

const DRAWER_WIDTH = 280;
// const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, colors } = useCustomTheme();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const openDrawer = () => {
    setIsOpen(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsOpen(false);
    });
  };

  const handleLogout = async () => {
    closeDrawer();
    await logout();
    router.replace('/login');
  };

  const isDark = theme === 'dark';

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer, isDrawerOpen: isOpen }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        
        {/* Main Content Area */}
        <View style={styles.mainContent}>
          <Slot />
        </View>

        {/* Custom Slide-out Drawer */}
        {isOpen && (
          <View style={StyleSheet.absoluteFill}>
            {/* Dark Backdrop */}
            <TouchableWithoutFeedback onPress={closeDrawer}>
              <Animated.View 
                style={[
                  styles.backdrop, 
                  { opacity: backdropAnim }
                ]} 
              />
            </TouchableWithoutFeedback>

            {/* Sliding Panel */}
            <Animated.View
              style={[
                styles.drawerContainer,
                {
                  transform: [{ translateX: slideAnim }],
                  backgroundColor: isDark ? '#1F2225' : '#F6F8FA',
                  borderColor: isDark ? '#2E3236' : '#E1E4E6',
                },
              ]}
            >
              <SafeAreaView style={styles.drawerSafeArea}>
                
                {/* Top Section - User Profile */}
                <View style={[styles.profileSection, { borderBottomColor: isDark ? '#2E3236' : '#E1E4E6' }]}>
                  <View style={[styles.avatarContainer, { backgroundColor: colors.tint }]}>
                    <Text style={styles.avatarText}>
                      {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                  </View>
                  <Text style={[styles.profileName, { color: colors.text }]} numberOfLines={1}>
                    {user?.fullName || 'User'}
                  </Text>
                  <Text style={[styles.profileUsername, { color: isDark ? '#9BA1A6' : '#687076' }]} numberOfLines={1}>
                    @{user?.username || 'username'}
                  </Text>
                </View>

                {/* Middle Section - Navigation Links */}
                <View style={styles.navSection}>
                  <TouchableOpacity 
                    style={[styles.navItem, { backgroundColor: isDark ? '#2E3236' : '#E8ECEF' }]}
                    onPress={closeDrawer}
                  >
                    <Ionicons name="home" size={22} color={colors.tint} />
                    <Text style={[styles.navText, { color: colors.text, fontWeight: '700' }]}>Home</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.navItem} onPress={closeDrawer}>
                    <Ionicons name="bicycle" size={22} color={isDark ? '#9BA1A6' : '#687076'} />
                    <Text style={[styles.navText, { color: colors.text }]}>My Rides</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.navItem} onPress={closeDrawer}>
                    <Ionicons name="people" size={22} color={isDark ? '#9BA1A6' : '#687076'} />
                    <Text style={[styles.navText, { color: colors.text }]}>Clubs</Text>
                  </TouchableOpacity>
                </View>

                {/* Bottom Section - Toggle Theme & Logout */}
                <View style={[styles.bottomSection, { borderTopColor: isDark ? '#2E3236' : '#E1E4E6' }]}>
                  {/* Theme Toggle Button */}
                  <TouchableOpacity 
                    style={[styles.bottomButton, { backgroundColor: isDark ? '#2E3236' : '#E8ECEF' }]} 
                    onPress={toggleTheme}
                  >
                    <Ionicons 
                      name={isDark ? "sunny" : "moon"} 
                      size={20} 
                      color={isDark ? '#F59E0B' : '#4B5563'} 
                    />
                    <Text style={[styles.bottomButtonText, { color: colors.text }]}>
                      {isDark ? 'Light Mode' : 'Dark Mode'}
                    </Text>
                  </TouchableOpacity>

                  {/* Logout Button */}
                  <TouchableOpacity 
                    style={[styles.bottomButton, styles.logoutButton, { backgroundColor: isDark ? '#421E22' : '#FEE2E2' }]} 
                    onPress={handleLogout}
                  >
                    <Ionicons name="log-out" size={20} color="#EF4444" />
                    <Text style={[styles.bottomButtonText, { color: '#EF4444' }]}>
                      Log Out
                    </Text>
                  </TouchableOpacity>
                </View>

              </SafeAreaView>
            </Animated.View>
          </View>
        )}

      </View>
    </DrawerContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  drawerContainer: {
    width: DRAWER_WIDTH,
    height: '100%',
    borderRightWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  drawerSafeArea: {
    flex: 1,
  },
  profileSection: {
    padding: 24,
    borderBottomWidth: 1,
    alignItems: 'flex-start',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '700',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    width: '100%',
  },
  profileUsername: {
    fontSize: 14,
  },
  navSection: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  navText: {
    fontSize: 15,
    fontWeight: '500',
  },
  bottomSection: {
    padding: 16,
    borderTopWidth: 1,
    gap: 8,
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
    gap: 12,
  },
  bottomButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: 4,
  },
});
