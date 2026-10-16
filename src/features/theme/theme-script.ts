import { DEFAULT_THEME, THEME_STORAGE_KEY } from "./constants";

/**
 * Runs in <head> before first paint so a returning dark-theme visitor never
 * sees a white flash. It only reads the saved choice — the OS preference is
 * deliberately ignored because the brand default is the white theme.
 * It also flags that JS is running so scroll-reveal styles can apply safely.
 */
export const themeInitScript = `(function(){var d=document.documentElement;d.setAttribute('data-js','');try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='light'&&t!=='dark')t='${DEFAULT_THEME}';d.setAttribute('data-theme',t);d.style.colorScheme=t;}catch(e){d.setAttribute('data-theme','${DEFAULT_THEME}');}})();`;
