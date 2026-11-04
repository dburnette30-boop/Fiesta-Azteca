(()=>{const nav=document.querySelector('#main-navigation'),menu=document.querySelector('.menu-toggle');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');menu.innerHTML=open?'<span>✕</span>':'<span>☰</span>'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.innerHTML='<span>☰</span>'}));const video=document.querySelector('#grill-video'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
if(video){
  // Keep silent inline playback ready for mobile browsers.
  video.muted=true;video.defaultMuted=true;video.playsInline=true;
  function resume(){
    if(!reduce.matches&&!document.hidden&&video.paused){
      video.muted=true;
      const pending=video.play();
      if(pending)pending.catch(()=>{});
    }
  }
  video.addEventListener('canplay',resume);
  window.addEventListener('pageshow',resume);
  document.addEventListener('visibilitychange',resume);
  // A normal page touch can start playback if the browser blocks autoplay.
  document.addEventListener('touchend',resume,{passive:true});
  reduce.addEventListener('change',()=>{
    video.autoplay=!reduce.matches;
    if(reduce.matches)video.pause();else resume();
  });
  video.autoplay=!reduce.matches;
  if(reduce.matches)video.pause();else resume();
}
document.querySelector('#year').textContent=new Date().getFullYear()})();
