/**
 * Blocking theme bootstrap — prevents light flash before hydration.
 * Keep in sync with components/theme/theme-toggle.tsx storage key.
 */
export function ThemeBootstrapScript() {
  const code = `(function(){try{var k='ditaknet.theme.v1',raw=localStorage.getItem(k),p=raw?JSON.parse(raw):{mode:'system'},m=(p&&p.mode)||'system',t='light';if(m==='dark')t='dark';else if(m==='light')t='light';else if(m==='auto'){var n=new Date(),mins=n.getHours()*60+n.getMinutes(),ds=String(p.dayStarts||'07:00').split(':'),ns=String(p.nightStarts||'19:00').split(':'),dm=(Number(ds[0])||0)*60+(Number(ds[1])||0),nm=(Number(ns[0])||0)*60+(Number(ns[1])||0);if(dm===nm)t='light';else if(dm<nm)t=(mins>=dm&&mins<nm)?'light':'dark';else t=(mins>=dm||mins<nm)?'light':'dark';}else if(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)t='dark';document.documentElement.setAttribute('data-theme',t);document.documentElement.setAttribute('data-bs-theme',t);document.documentElement.style.colorScheme=t;}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
