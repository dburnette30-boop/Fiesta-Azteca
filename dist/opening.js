(()=>{
  const layer=document.querySelector('.fajita-opening');
  if(!layer)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  // The first-paint gate reserves the opening once per tab visit.
  if(!document.documentElement.classList.contains('intro-pending')||reduced.matches||(location.hash&&!['#top','#home'].includes(location.hash))){document.documentElement.classList.remove('intro-pending');return;}
  const image=layer.querySelector('img'),canvas=layer.querySelector('canvas'),ctx=canvas.getContext('2d');
  if(!ctx){document.documentElement.classList.remove('intro-pending');return;}
  let frame=0,start=0,done=false,width=0,height=0,particles=[],last=0,clearing=false;
  const random=(a,b)=>a+Math.random()*(b-a);
  function size(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
  function finish(){if(done)return;done=true;cancelAnimationFrame(frame);layer.hidden=true;document.documentElement.classList.remove('intro-pending');particles=[];window.removeEventListener('resize',size)}
  function clear(){if(clearing||done)return;clearing=true;layer.classList.add('is-clearing');document.querySelector('.hero-beer')?.classList.add('margarita-reveal');flashMargarita();setTimeout(finish,1300)}
  function flashMargarita(){
    const glass=document.querySelector('.hero-beer');if(!glass||reduced.matches)return;
    const ns='http://www.w3.org/2000/svg',outline=document.createElementNS(ns,'svg');
    outline.setAttribute('viewBox','0 0 1824 1368');outline.setAttribute('preserveAspectRatio','xMidYMid slice');
    outline.setAttribute('aria-hidden','true');outline.classList.add('margarita-silver-flash');
    // Keep a continuous closed halo around the rim, bowl, and visible stem.
    const path=document.createElementNS(ns,'path');
    path.setAttribute('d','M645 495 C635 430 1210 422 1248 491 C1270 555 1307 690 1276 802 C1242 909 1142 964 1018 987 C989 1007 981 1040 985 1110 L991 1368 L930 1368 L919 1100 C917 1040 913 1009 882 987 C730 966 658 914 621 820 C584 728 606 594 645 495 Z');
    path.setAttribute('pathLength','1');
    const strokes=[];
    for(const [width,color,opacity] of [[40,'#bdcbdc',.10],[28,'#d1dbe8',.16],[18,'#e3eaf2',.20]]){
      const stroke=path.cloneNode();stroke.dataset.width=width;
      stroke.style.stroke=color;stroke.style.opacity=opacity;
      outline.append(stroke);strokes.push(stroke);
    }
    document.body.append(outline);
    const began=performance.now();
    function align(now){
      if(now-began>4500||reduced.matches){outline.remove();return;}
      const rect=glass.getBoundingClientRect();
      outline.style.left=rect.left+'px';outline.style.top=rect.top+'px';
      outline.style.width=rect.width+'px';outline.style.height=rect.height+'px';
      const photoScale=Math.max(rect.width/1824,rect.height/1368);
      strokes.forEach(stroke=>stroke.style.strokeWidth=Number(stroke.dataset.width)/photoScale);
      requestAnimationFrame(align);
    }
    align(began);
  }
  layer.querySelector('button').addEventListener('click',finish);
  reduced.addEventListener('change',()=>{if(reduced.matches)finish()});
  let fireMask,fireFlow,flowCtx,heatCanvas,heatCtx,heatPixels,heat,rearFire,rearShade;
  const heatW=192,heatH=96;
  function prepareUnderGrillFire(){
    // Only the bright orange fire in the photograph can flicker. Dark iron
    // bars and the foreground stay opaque, so fire never floats over them.
    fireMask=document.createElement('canvas');
    fireMask.width=image.naturalWidth;fireMask.height=image.naturalHeight;
    const maskCtx=fireMask.getContext('2d');maskCtx.drawImage(image,0,0);
    const pixels=maskCtx.getImageData(0,0,fireMask.width,fireMask.height),d=pixels.data;
    for(let y=0;y<fireMask.height;y++)for(let x=0;x<fireMask.width;x++){
      const i=(y*fireMask.width+x)*4,r=d[i],g=d[i+1],b=d[i+2];
      const fire=y>fireMask.height*.66&&r>120&&g>45&&r-b>85&&g>b*1.8;
      d[i+3]=fire?255:0;
    }
    maskCtx.putImageData(pixels,0,0);
    rearFire=document.createElement('canvas');rearFire.width=image.naturalWidth;rearFire.height=Math.ceil(image.naturalHeight*.24);
    const rearCtx=rearFire.getContext('2d');rearCtx.drawImage(image,0,0);
    const back=rearCtx.getImageData(0,0,rearFire.width,rearFire.height),b=back.data;
    for(let y=0;y<rearFire.height;y++)for(let x=0;x<rearFire.width;x++){
      const i=(y*rearFire.width+x)*4,r=b[i],g=b[i+1],blue=b[i+2];
      const isFire=r>65&&g>20&&r>g*1.4&&g>blue*1.6;
      const fade=Math.min(1,(rearFire.height-y)/(image.naturalHeight*.04));
      b[i+3]=isFire?Math.round(255*fade):0;
    }
    rearCtx.putImageData(back,0,0);
    rearShade=document.createElement('canvas');rearShade.width=rearFire.width;rearShade.height=rearFire.height;
    const shade=rearShade.getContext('2d');shade.drawImage(rearFire,0,0);shade.globalCompositeOperation='source-in';shade.fillStyle='#23130d';shade.fillRect(0,0,rearShade.width,rearShade.height);
    fireFlow=document.createElement('canvas');fireFlow.width=fireMask.width;fireFlow.height=fireMask.height;
    flowCtx=fireFlow.getContext('2d');
    heatCanvas=document.createElement('canvas');heatCanvas.width=heatW;heatCanvas.height=heatH;
    heatCtx=heatCanvas.getContext('2d');heatPixels=heatCtx.createImageData(heatW,heatH);
    heat=new Float32Array(heatW*heatH);
    for(let i=0;i<140;i++)advanceFire();
  }
  function advanceFire(){
    for(let x=0;x<heatW;x++)heat[(heatH-1)*heatW+x]=.65+Math.random()*.6;
    for(let y=0;y<heatH-1;y++)for(let x=0;x<heatW;x++){
      const drift=Math.floor(Math.random()*3)-1,sx=(x+drift+heatW)%heatW;
      const below=(y+1)*heatW;
      heat[y*heatW+x]=Math.max(0,(heat[below+sx]*2+heat[below+(sx+1)%heatW]+heat[below+(sx+heatW-1)%heatW])/4-.008-Math.random()*.012);
    }
  }
  function flickerUnderGrill(t){
    if(!fireMask)return;
    // Advected heat gives the fire irregular, rising movement instead of a
    // uniform brightness pulse. Warm it before the first visible frame.
    advanceFire();advanceFire();
    const pixels=heatPixels.data;
    for(let i=0;i<heat.length;i++){
      const v=Math.min(1,heat[i]),j=i*4;
      pixels[j]=Math.min(255,70+v*300);
      pixels[j+1]=Math.max(0,Math.min(255,(v-.22)*380));
      pixels[j+2]=Math.max(0,Math.min(180,(v-.7)*600));pixels[j+3]=255;
    }
    heatCtx.putImageData(heatPixels,0,0);
    const fw=fireFlow.width,fh=fireFlow.height;
    flowCtx.globalCompositeOperation='source-over';flowCtx.clearRect(0,0,fw,fh);
    flowCtx.imageSmoothingEnabled=true;
    flowCtx.drawImage(heatCanvas,0,fh*.66,fw,fh*.34);
    // The photograph's openings mask the moving heat; iron stays in front.
    flowCtx.globalCompositeOperation='destination-in';flowCtx.drawImage(fireMask,0,0);
    const rect=image.getBoundingClientRect(),scale=Math.max(rect.width/fw,rect.height/fh);
    const w=fw*scale,h=fh*scale,x=rect.left+(rect.width-w)*.5,y=rect.top+(rect.height-h)*.58;
    ctx.save();ctx.globalAlpha=.96;ctx.drawImage(fireFlow,x,y,w,h);ctx.restore();
    // Bend and lift the actual rear flame shapes, independently of the grill fire.
    ctx.save();ctx.globalAlpha=.88;ctx.drawImage(rearShade,x,y,w,rearShade.height*scale);
    ctx.globalAlpha=.95;
    for(let row=0;row<rearFire.height;row+=3){
      const sh=Math.min(3,rearFire.height-row),lift=1-row/rearFire.height;
      const bend=(Math.sin(t*22-row*.035)*12+Math.sin(t*34+row*.061)*5)*lift;
      const rise=(5+Math.sin(t*26+row*.018)*5)*lift;
      ctx.drawImage(rearFire,0,row,rearFire.width,sh,x+bend*scale,y+(row-rise)*scale,w,(sh+.5)*scale);
    }
    ctx.restore();
  }

  function emit(){
    const scale=Math.hypot(width,height),angle=random(-Math.PI,Math.PI),velocity=random(scale*.5,scale*1.9);
    particles.push({x:width*.5,y:height*.57,vx:Math.cos(angle)*velocity,vy:Math.sin(angle)*velocity,age:0,life:random(.55,1.2),r:random(scale*.07,scale*.22),seed:random(0,7)});
  }
  function tick(now){
    if(done)return;
    if(!start)start=now;
    const t=(now-start)/1000,dt=Math.min((now-last)/1000||.016,.04);last=now;
    ctx.clearRect(0,0,width,height);
    // Expand beyond the farthest corner on both wide screens and portrait phones.
    if(t>=2){
      const expansion=Math.min(1,(t-2)/.72);
      const radius=Math.max(1,Math.hypot(width*.5,height*.57)*1.5*(1-Math.pow(1-expansion,3)));
      const cx=width*.5,cy=height*.57;
      const fire=ctx.createRadialGradient(cx,cy,0,cx,cy,radius);
      fire.addColorStop(0,'#ffe7a0');
      fire.addColorStop(.25,'#ffbc38');
      fire.addColorStop(.58,'#ff6b0c');
      fire.addColorStop(.82,'#cf3105');
      fire.addColorStop(.96,'#8b1604');
      fire.addColorStop(1,'rgba(100,12,0,0)');
      ctx.fillStyle=fire;ctx.fillRect(0,0,width,height);
    }
    // Flickering fire stays beneath the grill for two seconds before the burst.
    if(t<2)flickerUnderGrill(t);
    if(t>=2&&t<2.65){for(let i=0;i<12;i++)emit()}
    ctx.globalCompositeOperation='lighter';
    for(let i=particles.length-1;i>=0;i--){
      const p=particles[i];p.age+=dt;if(p.age>=p.life){particles.splice(i,1);continue}
      p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy-=height*.15*dt;
      const q=p.age/p.life,r=p.r*(.65+q*1.5),a=Math.sin(Math.PI*q)*.65;
      const grad=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r);
      grad.addColorStop(0,`rgba(255,240,164,${a})`);grad.addColorStop(.22,`rgba(255,173,34,${a*.9})`);grad.addColorStop(.58,`rgba(244,65,5,${a*.6})`);grad.addColorStop(1,'rgba(120,12,0,0)');
      ctx.save();
      ctx.fillStyle=grad;ctx.beginPath();ctx.ellipse(p.x+Math.sin(t*8+p.seed)*r*.12,p.y,r,r,0,0,Math.PI*2);ctx.fill();ctx.restore();
    }
    ctx.globalCompositeOperation='source-over';
    if(t>=3.05)clear();
    if(t>4.5){finish();return}
    frame=requestAnimationFrame(tick);
  }
  async function play(){
    try{await image.decode()}catch{finish();return}
    if(done||reduced.matches||scrollY>100){finish();return;}
    size();window.addEventListener('resize',size);layer.hidden=false;
    try{prepareUnderGrillFire()}catch{fireMask=null}
    frame=requestAnimationFrame(tick);
    // Guaranteed escape even when animation frames stop in a background tab.
    setTimeout(finish,6000);
  }
  // Never restore a partially played opening from the browser's back cache.
  window.addEventListener('pagehide',finish,{once:true});
  play();
})();
