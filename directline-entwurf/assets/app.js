(function(){
  var d=document, reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header=d.querySelector('header'), totop=d.getElementById('totop');
  function onScroll(){ header.classList.toggle('scrolled', scrollY>20); if(totop) totop.classList.toggle('show', scrollY>700); updateSteps(); toc(); }
  if(totop) totop.onclick=function(){ scrollTo({top:0,behavior:reduce?'auto':'smooth'}); };
  var burger=d.getElementById('burger'), menu=d.getElementById('menu');
  if(burger){ burger.onclick=function(){ var o=menu.classList.toggle('open'); burger.setAttribute('aria-expanded',o); burger.setAttribute('aria-label',o?'Menü schließen':'Menü öffnen'); };
    d.addEventListener('keydown',function(e){ if(e.key==='Escape'){ menu.classList.remove('open'); burger.setAttribute('aria-expanded',false); } }); }
  // Slider
  var slides=[].slice.call(d.querySelectorAll('.slide')), dotsEl=d.getElementById('dots'), cur=0, timer;
  if(slides.length){
    var imgs=d.querySelectorAll('.slide img');
    d.querySelectorAll('img[data-same]').forEach(function(i){ i.src=imgs[+i.dataset.same].src; });
    d.documentElement.style.setProperty('--about-bg','url('+imgs[1].src+')');
    slides.forEach(function(_,i){ var b=d.createElement('button'); b.className='dot'; b.setAttribute('aria-label','Bild '+(i+1)); b.innerHTML='<i></i>'; b.onclick=function(){ go(i); }; dotsEl.appendChild(b); });
    var dots=[].slice.call(dotsEl.children);
    var go=function(i){ slides[cur].classList.remove('active'); cur=(i+slides.length)%slides.length; slides[cur].classList.add('active');
      dots.forEach(function(x,j){ x.classList.remove('active','done'); void x.offsetWidth; if(j<cur) x.classList.add('done'); if(j===cur) x.classList.add('active'); });
      clearTimeout(timer); if(!reduce) timer=setTimeout(function(){ go(cur+1); },6500); };
    d.getElementById('prev').onclick=function(){ go(cur-1); }; d.getElementById('next').onclick=function(){ go(cur+1); };
    go(0); window.__goSlide=go;
  }
  // Accordion
  d.querySelectorAll('.q button').forEach(function(b){ b.onclick=function(){ var q=b.parentNode, open=q.classList.contains('open');
    d.querySelectorAll('.q').forEach(function(x){ x.classList.remove('open'); x.querySelector('button').setAttribute('aria-expanded',false); });
    if(!open){ q.classList.add('open'); b.setAttribute('aria-expanded',true); } }; });
  // Counters + reveal
  function count(el){ var end=+el.dataset.count, pre=el.dataset.prefix||''; if(reduce){ el.textContent=pre+end; return; }
    var start=end>1000?end-40:0, t0; (function f(ts){ t0=t0||ts; var p=Math.min((ts-t0)/1600,1), e=1-Math.pow(1-p,3); el.textContent=pre+Math.round(start+(end-start)*e); if(p<1) requestAnimationFrame(f); })(performance.now()); }
  var els=d.querySelectorAll('.reveal, .photo, .timeline, .tline');
  if(reduce||!('IntersectionObserver' in window)){ els.forEach(function(e){ e.classList.add('in'); }); }
  else { var io=new IntersectionObserver(function(en){ en.forEach(function(x){ if(x.isIntersecting){ x.target.classList.add('in'); x.target.querySelectorAll('[data-count]').forEach(count); io.unobserve(x.target); } }); },{threshold:0,rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(e){ io.observe(e); }); }
  function updateSteps(){}
  var tl=d.querySelectorAll('.toc a'), hs=[].map.call(tl,function(a){ return d.getElementById(a.getAttribute('href').slice(1)); });
  function toc(){ if(!tl.length) return; var c=0; hs.forEach(function(h,i){ if(h&&h.getBoundingClientRect().top<150) c=i; }); tl.forEach(function(a,i){ a.classList.toggle('on',i===c); }); }
  addEventListener('scroll',onScroll,{passive:true}); onScroll();
  var y=d.getElementById('year'); if(y) y.textContent=new Date().getFullYear();
})();
