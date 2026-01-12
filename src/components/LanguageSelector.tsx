// DEPRECATED: Component moved to src/app/_components/LanguageSelector.tsx — use that path instead.
export { default } from '@/app/_components/LanguageSelector';
  type FC,
  type MutableRefObject,
  type KeyboardEvent,
} from 'react';
import { usePathname, useRouter, LOCALES, localeNames, Locale } from '../i18n/routing';
import { useLocale } from 'next-intl';
import { ChevronDown, Check } from 'lucide-react';
import { isMobileDevice } from '@/services/device';

type KeyHandler = (idx: number, loc?: Locale) => void;

function selectLocaleFactory(router: any, pathname: string, onClose: () => void) {
  return async (loc: Locale) => {
    onClose();
    await router.replace(pathname, { locale: loc });
  };
}

function getKeyStrategiesFactory(
  itemsRef: MutableRefObject<Array<HTMLLIElement | null>>,
  onClose: () => void,
  buttonRef: React.RefObject<HTMLButtonElement | null>,
  selectLocale: (loc: Locale) => void,
  wrap = false
): Record<string, KeyHandler> {
  const moveNext = (idx: number) => {
    const next = wrap ? (idx + 1) % LOCALES.length : Math.min(idx + 1, LOCALES.length - 1);
    itemsRef.current[next]?.focus();
  };

  const movePrev = (idx: number) => {
    const prev = wrap ? (idx - 1 + LOCALES.length) % LOCALES.length : Math.max(idx - 1, 0);
    itemsRef.current[prev]?.focus();
  };

  return {
    ArrowDown: idx => moveNext(idx),
    ArrowUp: idx => movePrev(idx),
    Enter: (_idx, loc) => {
      if (loc) selectLocale(loc);
    },
    ' ': (_idx, loc) => {
      if (loc) selectLocale(loc);
    },
    Spacebar: (_idx, loc) => {
      if (loc) selectLocale(loc);
    },
    Escape: () => {
      onClose();
      buttonRef.current?.focus();
    },
  };
}

type LanguageOptionProps = {
  locale: Locale;
  idx: number;
  isSelected: boolean;
  itemsRef: MutableRefObject<Array<HTMLLIElement | null>>;
  onClick: (loc: Locale) => void;
  onKeyDown: (e: KeyboardEvent, idx: number, loc: Locale) => void;
};

const LanguageOption: FC<LanguageOptionProps> = ({
  locale: loc,
  idx,
  isSelected,
  itemsRef,
  onClick,
  onKeyDown,
}) => {
  return (
    <li
      role="option"
      aria-selected={isSelected}
      ref={el => {
        itemsRef.current[idx] = el;
      }}
      tabIndex={0}
      onKeyDown={e => onKeyDown(e, idx, loc)}
      onClick={() => onClick(loc)}
      className={
        `px-3 py-2 text-sm cursor-pointer flex items-center justify-between ` +
        (isSelected ? 'bg-muted text-foreground' : 'hover:bg-muted/70')
      }
    >
      <span>{localeNames[loc]}</span>
      {isSelected && <Check size={16} aria-hidden />}
    </li>
  );
};

type LanguageMenuProps = {
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  activeLocale: Locale;
};

const LanguageMenu: FC<LanguageMenuProps> = ({ buttonRef, onClose, activeLocale }) => {
  const listRef = useRef<HTMLUListElement | null>(null);
  const itemsRef = useRef<Array<HTMLLIElement | null>>([]);
  const pathname = usePathname();
  const router = useRouter();

  // close on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (buttonRef?.current && buttonRef.current.contains(target)) return;
      if (listRef.current && listRef.current.contains(target)) return;
      onClose();
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [buttonRef, onClose]);

  const selectLocale = selectLocaleFactory(router, pathname, onClose);

  const onKeyDown = (e: KeyboardEvent, idx: number, loc: Locale) => {
    const strategies = getKeyStrategiesFactory(itemsRef, onClose, buttonRef, selectLocale, false);
    const handler = strategies[e.key];
    if (handler) {
      e.preventDefault();
      handler(idx, loc);
    }
  };

  const desktopClasses =
    'absolute top-full left-0 mt-2 w-32 rounded-lg border border-border bg-card text-foreground shadow-md z-50 overflow-hidden';
  const mobileClasses =
    'absolute right-0 bottom-full mb-2 w-32 rounded-lg border border-border bg-card text-foreground shadow-md z-50 overflow-hidden';

  return (
    <ul
      ref={listRef}
      role="listbox"
      tabIndex={-1}
      className={isMobileDevice() ? mobileClasses : desktopClasses}
    >
      {LOCALES.map((locale, idx) => {
        const isSelected = locale === activeLocale;
        return (
          <LanguageOption
            key={locale}
            locale={locale}
            idx={idx}
            isSelected={isSelected}
            itemsRef={itemsRef}
            onClick={selectLocale}
            onKeyDown={onKeyDown}
          />
        );
      })}
    </ul>
  );
};

const LanguageSelector = () => {
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const toggle = () => setOpen(v => !v);

  // keyboard navigation
  const onButtonKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={onButtonKeyDown}
        className="h-10 px-3 border border-border rounded-lg bg-card text-foreground font-mono text-sm cursor-pointer transition-all hover:border-primary shadow-sm flex items-center justify-between w-full"
      >
        <span>{localeNames[locale]}</span>
        {/* chevron */}
        <ChevronDown className="ml-2" size={14} aria-hidden />
      </button>

      {open && (
        <LanguageMenu buttonRef={buttonRef} onClose={() => setOpen(false)} activeLocale={locale} />
      )}
    </div>
  );
};


