import { Ionicons } from "@expo/vector-icons";

export interface DrawerNavItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;

  comingSoon: boolean;
  underMaintenance: boolean;
}

export const drawerNavItems: DrawerNavItem[] = [
  // Main
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "home-outline",
    route: "/dashboard",
    comingSoon: false,
    underMaintenance: false,
  },
  {
    id: "my-rides",
    label: "My Rides",
    icon: "bicycle-outline",
    route: "/rides",
    comingSoon: false,
    underMaintenance: false,
  },

  // Marketplace
  {
    id: "buy-bike",
    label: "Buy a Bike",
    icon: "car-sport-outline",
    route: "/marketplace/bikes/buy",
    comingSoon: true,
    underMaintenance: false,
  },
  {
    id: "sell-bike",
    label: "Sell a Bike",
    icon: "cash-outline",
    route: "/marketplace/bikes/sell",
    comingSoon: true,
    underMaintenance: false,
  },
  {
    id: "buy-parts",
    label: "Buy Bike Parts",
    icon: "construct-outline",
    route: "/marketplace/parts/buy",
    comingSoon: true,
    underMaintenance: false,
  },
  {
    id: "sell-parts",
    label: "Sell Bike Parts",
    icon: "hardware-chip-outline",
    route: "/marketplace/parts/sell",
    comingSoon: true,
    underMaintenance: false,
  },
  {
    id: "shop",
    label: "Shop",
    icon: "bag-handle-outline",
    route: "/shop",
    comingSoon: true,
    underMaintenance: false,
  },

  // Community
  {
    id: "clubs",
    label: "Clubs",
    icon: "people-outline",
    route: "/clubs",
    comingSoon: false,
    underMaintenance: false,
  },
  {
    id: "news",
    label: "News",
    icon: "newspaper-outline",
    route: "/news",
    comingSoon: false,
    underMaintenance: false,
  },
  {
    id: "trainings",
    label: "Trainings",
    icon: "school-outline",
    route: "/trainings",
    comingSoon: true,
    underMaintenance: false,
  },

  // Services
  {
    id: "documents",
    label: "Document Directory",
    icon: "folder-open-outline",
    route: "/documents",
    comingSoon: true,
    underMaintenance: false,
  },
  {
    id: "service-centers",
    label: "Service Centers",
    icon: "location-outline",
    route: "/service-centers",
    comingSoon: true,
    underMaintenance: false,
  },
  {
    id: "fuel-calculator",
    label: "Fuel Cost Calculator",
    icon: "calculator-outline",
    route: "/fuel-calculator",
    comingSoon: false,
    underMaintenance: false,
  },
  {
    id: "diy-service",
    label: "DIY Servicing",
    icon: "build-outline",
    route: "/diy-servicing",
    comingSoon: true,
    underMaintenance: false,
  },

  // Support
  {
    id: "support",
    label: "Support",
    icon: "headset-outline",
    route: "/support",
    comingSoon: false,
    underMaintenance: false,
  },
];
