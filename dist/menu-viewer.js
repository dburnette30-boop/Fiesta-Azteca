const menuViewer = document.querySelector('#menu-viewer');
const menuImage = menuViewer.querySelector('img');
const menuPan = menuViewer.querySelector('.menu-pan');
let menuScroll = 0, menuTrigger, lastTap = null, pointerStart = null;
function closeMenuViewer() { if (menuViewer.open) menuViewer.close(); }
document.querySelectorAll('.menu-image, .menu-photos figcaption > a').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    menuTrigger = link;
    menuScroll = window.scrollY;
    menuImage.src = link.getAttribute('href');
    menuImage.alt = link.closest('figure').querySelector('img').alt;
    lastTap = null;
    menuViewer.showModal();
    document.body.style.position = 'fixed';
    document.body.style.top = `-${menuScroll}px`;
    document.body.style.width = '100%';
    menuPan.scrollTop = menuPan.scrollLeft = 0;
  });
});
menuViewer.querySelector('.close-menu').addEventListener('click', closeMenuViewer);
menuViewer.addEventListener('close', () => {
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  menuTrigger?.focus({preventScroll: true});
  window.scrollTo({top: menuScroll, behavior: 'instant'});
  lastTap = pointerStart = null;
});
menuImage.addEventListener('dblclick', event => { event.preventDefault(); closeMenuViewer(); });
menuImage.addEventListener('pointerdown', event => {
  if (!event.isPrimary) { pointerStart = lastTap = null; return; }
  pointerStart = {x:event.clientX,y:event.clientY,time:event.timeStamp};
});
menuImage.addEventListener('pointercancel', () => { pointerStart = lastTap = null; });
menuImage.addEventListener('pointerup', event => {
  if (event.pointerType === 'mouse' || !pointerStart) return;
  const start = pointerStart; pointerStart = null;
  if (event.timeStamp-start.time > 300 || Math.hypot(event.clientX-start.x,event.clientY-start.y)>12) { lastTap=null; return; }
  if (lastTap && event.timeStamp-lastTap.time<350 && Math.hypot(event.clientX-lastTap.x,event.clientY-lastTap.y)<32) {
    event.preventDefault(); closeMenuViewer();
  } else lastTap={time:event.timeStamp,x:event.clientX,y:event.clientY};
});
