const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('nav');toggle.addEventListener('click',()=>{const opened=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',opened);toggle.setAttribute('aria-label',opened?'Close navigation':'Open navigation');nav.classList.toggle('open',opened)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation')}));const modal=document.querySelector('#lightbox');document.querySelectorAll('[data-image]').forEach(b=>b.addEventListener('click',()=>{modal.querySelector('img').src=b.dataset.image;modal.querySelector('img').alt=b.dataset.caption;modal.querySelector('p').textContent=b.dataset.caption;modal.showModal()}));modal?.querySelector('.close').addEventListener('click',()=>modal.close());modal?.addEventListener('click',e=>{if(e.target===modal)modal.close()});const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();

// Close phone navigation with Escape or a tap outside the header.
function closeNavigation(){nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-label","Open navigation")}
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&nav.classList.contains("open")){closeNavigation();toggle.focus()}});document.addEventListener("click",e=>{if(nav.classList.contains("open")&&!e.target.closest("header"))closeNavigation()});

// Return home immediately and expose navigation on phones and tablets.
function returnToHomeNavigation(){
  window.scrollTo({top:0,left:0,behavior:'instant'});
  if(getComputedStyle(toggle).display!=='none'){
    nav.classList.add('open');
    toggle.setAttribute('aria-expanded','true');
    toggle.setAttribute('aria-label','Close navigation');
  }
}
document.querySelectorAll('a[href="#top"],a[href="#home"]').forEach(link=>{
  link.addEventListener('click',event=>{
    if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();
    event.stopPropagation();
    history.replaceState(null,'','#top');
    returnToHomeNavigation();
  });
});
window.addEventListener('pageshow',()=>{
  if(document.body.id==='top'&&(location.hash==='#top'||location.hash==='#home'))returnToHomeNavigation();
});
