// DEPRECATED: Component moved to src/app/_components/ThemeToggle.tsx — use that path instead.
export { default } from '@/app/_components/ThemeToggle';
import { Sun, Moon } from "lucide-react";
import { useTranslations } from "next-intl";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const t = useTranslations("Common");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const initialTheme = savedTheme || "light";
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center bg-card border border-border text-foreground rounded-lg transition-all hover:border-primary hover:bg-muted shadow-sm"
      aria-label={t("toggleTheme")}
    >
      {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};


