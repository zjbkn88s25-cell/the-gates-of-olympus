let missions=[];const main=document.getElementById('main');function dayOpen(n){return true;}function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}function show(view,n){document.querySelectorAll('.view').forEach(e=>e.classList.remove('active'));if(view==='mission'){if(!dayOpen(n)){show('olympus');alert('This gate opens on December '+n+', 2026 at 00:00 Berlin time.');return}const m=missions[n-1];if(!m){show('olympus');return}document.getElementById('mission-title').textContent=m.title;document.getElementById('mission-text').innerHTML=m.paragraphs.slice(1).map((p,i)=>'<p class="'+(/^(THE LEGEND|THE TWIST|YOUR MISSION|CHOOSE YOUR GOGGINS LEVEL|NO EQUIPMENT|THE FINAL WORD|THE HERO.S OATH|NOTE|PART ONE|PART TWO|PART THREE)/i.test(p)?'section':i===0?'subhead':'')+'">'+esc(p)+'</p>').join('');document.getElementById('mission-image').src='gate-'+String(n).padStart(2,'0')+'.webp';document.getElementById('mission-image').alt='Gate '+String(n).padStart(2,'0')+' illustration';const finale=document.getElementById('mission-finale');finale.hidden=n!==24;document.getElementById('mission').classList.add('active')}else{document.getElementById(view).classList.add('active')}history.replaceState(null,'','#'+(view==='mission'?'mission-'+n:view));window.scrollTo({top:0,behavior:'instant'})}function renderGates(){const scene=document.getElementById('gates');scene.innerHTML='';for(let i=1;i<=24;i++){const row=Math.floor((i-1)/6),col=(i-1)%6;const x=10+col*16+(row%2?4:0),y=25+row*19;const b=document.createElement('button');b.className='gate';b.style.left=x+'%';b.style.top=y+'%';b.title='Mission '+String(i).padStart(2,'0');b.setAttribute('aria-label',b.title);b.innerHTML='<img loading="lazy" src="gate-'+String(i).padStart(2,'0')+'.webp" alt=""><span>'+String(i).padStart(2,'0')+'</span>';b.onclick=()=>show('mission',i);scene.appendChild(b)}}fetch('missions.json').then(r=>r.json()).then(d=>{missions=d;renderGates();const match=location.hash.match(/^#mission-(\d+)$/);if(match)show('mission',Math.max(1,Math.min(24,Number(match[1]))));else show(['home','prologue','code','olympus'].includes(location.hash.slice(1))?location.hash.slice(1):'home');}).catch(()=>{document.getElementById('error').hidden=false});document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.view)));


/* THE GATES OF OLYMPUS — optional 25s home and 10s Muses music.
   Playback starts only following a user gesture (required by mobile browsers). */
(()=>{
  const tracks={home:new Audio('olympus-startseite-25-sekunden.mp3'),prologue:new Audio('musen-prolog-10-sekunden.mp3')};
  Object.values(tracks).forEach(audio=>{audio.preload='none';audio.loop=false;});
  let current=null;
  const buttons={};
  const style=document.createElement('style');
  style.textContent='.music-button{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:1px solid #cfa96280;border-radius:25px;padding:11px 18px;margin:12px 8px;color:#fff2d7;background:#192744;font:12px Georgia,serif;letter-spacing:.06em;cursor:pointer}.music-button:hover,.music-button:focus-visible{background:#5b4525}.music-button:focus-visible{outline:2px solid #f3cc76}';
  document.head.appendChild(style);
  function refresh(){Object.keys(buttons).forEach(view=>{const a=tracks[view];buttons[view].textContent=(!a.paused&&current===view)?'♫  PAUSE MUSIC':'♫  PLAY MUSIC';buttons[view].setAttribute('aria-label',view==='home'?'Play or pause homepage music':'Play or pause Muses music');});}
  function stop(){Object.values(tracks).forEach(a=>{a.pause();a.currentTime=0;});current=null;refresh();}
  function play(view){if(!tracks[view]){stop();return;}const a=tracks[view];if(current===view&&!a.paused){a.pause();refresh();return;}stop();current=view;a.currentTime=0;const result=a.play();if(result&&typeof result.catch==='function')result.catch(()=>{current=null;refresh();});refresh();}
  const home=document.querySelector('#home .hero');
  const muses=document.querySelector('#prologue .vase-wrap');
  [['home',home],['prologue',muses]].forEach(([view,place])=>{if(!place)return;const b=document.createElement('button');b.type='button';b.className='music-button';b.textContent='♫  PLAY MUSIC';b.addEventListener('click',()=>play(view));place.appendChild(b);buttons[view]=b;});
  Object.entries(tracks).forEach(([view,a])=>a.addEventListener('ended',()=>{if(current===view)current=null;refresh();}));
  // Existing navigation listeners are registered earlier; the click remains a user gesture.
  document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{
    const view=b.dataset.view;
    if(view==='prologue'||view==='home')play(view);
    else stop();
  }));
  // Gate buttons are created dynamically, so listen for their clicks on the scene.
  const gates=document.getElementById('gates');if(gates)gates.addEventListener('click',e=>{if(e.target.closest('.gate'))stop();});
  window.addEventListener('hashchange',()=>{const view=location.hash.slice(1);if(view!=='home'&&view!=='prologue')stop();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){Object.values(tracks).forEach(a=>a.pause());refresh();}});
})();
