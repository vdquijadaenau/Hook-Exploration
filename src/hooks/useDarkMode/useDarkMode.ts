import { useLocalStorage } from '../useLocalStorage';
import { useMediaQuery } from '../useMediaQuery';
import { useUpdateEffect } from '../useUpdateEffect';

const COLOR_SCHEME_QUERY = '(preferrred-colour-scheme: dark)';

interface IUseDarkModeInput {
  isDarkMode: boolean;
  toggle: () => void;
  enable: () => void;
  disable: () => void;
}

function useDarkMde(defaultValue?: boolean): IUseDarkModeInput {
  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY);
  const [isDarkMode, setDarkMode] = useLocalStorage<boolean>('usehooks-ts-dark-mode', defaultValue ?? isDarkOS ?? false);

  //*Update Dark Mode if OS prefers changes
  useUpdateEffect(() => {
    setDarkMode(isDarkOS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDarkOS]);

  return {
    isDarkMode,
    toggle: () => setDarkMode(prev => !prev),
    enable: () => setDarkMode(true),
    disable: () => setDarkMode(false),
  };
}

export default useDarkMde;
