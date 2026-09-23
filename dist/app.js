const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobile = window.matchMedia('(max-width: 760px)');
let paused = reduced.matches;

function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
  nav.classList.toggle('open', open);
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  setMenu(open);
  if (open) nav.querySelector('a').focus();
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  setMenu(false);
  if (mobile.matches) {
    const target = document.querySelector(link.hash);
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
}));
mobile.addEventListener('change', () => setMenu(false));
document.addEventListener('keydown', event => {
  if (!nav.classList.contains('open')) return;
  if (event.key === 'Escape') { setMenu(false); menu.focus(); }
  if (event.key === 'Tab') {
    const first = nav.querySelector('a');
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); menu.focus(); }
    else if (!event.shiftKey && document.activeElement === menu) { event.preventDefault(); first.focus(); }
  }
});

// 指针仅驱动意象图；离开、不可见或动效关闭时停止逐帧工作。
const hero = document.querySelector('.hero');
const art = document.querySelector('.hero-art');
const masthead = document.querySelector('.hero-masthead');
const motionButton = document.querySelector('#motion');
let mapFrame = 0;
let targetX = 0, targetY = 0, mapX = 0, mapY = 0;
function stopMap() {
  cancelAnimationFrame(mapFrame);
  mapFrame = 0;
  targetX = targetY = mapX = mapY = 0;
  art.style.removeProperty('--map-x');
  art.style.removeProperty('--map-y');
  masthead.style.removeProperty('--type-x');
  masthead.style.removeProperty('--type-y');
}
function syncMotion() {
  document.body.classList.toggle('motion-paused', paused);
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.innerHTML = paused ? '开启动效 <span>▷</span>' : '暂停动效 <span>Ⅱ</span>';
  if (paused || reduced.matches) {
    stopMap();
    document.querySelector('#question-panel').getAnimations().forEach(animation => animation.cancel());
  }
}
syncMotion();
motionButton.addEventListener('click', () => { paused = !paused; syncMotion(); });
reduced.addEventListener('change', () => { paused = reduced.matches; syncMotion(); });
function easeMap() {
  mapX += (targetX - mapX) * .09;
  mapY += (targetY - mapY) * .09;
  art.style.setProperty('--map-x', `${mapX.toFixed(2)}px`);
  art.style.setProperty('--map-y', `${mapY.toFixed(2)}px`);
  masthead.style.setProperty('--type-x', `${(-mapX * .45).toFixed(2)}px`);
  masthead.style.setProperty('--type-y', `${(-mapY * .3).toFixed(2)}px`);
  if (Math.abs(targetX - mapX) + Math.abs(targetY - mapY) > .03) mapFrame = requestAnimationFrame(easeMap);
  else mapFrame = 0;
}
hero.addEventListener('pointermove', event => {
  if (paused || reduced.matches || event.pointerType === 'touch') return;
  const rect = hero.getBoundingClientRect();
  targetX = ((event.clientX - rect.left) / rect.width - .5) * 18;
  targetY = ((event.clientY - rect.top) / rect.height - .5) * 12;
  if (!mapFrame) mapFrame = requestAnimationFrame(easeMap);
});
hero.addEventListener('pointerleave', () => {
  targetX = targetY = 0;
  if (!paused && !reduced.matches && !mapFrame) mapFrame = requestAnimationFrame(easeMap);
});
document.addEventListener('visibilitychange', () => { if (document.hidden) stopMap(); });

// 节点的位置直接取自同一椭圆方程，轨道转动时仍准确贴在线上。
const orbitElements = [...document.querySelectorAll('.orbit')];
const orbitNodes = [...document.querySelectorAll('.map-node')];
const orbitSpecs = [
  { rx: 190, ry: 85, angle: -34, speed: .24, phase: 2.7 },
  { rx: 190, ry: 85, angle: 34, speed: -.19, phase: .2 },
  { rx: 95, ry: 155, angle: 0, speed: .16, phase: 1.57 }
];
let orbitTime = 0, orbitFrame = 0, orbitLast = 0, heroVisible = true;
function renderOrbits() {
  orbitSpecs.forEach((spec, index) => {
    const degrees = spec.angle + Math.sin(orbitTime * .17 + index * 1.7) * 22;
    const angle = degrees * Math.PI / 180;
    const phase = spec.phase + orbitTime * spec.speed;
    const x = spec.rx * Math.cos(phase), y = spec.ry * Math.sin(phase);
    orbitElements[index].setAttribute('transform', `rotate(${degrees.toFixed(3)} 280 180)`);
    orbitNodes[index].setAttribute('cx', (280 + x * Math.cos(angle) - y * Math.sin(angle)).toFixed(3));
    orbitNodes[index].setAttribute('cy', (180 + x * Math.sin(angle) + y * Math.cos(angle)).toFixed(3));
  });
}
function orbitTick(now) {
  if (orbitLast) orbitTime += Math.min((now - orbitLast) / 1000, .05);
  orbitLast = now;
  renderOrbits();
  orbitFrame = requestAnimationFrame(orbitTick);
}
function syncOrbits() {
  cancelAnimationFrame(orbitFrame);
  orbitFrame = 0;
  orbitLast = 0;
  if (!paused && !reduced.matches && heroVisible && !document.hidden) orbitFrame = requestAnimationFrame(orbitTick);
}
renderOrbits();
syncOrbits();
motionButton.addEventListener('click', syncOrbits);
reduced.addEventListener('change', syncOrbits);
document.addEventListener('visibilitychange', syncOrbits);

// 标题、正文、脚注与 index.html 的默认问答对应。
const questions = [
  ['理论如何入门？<br>从一本读得完的书开始。', '精神分析的概念不好啃，入门常常卡在第一步。我们按主题排顺序：先用一本读得完的书把基本概念读准，再回到案例与临床材料。读不懂的地方，正好是讨论的起点。', '不要求提前读过弗洛伊德。'],
  ['阅读如何持续？<br>把时间先固定下来。', '一个人读容易停，一群人读也未必不停。所以频率直接写进活动表：每月一次共读、一次研讨。错过一次不影响进度，回来时材料还在原处。', '节奏比热情耐用。'],
  ['不同专业如何对话？<br>先说清各自的意思。', '同一个词，在精神医学、心理学和人文社科里往往不是同一个意思。我们不急着统一口径，先让每个人把本专业的用法讲清楚，再看分歧究竟在哪里。', '把分歧说清楚，比表面的共识有用。']
];
const tabs = [...document.querySelectorAll('[role=tab]')];
function choose(index) {
  tabs.forEach((tab, i) => {
    tab.setAttribute('aria-selected', String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
  });
  document.querySelector('#question-title').innerHTML = questions[index][0];
  document.querySelector('#question-copy').textContent = questions[index][1];
  document.querySelector('#question-foot').textContent = questions[index][2];
  const panel = document.querySelector('#question-panel');
  panel.setAttribute('aria-labelledby', tabs[index].id);
  if (!paused && !reduced.matches) {
    panel.getAnimations().forEach(animation => animation.cancel());
    panel.animate([{ opacity: .4, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' });
  }
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => choose(index));
  tab.addEventListener('keydown', event => {
    let next = index;
    if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (index + 1) % tabs.length;
    else if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    choose(next);
    tabs[next].focus();
  });
});
document.querySelector('#copy-qq').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText('1046657889');
    status.textContent = '群号已复制，在 QQ 里搜索加入即可。';
  } catch {
    status.textContent = '复制失败，请手动输入群号：1046657889';
  }
});

const progressBar = document.querySelector('.scroll-progress span');
let progressFrame = 0;
function updateProgress() {
  if (progressFrame) return;
  progressFrame = requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progressBar.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
    progressFrame = 0;
  });
}
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress, { passive: true });
updateProgress();

const archiveTrack = document.querySelector('.archive-track');
let dragging = false, startX = 0, startScroll = 0;
archiveTrack.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'mouse' || event.button !== 0 || archiveTrack.scrollWidth <= archiveTrack.clientWidth) return;
  dragging = true;
  startX = event.clientX;
  startScroll = archiveTrack.scrollLeft;
  archiveTrack.classList.add('is-dragging');
  archiveTrack.setPointerCapture(event.pointerId);
});
archiveTrack.addEventListener('pointermove', event => {
  if (dragging) archiveTrack.scrollLeft = startScroll - (event.clientX - startX);
});
function stopDragging() { dragging = false; archiveTrack.classList.remove('is-dragging'); }
['pointerup', 'pointercancel', 'lostpointercapture'].forEach(name => archiveTrack.addEventListener(name, stopDragging));
archiveTrack.addEventListener('dragstart', event => event.preventDefault());
archiveTrack.addEventListener('keydown', event => {
  if (!['ArrowRight', 'ArrowLeft'].includes(event.key)) return;
  event.preventDefault();
  archiveTrack.scrollBy({ left: archiveTrack.clientWidth * .86 * (event.key === 'ArrowRight' ? 1 : -1), behavior: paused || reduced.matches ? 'instant' : 'smooth' });
});

if ('IntersectionObserver' in window) {
  if (!reduced.matches) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    }), { threshold: .06 });
    document.querySelectorAll('.intro-grid,.principles article,.section-heading,.people-grid article,.practice-content,.library-index,.archive-head,.archive-card,.interlude-quote,#question-panel,.join-copy,.qr-card').forEach(element => {
      element.classList.add('reveal');
      revealObserver.observe(element);
    });
  }
  const chapterObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    nav.querySelectorAll('a').forEach(link => {
      if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }), { rootMargin: '-20% 0px -55% 0px' });
  document.querySelectorAll('section[id]').forEach(section => chapterObserver.observe(section));
  const heroObserver = new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    document.body.classList.toggle('hero-outside', !heroVisible);
    syncOrbits();
    if (!entry.isIntersecting) stopMap();
  });
  heroObserver.observe(hero);
}
