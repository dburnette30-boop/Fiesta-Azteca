(() => {
  const video = document.querySelector('.cantina-video');
  if (!video) return;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.autoplay = true;
  video.loop = true;
  const playButton = document.createElement('button');
  playButton.type = 'button';
  playButton.textContent = '▶ Play video';
  playButton.setAttribute('aria-label', 'Play the Cantina video');
  playButton.hidden = true;
  playButton.style.cssText = 'align-self:center;padding:10px 22px;border:1px solid #e9bc60;border-radius:24px;background:#f6edd9;color:#102b40;font:600 16px Georgia,serif;cursor:pointer';
  video.after(playButton);
  let pending = false;
  function visible() {
    const rect = video.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < innerHeight;
  }
  function resume() {
    if (document.hidden || !video.paused || pending) return;
    video.muted = true;
    // Call play directly inside touch/click handlers to preserve the user gesture.
    const attempt = video.play();
    if (attempt) {
      pending = true;
      attempt.then(() => { playButton.hidden = true; })
        .catch(() => { playButton.hidden = !visible(); })
        .finally(() => { pending = false; });
    }
  }
  video.addEventListener('playing', () => { playButton.hidden = true; });
  video.addEventListener('canplay', resume);
  video.addEventListener('loadeddata', resume);
  window.addEventListener('pageshow', resume);
  document.addEventListener('visibilitychange', resume);
  document.addEventListener('touchend', resume, { passive: true });
  document.addEventListener('click', resume);
  playButton.addEventListener('click', resume);
  new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) resume();
  }, { threshold: 0.1 }).observe(video);
  // Mobile Safari may defer an off-screen autoplay video until it is visible.
  let scheduled = false;
  window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      if (visible()) resume();
    });
  }, { passive: true });
  resume();
})();
