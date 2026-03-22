import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { APP_KEYS } from "../utils/storage";

export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage(APP_KEYS.theme, "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return {
    theme,
    toggleTheme: () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
  };
};
