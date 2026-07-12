import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
	Text,
	View,
	TouchableOpacity,
	ScrollView,
	StatusBar,
} from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useAuth } from '@/components/auth-context';
import { useCustomTheme } from '@/components/theme-context';
import { Badge } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function index() {
	const { user } = useAuth();
	const { theme, colors } = useCustomTheme();
	const navigation = useNavigation();

	const [showQrOptions, setShowQrOptions] = useState(false);
	const [showTopBanner, setShowTopBanner] = useState(true);
	const isDark = theme === 'dark';

	const openNavSidebar = () => {
		navigation.dispatch(DrawerActions.openDrawer());
	};

	const quickActions = [
		{ label: 'Instant Ride', icon: 'flash-outline' },
		{ label: 'Solo Ride', icon: 'person-outline' },
		{ label: 'Group Ride', icon: 'people-outline' },
		{ label: 'MultiDay Ride', icon: 'calendar-number-outline' },
		{ label: 'Add Bike', icon: 'bicycle-outline' },
		{ label: 'Add Logs', icon: 'document-text-outline' },
		{ label: 'Document Directory', icon: 'folder-open-outline' },
		{ label: 'View Events', icon: 'calendar-outline' },
	];

	const stats = [
		{ label: 'Total Rides', value: '42', icon: 'trail-sign-outline', color: colors.tint },
		{ label: 'Distance', value: '1,280 km', icon: 'map-outline', color: '#10B981' },
		{ label: 'Riding Hours', value: '38h', icon: 'time-outline', color: '#F59E0B' },
	];

	return (
		<SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}> 
			<StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

			{showTopBanner && (
				<View style={[styles.topBanner, { backgroundColor: isDark ? '#18191C' : '#111827' }]}> 
					<View style={styles.topBannerText}> 
						<Badge variant="warning" style={styles.topBannerBadge}>BETA</Badge>
						<Text style={[styles.topBannerCopy, { color: '#F9FAFB' }]}>We're listening, learning and leveling up with every input</Text>
					</View>
					<TouchableOpacity onPress={() => setShowTopBanner(false)}>
						<Ionicons name="close" size={20} color="#F9FAFB" />
					</TouchableOpacity>
				</View>
			)}

			<View style={[styles.header, { borderBottomColor: isDark ? '#2E3236' : '#E1E4E6' }]}> 
				<View style={styles.headerLeft}> 
					<TouchableOpacity style={[styles.menuButton, { backgroundColor: isDark ? '#2E3236' : '#E8ECEF' }]} onPress={openNavSidebar}>
						<Ionicons name="menu-outline" size={26} color={colors.text} />
					</TouchableOpacity>
					<Text style={[styles.headerTitle, { color: colors.text }]}>Dashboard</Text>
				</View>

				<View style={styles.headerActions}>
					<TouchableOpacity
						style={[styles.iconButton, { backgroundColor: isDark ? '#2E3236' : '#E8ECEF' }]}
						onPress={() => setShowQrOptions((prev) => !prev)}
					>
						<Ionicons name="qr-code-outline" size={22} color={colors.text} />
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.iconButton, { backgroundColor: isDark ? '#2E3236' : '#E8ECEF' }]}
						onPress={() => {}}
					>
						<Ionicons name="notifications-outline" size={22} color={colors.text} />
					</TouchableOpacity>
				</View>

				{showQrOptions && (
					<View style={[styles.qrMenu, { backgroundColor: isDark ? '#1F2225' : '#FFF', borderColor: isDark ? '#2E3236' : '#E1E4E6' }]}> 
						<TouchableOpacity style={styles.qrMenuItem} onPress={() => {}}>
							<Text style={[styles.qrMenuText, { color: colors.text }]}>Show My QR Code</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.qrMenuItem} onPress={() => {}}>
							<Text style={[styles.qrMenuText, { color: colors.text }]}>Scan QR Code</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>

			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<View style={styles.welcomeSection}> 
					<View style={styles.welcomeRow}> 
						<View style={styles.onlineBadge} />
						<Text style={[styles.welcomeSub, { color: isDark ? '#9BA1A6' : '#687076' }]}>Hii {user?.fullName || 'User'}</Text>
					</View>
				</View>

				<Text style={[styles.sectionTitle, { color: colors.text }]}>Your Ride Summary</Text>
				<View style={styles.statsGrid}>
					{stats.map((stat, index) => (
						<View 
							key={index} 
							style={[
								styles.statCard, 
								{ 
									backgroundColor: isDark ? '#1F2225' : '#F6F8FA',
									borderColor: isDark ? '#2E3236' : '#E1E4E6',
								},
							]}
						>
							<View style={[styles.statIconWrapper, { backgroundColor: `${stat.color}20` }]}> 
								<Ionicons name={stat.icon as any} size={22} color={stat.color} />
							</View>
							<Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
							<Text style={[styles.statLabel, { color: isDark ? '#9BA1A6' : '#687076' }]}>{stat.label}</Text>
						</View>
					))}
				</View>

				<TouchableOpacity 
					style={[styles.banner, { backgroundColor: colors.tint }]}
					activeOpacity={0.9}
				>
					<View style={styles.bannerContent}>
						<Text style={styles.bannerTitle}>Plan Next Ride</Text>
						<Text style={styles.bannerSubtitle}>Map your route, invite friends and hit the asphalt.</Text>
					</View>
					<View style={styles.bannerArrow}>
						<Ionicons name="arrow-forward" size={24} color="#FFF" />
					</View>
				</TouchableOpacity>

				<Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
				<View style={styles.quickActionsGrid}>
					{quickActions.map((action, index) => (
						<TouchableOpacity
							key={index}
							style={[
								styles.quickActionCard,
								{
									backgroundColor: isDark ? '#1F2225' : '#F6F8FA',
									borderColor: isDark ? '#2E3236' : '#E1E4E6',
								},
							]}
							activeOpacity={0.8}
							onPress={() => {}}
						>
							<View style={[styles.quickActionIcon, { backgroundColor: isDark ? '#2E3236' : '#E8ECEF' }]}> 
								<Ionicons name={action.icon as any} size={22} color={colors.tint} />
							</View>
							<Text style={[styles.quickActionLabel, { color: colors.text }]}>{action.label}</Text>
						</TouchableOpacity>
					))}
				</View>

				<View 
					style={[
						styles.garageCard, 
						{ 
							backgroundColor: isDark ? '#1F2225' : '#F6F8FA',
							borderColor: isDark ? '#2E3236' : '#E1E4E6',
						},
					]}
				>
					<View style={styles.garageHeader}>
						<View style={styles.garageTitleWrapper}>
							<Ionicons name="bicycle" size={20} color={colors.tint} />
							<Text style={[styles.garageTitle, { color: colors.text }]}>Active Garage</Text>
						</View>
						<TouchableOpacity>
							<Text style={{ color: colors.tint, fontWeight: '700' }}>Manage</Text>
						</TouchableOpacity>
					</View>
					<View style={[styles.garageInfo, { backgroundColor: isDark ? '#151718' : '#FFF' }]}> 
						<Ionicons name="construct-outline" size={24} color={isDark ? '#9BA1A6' : '#687076'} />
						<View style={styles.garageTextWrapper}>
							<Text style={[styles.bikeNickname, { color: colors.text }]}>KTM Duke 390</Text>
							<Text style={[styles.bikeModel, { color: isDark ? '#9BA1A6' : '#687076' }]}>MH-12-RS-2024 • Odo: 5,420 km</Text>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}


const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: 1,
	},
	headerLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	menuButton: {
		width: 42,
		height: 42,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '700',
	},
	scrollContainer: {
		padding: 24,
		gap: 24,
	},
	safeArea: {
		flex: 1,
		position: 'relative',
	},
	welcomeSection: {
		marginTop: 8,
	},
	welcomeSub: {
		fontSize: 16,
		fontWeight: '500',
		marginBottom: 4,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '700',
		marginBottom: -8,
	},
	topBanner: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginHorizontal: 20,
		marginTop: 12,
		borderRadius: 16,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.1)',
	},
	topBannerText: {
		flex: 1,
		marginRight: 12,
	},
	topBannerBadge: {
		alignSelf: 'flex-start',
		marginBottom: 6,
	},
	topBannerCopy: {
		fontSize: 13,
		lineHeight: 18,
		fontWeight: '500',
	},
	welcomeRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	onlineBadge: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: '#10B981',
	},
	statsGrid: {
		flexDirection: 'row',
		gap: 12,
		flexWrap: 'wrap',
	},
	statCard: {
		flex: 1,
		minWidth: 90,
		borderRadius: 16,
		padding: 16,
		borderWidth: 1,
		alignItems: 'flex-start',
	},
	statIconWrapper: {
		width: 36,
		height: 36,
		borderRadius: 18,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 12,
	},
	statValue: {
		fontSize: 18,
		fontWeight: '700',
		marginBottom: 4,
	},
	statLabel: {
		fontSize: 12,
		fontWeight: '500',
	},
	banner: {
		borderRadius: 20,
		padding: 20,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 3,
	},
	bannerContent: {
		flex: 1,
		paddingRight: 16,
	},
	bannerTitle: {
		color: '#FFF',
		fontSize: 20,
		fontWeight: '700',
		marginBottom: 4,
	},
	bannerSubtitle: {
		color: 'rgba(255, 255, 255, 0.8)',
		fontSize: 13,
		lineHeight: 18,
	},
	bannerArrow: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	garageCard: {
		borderRadius: 20,
		padding: 20,
		borderWidth: 1,
	},
	garageHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
	},
	garageTitleWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	garageTitle: {
		fontSize: 16,
		fontWeight: '700',
	},
	garageInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderRadius: 16,
		gap: 16,
	},
	garageTextWrapper: {
		flex: 1,
	},
	bikeNickname: {
		fontSize: 15,
		fontWeight: '600',
		marginBottom: 2,
	},
	bikeModel: {
		fontSize: 12,
	},
	headerActions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	iconButton: {
		width: 42,
		height: 42,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	qrMenu: {
		position: 'absolute',
		top: 58,
		right: 0,
		width: 172,
		borderRadius: 16,
		borderWidth: 1,
		paddingVertical: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.12,
		shadowRadius: 16,
		elevation: 6,
		zIndex: 10,
	},
	qrMenuItem: {
		paddingVertical: 12,
		paddingHorizontal: 16,
	},
	qrMenuText: {
		fontSize: 14,
		fontWeight: '600',
	},
	quickActionsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		gap: 12,
	},
	quickActionCard: {
		width: '48%',
		minHeight: 120,
		borderRadius: 20,
		borderWidth: 1,
		padding: 16,
		justifyContent: 'center',
		gap: 10,
		marginBottom: 12,
	},
	quickActionIcon: {
		width: 44,
		height: 44,
		borderRadius: 14,
		justifyContent: 'center',
		alignItems: 'center',
	},
	quickActionLabel: {
		fontSize: 14,
		fontWeight: '700',
	},
	quickActionsOverlay: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 88,
		left: 0,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		padding: 20,
		zIndex: 9,
	},
	quickActionsPanel: {
		width: 220,
		borderRadius: 24,
		borderWidth: 1,
		paddingVertical: 14,
		paddingHorizontal: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 12 },
		shadowOpacity: 0.18,
		shadowRadius: 20,
		elevation: 10,
	},
	quickActionItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		paddingVertical: 14,
		paddingHorizontal: 12,
		borderRadius: 16,
		marginBottom: 6,
	},
	quickActionText: {
		fontSize: 15,
		fontWeight: '600',
	},
	quickActionDivider: {
		height: 1,
		backgroundColor: 'rgba(255,255,255,0.08)',
		marginVertical: 8,
	},
});