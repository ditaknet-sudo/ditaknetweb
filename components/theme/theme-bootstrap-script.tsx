/**
 * Blocking theme bootstrap — prevents light flash before hydration.
 * Keep in sync with components/theme/theme-toggle.tsx storage key.
 */
export function ThemeBootstrapScript() {
  const code = `(function(){try{var k='ditaknet.theme.v1',raw=localStorage.getItem(k),p=raw?JSON.parse(raw):{mode:'light'},m=(p&&p.mode)||'light',t='light';if(m==='dark')t='dark';else if(m==='light')t='light';else if(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)t='dark';document.documentElement.setAttribute('data-theme',t);document.documentElement.setAttribute('data-bs-theme',t);document.documentElement.style.colorScheme=t;}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
