(() => {
  const grid = document.querySelector('.gallery-grid');
  if (!grid) return;
  const photos = [...grid.children];
  let pending;
  const layout = () => {
    cancelAnimationFrame(pending);
    pending = requestAnimationFrame(() => {
      const stacked = getComputedStyle(grid).display !== 'grid';
      photos.forEach(photo => {
        photo.style.gridRowEnd = stacked ? '' : `span ${Math.ceil(photo.getBoundingClientRect().height + 16)}`;
      });
    });
  };
  const observer = new ResizeObserver(layout);
  photos.forEach(photo => observer.observe(photo));
  grid.querySelectorAll('img').forEach(img => img.addEventListener('load', layout));
  document.fonts.ready.then(layout);
  window.addEventListener('resize', layout);
  layout();
})();
