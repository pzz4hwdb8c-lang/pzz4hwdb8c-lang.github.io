(function(){
  var d = document, root = d.documentElement, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = d.querySelector('header.site'), prog = d.querySelector('.progress');
  var lastY = 0;
  function onScroll(){
    var y = scrollY, h = d.body.scrollHeight - innerHeight;
    if(header){ header.classList.toggle('solid', y > 30); header.classList.toggle('hide', y > 500 && y > lastY && !root.classList.contains('menu-open')); }
    if(prog) prog.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    lastY = y; parallax(); highlight(); toc();
  }
  // Mobile menu
  var burger = d.querySelector('.burger');
  function setMenu(open){ root.classList.toggle('menu-open', open); burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen'); d.querySelector('.mobile').setAttribute('aria-hidden', !open); }
  if(burger){ burger.addEventListener('click', function(){ setMenu(!root.classList.contains('menu-open')); });
    d.addEventListener('keydown', function(e){ if(e.key === 'Escape') setMenu(false); });
    d.querySelectorAll('.mobile a').forEach(function(a, i){ a.style.transitionDelay = (0.15 + i * 0.04) + 's'; a.addEventListener('click', function(){ setMenu(false); }); }); }
  // Hero word reveal
  requestAnimationFrame(function(){ setTimeout(function(){ d.querySelectorAll('[data-split]').forEach(function(el){ el.classList.add('ready'); }); }, 120); });
  d.querySelectorAll('[data-split] .w>span').forEach(function(s, i){ s.style.transitionDelay = (i * 0.07) + 's'; });
  // Reveal
  var rvs = d.querySelectorAll('.rv, .frame, .tline, .career');
  if(reduce || !('IntersectionObserver' in window)){ rvs.forEach(function(e){ e.classList.add('in'); }); }
  else { var io = new IntersectionObserver(function(es){ es.forEach(function(x){ if(x.isIntersecting){ x.target.classList.add('in'); x.target.querySelectorAll('[data-count]').forEach(count); io.unobserve(x.target); } }); }, {threshold:0, rootMargin:'0px 0px -8% 0px'});
    rvs.forEach(function(e){ io.observe(e); }); }
  function count(el){ var end = +el.dataset.count, pre = el.dataset.pre || '', start = end > 1000 ? end - 30 : 0, t0;
    if(reduce){ el.textContent = pre + end; return; }
    (function f(t){ t0 = t0 || t; var p = Math.min((t - t0) / 1800, 1), e = 1 - Math.pow(1 - p, 4); el.textContent = pre + Math.round(start + (end - start) * e); if(p < 1) requestAnimationFrame(f); })(performance.now()); }
  // Parallax
  var px = d.querySelectorAll('[data-parallax]');
  function parallax(){ if(reduce) return; px.forEach(function(el){ var r = el.parentNode.getBoundingClientRect(); if(r.bottom < 0 || r.top > innerHeight) return; var k = +el.dataset.parallax || .15; el.style.transform = 'translate3d(0,' + ((r.top + r.height / 2 - innerHeight / 2) * -k) + 'px,0)'; }); }
  // Statement highlight
  var st = d.querySelector('.statement p'), toks = st ? st.querySelectorAll('.t') : [];
  function highlight(){ if(!st) return; if(reduce){ toks.forEach(function(t){ t.classList.add('on'); }); return; }
    var r = st.getBoundingClientRect(), p = (innerHeight * .8 - r.top) / (r.height + innerHeight * .35); p = Math.max(0, Math.min(1, p));
    var n = Math.round(p * toks.length); toks.forEach(function(t, i){ t.classList.toggle('on', i < n); }); }
  // TOC
  var tocLinks = d.querySelectorAll('.toc a'), heads = [].map.call(tocLinks, function(a){ return d.getElementById(a.getAttribute('href').slice(1)); });
  function toc(){ if(!tocLinks.length) return; var cur = 0; heads.forEach(function(h, i){ if(h && h.getBoundingClientRect().top < 160) cur = i; }); tocLinks.forEach(function(a, i){ a.classList.toggle('on', i === cur); }); }
  // Spotlight cards
  d.querySelectorAll('.card').forEach(function(c){ c.addEventListener('pointermove', function(e){ var r = c.getBoundingClientRect(); c.style.setProperty('--x', (e.clientX - r.left) + 'px'); c.style.setProperty('--y', (e.clientY - r.top) + 'px'); }); });
  // Magnetic buttons
  if(!reduce && matchMedia('(hover:hover)').matches){ d.querySelectorAll('.btn').forEach(function(b){
    b.addEventListener('pointermove', function(e){ var r = b.getBoundingClientRect(); b.style.setProperty('--mx', ((e.clientX - r.left - r.width / 2) * .18) + 'px'); b.style.setProperty('--my', ((e.clientY - r.top - r.height / 2) * .25) + 'px'); });
    b.addEventListener('pointerleave', function(){ b.style.setProperty('--mx', '0px'); b.style.setProperty('--my', '0px'); }); }); }
  addEventListener('scroll', onScroll, {passive:true}); addEventListener('resize', onScroll); onScroll();
  var y = d.getElementById('year'); if(y) y.textContent = new Date().getFullYear();
})();
