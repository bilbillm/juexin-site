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
  art.style.transform=`perspective(1400px) rotateY(${x*2.5}deg) rotateX(${-y*2}deg) translate(${x*12}px,${y*10}px) scale(1.035)`;
});
document.querySelector('.hero').addEventListener('pointerleave',()=>{art.style.transform='none';});
const questions=[
  ['为什么有些关系，<br>总让人感到似曾相识？','我们可以从一次具体的相遇出发，留意自己的期待、失落和回应。先让经验被说出来，再一起思考其中的重复。'],
  ['当感受还没有名字，<br>我们可以怎样倾听？','有时，我们先感到不安，却还说不清缘由。给自己一点时间，试着描述一个场景、一句话，或沉默里的感受，让理解慢慢发生。'],
  ['一本书里的概念，<br>如何走进真实的生活？','把一段文本读慢一点，辨认作者在回应什么问题，再带着自己的疑问进入讨论。让理论与经验相遇，也保持对不同解释的开放。']
];
const tabs=[...document.querySelectorAll('[role=tab]')];
function choose(index){tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});document.querySelector('#question-title').innerHTML=questions[index][0];document.querySelector('#question-copy').textContent=questions[index][1];document.querySelector('#question-panel').setAttribute('aria-labelledby',tabs[index].id);}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>choose(i));tab.addEventListener('keydown',e=>{let next=i;if(e.key==='ArrowRight')next=(i+1)%tabs.length;else if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();choose(next);tabs[next].focus();});});
document.querySelector('#copy-qq').addEventListener('click',async()=>{
  const status=document.querySelector('#copy-status');
  try{await navigator.clipboard.writeText('1046657889');status.textContent='已复制群号，打开 QQ 搜索即可。';}
  catch{status.textContent='请长按或选中群号复制：1046657889';}
});
if('IntersectionObserver' in window && !reduced.matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.intro-grid,.principles article,.section-heading,.people-grid article,.practice-content,.library-index').forEach(el=>{el.classList.add('reveal');observer.observe(el);});}
