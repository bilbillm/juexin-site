const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
  nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', '打开导航');
}));
document.addEventListener('keydown', e => { if(e.key === 'Escape' && nav.classList.contains('open')) { menu.click(); menu.focus(); } });

const header = document.querySelector('.header');
function syncHeader(){ header.classList.toggle('scrolled', window.scrollY > 40); }
window.addEventListener('scroll', syncHeader, {passive:true});
syncHeader();

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduced.matches;
const motionButton = document.querySelector('#motion');
const art = document.querySelector('.hero-art');
function syncMotion(){motionButton.setAttribute('aria-pressed',String(paused));motionButton.innerHTML=paused?'开启动效 <span>▷</span>':'暂停动效 <span>Ⅱ</span>';if(paused)art.style.transform='none';}
syncMotion();
motionButton.addEventListener('click',()=>{paused=!paused;syncMotion();});
reduced.addEventListener('change',()=>{paused=reduced.matches;syncMotion();});
document.querySelector('.hero').addEventListener('pointermove',e=>{
  if(paused || e.pointerType==='touch')return;
  const rect=e.currentTarget.getBoundingClientRect();
  const x=(e.clientX-rect.left)/rect.width-.5, y=(e.clientY-rect.top)/rect.height-.5;
  art.style.transform=`perspective(1400px) rotateY(${x*2.5}deg) rotateX(${-y*2}deg) translate(${x*12}px,${y*10}px)`;
});
document.querySelector('.hero').addEventListener('pointerleave',()=>{art.style.transform='none';});

// 三组问答：标题（可含 <br>）／正文／脚注，与 index.html 的默认首屏内容保持一致。
const questions=[
  ['理论如何入门？<br>从一本读得完的书开始。','精神分析的概念不好啃，入门常常卡在第一步。我们按主题排顺序：先用一本读得完的书把基本概念读准，再回到案例与临床材料。读不懂的地方，正好是讨论的起点。','不要求提前读过弗洛伊德。'],
  ['阅读如何持续？<br>把时间先固定下来。','一个人读容易停，一群人读也未必不停。所以频率直接写进活动表：每月一次共读、一次研讨。错过一次不影响进度，回来时材料还在原处。','节奏比热情耐用。'],
  ['不同专业如何对话？<br>先说清各自的意思。','同一个词，在精神医学、心理学和人文社科里往往不是同一个意思。我们不急着统一口径，先让每个人把本专业的用法讲清楚，再看分歧究竟在哪里。','把分歧说清楚，比表面的共识有用。']
];
const tabs=[...document.querySelectorAll('[role=tab]')];
function choose(index){tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});document.querySelector('#question-title').innerHTML=questions[index][0];document.querySelector('#question-copy').textContent=questions[index][1];document.querySelector('#question-foot').textContent=questions[index][2];document.querySelector('#question-panel').setAttribute('aria-labelledby',tabs[index].id);}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>choose(i));tab.addEventListener('keydown',e=>{let next=i;if(e.key==='ArrowRight')next=(i+1)%tabs.length;else if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();choose(next);tabs[next].focus();});});

document.querySelector('#copy-qq').addEventListener('click',async()=>{
  const status=document.querySelector('#copy-status');
  try{await navigator.clipboard.writeText('1046657889');status.textContent='群号已复制，在 QQ 里搜索加入即可。';}
  catch{status.textContent='复制失败，请手动输入群号：1046657889';}
});

const progressBar=document.querySelector('.scroll-progress span');
let progressFrame=0;
function updateProgress(){if(progressFrame)return;progressFrame=requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-window.innerHeight;progressBar.style.width=`${max>0?(window.scrollY/max)*100:0}%`;progressFrame=0;});}
window.addEventListener('scroll',updateProgress,{passive:true});
window.addEventListener('resize',updateProgress,{passive:true});
updateProgress();

const archiveTrack=document.querySelector('.archive-track');
let dragging=false,startX=0,startScroll=0;
archiveTrack.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse'&&event.button!==0)return;dragging=true;startX=event.clientX;startScroll=archiveTrack.scrollLeft;archiveTrack.classList.add('is-dragging');archiveTrack.setPointerCapture(event.pointerId);});
archiveTrack.addEventListener('pointermove',event=>{if(!dragging)return;archiveTrack.scrollLeft=startScroll-(event.clientX-startX)*1.15;});
function stopDragging(){dragging=false;archiveTrack.classList.remove('is-dragging');}
archiveTrack.addEventListener('pointerup',stopDragging);archiveTrack.addEventListener('pointercancel',stopDragging);archiveTrack.addEventListener('lostpointercapture',stopDragging);

if('IntersectionObserver' in window && !reduced.matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.intro-grid,.principles article,.section-heading,.people-grid article,.practice-content,.library-index,.archive-head,.archive-card,.interlude,#question-panel,.join-copy,.qr-card').forEach(el=>{el.classList.add('reveal');observer.observe(el);});}
if(!('IntersectionObserver' in window) || reduced.matches){document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));}
function revealFallback(){document.querySelectorAll('.reveal:not(.visible)').forEach(el=>{if(el.getBoundingClientRect().top<window.innerHeight*1.2)el.classList.add('visible');});}
window.addEventListener('scroll',revealFallback,{passive:true});
window.setTimeout(revealFallback,120);
