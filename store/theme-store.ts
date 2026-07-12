import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safePersistStorage } from "./custom-storage";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      toggleTheme: () => {
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" }));
      },
    }),
    {
      name: "biker-theme-storage",
      storage: createJSONStorage(() => safePersistStorage),
    },
  ),
);
