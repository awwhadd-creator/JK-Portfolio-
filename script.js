const $=s=>document.querySelector(s), views=['home','portfolio','about','contact'];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
let cur='home', busy=false;
/* ---------- navigation + film transition ---------- */
const film=$('#film');
function swap(to){$('#'+cur).classList.remove('on');cur=to;const v=$('#'+to);v.classList.add('on');v.scrollTop=0;document.body.dataset.view=to;if(to==='about'&&window.pcScatter)pcScatter()}
function playFilm(){film.classList.remove('go');film.offsetHeight;film.classList.add('go')}
function show(name){
  const to=views.includes(name)?name:'home'; if(to===cur||busy)return;
  if(reduce){swap(to);return}
  busy=true;
  if(cur==='home'&&to==='about'){
    $('#home').classList.add('zoom');setTimeout(playFilm,550);
    setTimeout(()=>{swap(to);$('#home').classList.remove('zoom');busy=false},900);
  }else{playFilm();setTimeout(()=>{swap(to);busy=false},300)}
}
addEventListener('hashchange',()=>show(location.hash.slice(1)));
if(location.hash)show(location.hash.slice(1));
addEventListener('wheel',e=>{if(cur==='home'&&e.deltaY>20)location.hash='portfolio'},{passive:true});
addEventListener('keydown',e=>{if(cur==='home'&&e.key==='ArrowDown')location.hash='portfolio'});
let ty0;addEventListener('touchstart',e=>ty0=e.touches[0].clientY,{passive:true});
addEventListener('touchend',e=>{if(cur==='home'&&ty0-e.changedTouches[0].clientY>50)location.hash='portfolio'});
/* ---------- liquid title intro ---------- */
(()=>{const d=$('#liqD'),t=$('#liqT'),h=$('#home h1'),sp=h.querySelectorAll('span');
  if(reduce){sp.forEach(x=>x.style.filter='none');return}
  const s=performance.now();
  (function f(n){const k=Math.min((n-s)/2600,1),e=1-Math.pow(1-k,3);
    d.setAttribute('scale',(160*(1-e)).toFixed(1));
    t.setAttribute('baseFrequency',`${(0.006+0.014*(1-e)).toFixed(4)} ${(0.02+0.03*(1-e)).toFixed(4)}`);
    h.style.opacity=Math.min(1,k*3);
    if(k<1)requestAnimationFrame(f);else sp.forEach(x=>x.style.filter='none')})(s);
})();
/* ---------- hero depth parallax ---------- */
(()=>{const bg=$('#home .bg'),h1=$('#home h1');let tx=0,ty=0,cx=0,cy=0;
  addEventListener('pointermove',e=>{if(cur!=='home')return;tx=(e.clientX/innerWidth-.5)*2;ty=(e.clientY/innerHeight-.5)*2});
  (function f(){requestAnimationFrame(f);if(reduce)return;cx+=(tx-cx)*.06;cy+=(ty-cy)*.06;
    bg.style.scale=1.06;bg.style.translate=`${-cx*24}px ${-cy*14}px`;h1.style.translate=`${cx*34}px ${cy*18}px`})();
})();
/* ---------- cursor ink + grain ---------- */
(()=>{
  const cv=$('#ink'),ctx=cv.getContext('2d'),nc=document.createElement('canvas');nc.width=nc.height=256;
  const nx=nc.getContext('2d'),id=nx.createImageData(256,256);let pat,fr=0,last=null,idle=0;
  const size=()=>{cv.width=innerWidth;cv.height=innerHeight};size();addEventListener('resize',size);
  const noise=()=>{for(let i=0;i<id.data.length;i+=4){const v=50+Math.random()*150;id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=255}nx.putImageData(id,0,0);pat=ctx.createPattern(nc,'repeat')};noise();
  addEventListener('pointermove',e=>{if(cur!=='home')return;const p={x:e.clientX,y:e.clientY};idle=0;
    if(last){const d=Math.hypot(p.x-last.x,p.y-last.y),n=Math.ceil(d/14);
      ctx.globalCompositeOperation='source-over';ctx.fillStyle='#2b2623';
      for(let i=1;i<=n;i++){const x=last.x+(p.x-last.x)*i/n,y=last.y+(p.y-last.y)*i/n,r=34+Math.min(d,60)*.5;
        for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(x+(Math.random()-.5)*34,y+(Math.random()-.5)*34,r*(.55+Math.random()*.5),0,7);ctx.fill()}}}
    last=p});
  (function loop(){requestAnimationFrame(loop);if(cur!=='home')return;
    ctx.globalCompositeOperation='destination-out';ctx.fillStyle='rgba(0,0,0,.05)';ctx.fillRect(0,0,cv.width,cv.height);
    if(++idle>150)ctx.clearRect(0,0,cv.width,cv.height);
    if(++fr%2===0)noise();
    ctx.globalCompositeOperation='source-atop';ctx.save();ctx.translate(Math.random()*256|0,Math.random()*256|0);
    ctx.fillStyle=pat;ctx.fillRect(-256,-256,cv.width+256,cv.height+256);ctx.restore()})();
})();
/* ---------- animated point-cloud face (About) ---------- */
(()=>{const cv=$('#pc');if(!cv||typeof PC==='undefined')return;const ctx=cv.getContext('2d');
  const raw=Uint8Array.from(atob(PC),c=>c.charCodeAt(0)),u=new Uint16Array(raw.buffer);
  const step=innerWidth<800?2:1,n=Math.floor(u.length/2/step);
  const x=new Float32Array(n),y=new Float32Array(n),vx=new Float32Array(n),vy=new Float32Array(n),tx=new Float32Array(n),ty=new Float32Array(n);
  let W=1,H=1,s=1,mx=-999,my=-999;
  function layout(){W=cv.width=cv.clientWidth||1;H=cv.height=cv.clientHeight||1;s=Math.max(W,H)/1280;const ox=(W-1280*s)/2,oy=(H-1280*s)/2;
    for(let i=0;i<n;i++){tx[i]=ox+u[2*i*step]*s;ty[i]=oy+u[2*i*step+1]*s}}
  window.pcScatter=()=>{layout();for(let i=0;i<n;i++){const a=Math.random()*6.28,r=Math.random()*Math.max(W,H)*.6;x[i]=W*.7+Math.cos(a)*r;y[i]=H*.5+Math.sin(a)*r;vx[i]=vy[i]=0}};
  pcScatter();addEventListener('resize',layout);
  addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top});
  (function f(){requestAnimationFrame(f);if(cur!=='about')return;ctx.clearRect(0,0,W,H);ctx.fillStyle='rgb(92,80,70)';
    const sz=Math.max(1.4,1.6*s),R=95;
    for(let i=0;i<n;i++){let ax=(tx[i]-x[i])*.03,ay=(ty[i]-y[i])*.03;const dx=x[i]-mx,dy=y[i]-my,d=dx*dx+dy*dy;
      if(d<R*R){const k=(1-Math.sqrt(d)/R)*.12;ax+=dx*k;ay+=dy*k}
      vx[i]=(vx[i]+ax)*.88;vy[i]=(vy[i]+ay)*.88;x[i]+=vx[i];y[i]+=vy[i];ctx.fillRect(x[i],y[i],sz,sz)}})();
})();
/* ---------- portfolio: curved glass slider + paper-roll grid ---------- */
(()=>{
  const stage=$('#stage'),gv=$('#gridv'),fbar=$('#filters'),cap=$('.cap'),cats=['All',...new Set(PROJECTS.map(p=>p.c))];
  let list=[],els=[],pos=0,target=0,snapT,mode='slide',moved=0;
  fbar.innerHTML=cats.map((c,i)=>`<button data-c="${c}" class="${i?'':'on'}">${c}</button>`).join('')+'<span class="sep"></span><button class="mode on" data-m="slide" aria-label="Slider view">▭</button><button class="mode" data-m="grid" aria-label="Grid view">▦</button>';
  const open=p=>{$('#lb img').src='images/work/'+p.img;$('#lb img').alt=p.t;$('#lb').classList.add('on')};
  fbar.onclick=e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.m){setMode(b.dataset.m);fbar.querySelectorAll('.mode').forEach(x=>x.classList.toggle('on',x===b));return}
    fbar.querySelectorAll('button[data-c]').forEach(x=>x.classList.remove('on'));b.classList.add('on');build(b.dataset.c)};
  function build(c){
    list=PROJECTS.filter(p=>c==='All'||p.c===c);stage.innerHTML='';gv.innerHTML='';
    els=list.map((p,i)=>{const d=document.createElement('div');d.className='card';
      d.innerHTML=`<img class="art" src="images/work/${p.thumb}" alt="${p.t}" draggable="false" loading="lazy">`;
      d.onclick=()=>{if(moved>6)return;if(Math.round(target)!==i)target=i;else open(p)};
      stage.appendChild(d);
      const g=document.createElement('div');g.className='gi';g.style.setProperty('--i',Math.min(i,16));
      g.innerHTML=`<img src="images/work/${p.thumb}" alt="${p.t}" loading="lazy"><p>${p.t}</p>`;g.onclick=()=>open(p);gv.appendChild(g);
      return d});
    pos=target=0;gv.scrollTop=0;
  }
  function setMode(m){if(m===mode)return;mode=m;
    if(m==='grid'){stage.classList.add('off');cap.classList.add('off');gv.classList.remove('rolling');gv.classList.add('on');gv.scrollTop=0;
      [...gv.children].forEach(g=>{g.style.animation='none';g.offsetHeight;g.style.animation=''})}
    else{gv.classList.add('rolling');setTimeout(()=>{if(mode==='slide'){gv.classList.remove('on','rolling');stage.classList.remove('off');cap.classList.remove('off')}},650)}}
  const clamp=v=>Math.max(0,Math.min(list.length-1,v));
  (function loop(){requestAnimationFrame(loop);if(cur!=='portfolio'||mode!=='slide')return;pos+=(target-pos)*.09;
    els.forEach((d,i)=>{const o=i-pos,a=Math.abs(o);
      if(a>4){d.style.display='none';return}d.style.display='';
      d.style.transform=`translateX(${o*106}%) translateZ(${-a*150}px) rotateY(${o*-26}deg)`;
      d.style.opacity=Math.max(0,1-a*.32);d.style.zIndex=100-Math.round(a*10);d.style.setProperty('--e',Math.min(a,1.2).toFixed(2))});
    const p=list[Math.round(clamp(pos))];if(p){$('#capT').textContent=p.t;$('#capK').textContent=p.c+' · '+p.k}})();
  const snap=()=>target=clamp(Math.round(target));
  addEventListener('wheel',e=>{if(cur!=='portfolio'||mode!=='slide')return;target=clamp(target+(e.deltaY+e.deltaX)*.003);clearTimeout(snapT);snapT=setTimeout(snap,140)},{passive:true});
  addEventListener('keydown',e=>{if(cur!=='portfolio'||mode!=='slide')return;if(e.key==='ArrowRight')target=clamp(Math.round(target)+1);if(e.key==='ArrowLeft')target=clamp(Math.round(target)-1)});
  let sx=null,st=0;
  stage.addEventListener('pointerdown',e=>{sx=e.clientX;st=target;moved=0});
  addEventListener('pointermove',e=>{if(sx===null)return;moved=Math.abs(e.clientX-sx);target=clamp(st-(e.clientX-sx)/(innerWidth*.25))});
  addEventListener('pointerup',()=>{if(sx!==null){sx=null;snap()}});
  $('#lb').onclick=()=>$('#lb').classList.remove('on');
  addEventListener('keydown',e=>{if(e.key==='Escape')$('#lb').classList.remove('on')});
  build('All');
})();
/* ---------- contact ---------- */
const clock=()=>$('#clock').textContent=new Intl.DateTimeFormat('en-IN',{timeStyle:'medium',timeZone:'Asia/Kolkata'}).format(new Date());
clock();setInterval(clock,1000);
$('#form').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);
  location.href='mailto:awwhadd@gmail.com?subject='+encodeURIComponent('Project enquiry from '+f.get('n'))+'&body='+encodeURIComponent(f.get('m')+'\n\nReply to: '+f.get('r'))});
