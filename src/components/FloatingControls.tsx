// DEPRECATED: Component moved to src/app/_components/FloatingControls.tsx — use that path instead.
export { default } from '@/app/_components/FloatingControls';
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";
import { isMobileDevice } from "../services/device";

const FloatingControls = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const mobileClasses = "fixed bottom-6 right-6 flex flex-col items-end gap-4 z-[100]";
  const desktopClasses = "fixed top-6 left-6 flex flex-row items-center gap-4 z-[100]";

  return (
    <div className={isMobile ? mobileClasses : desktopClasses}>
      <ThemeToggle />
      <LanguageSelector />
    </div>
  );
};


