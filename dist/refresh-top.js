// A refresh starts at the top; ordinary links and Back/Forward keep their behavior.
(() => {
  const navigation = performance.getEntriesByType('navigation')[0];
  const isReload = navigation ? navigation.type === 'reload' :
    performance.navigation && performance.navigation.type === 1;
  if (!isReload) return;

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  // A section fragment would otherwise scroll the refreshed page down again.
  if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
  const scrollToTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  scrollToTop();
  document.addEventListener('DOMContentLoaded', scrollToTop, { once: true });
  window.addEventListener('pageshow', () => {
    scrollToTop();
    requestAnimationFrame(scrollToTop);
  }, { once: true });
  window.addEventListener('pagehide', () => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
  }, { once: true });
})();
