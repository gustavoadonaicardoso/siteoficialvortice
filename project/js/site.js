/* ===================================================================
   VÓRTICE — comportamento compartilhado
   =================================================================== */
(function(){
  /* ---- Arm reveal animations (base state is visible without this) ---- */
  document.documentElement.classList.add('js');

  /* ---- Active nav link by current page ---- */
  (function(){
    var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if(file==='') file='index.html';
    document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(function(a){
      var href=(a.getAttribute('href')||'').toLowerCase();
      if(href===file) a.classList.add('active');
    });
  })();

  /* ---- Nav: shadow on scroll ---- */
  var nav = document.querySelector('.nav');
  function onScroll(){ if(nav) nav.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* ---- Mobile menu ---- */
  var burger = document.querySelector('.nav-burger');
  var mobile = document.querySelector('.nav-mobile');
  if(burger && mobile){
    burger.addEventListener('click', function(){
      var open = mobile.classList.toggle('open');
      burger.classList.toggle('x', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobile.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ mobile.classList.remove('open'); burger.classList.remove('x'); document.body.style.overflow=''; });
    });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-q').forEach(function(q){
    q.addEventListener('click', function(){
      var item = q.closest('.faq-item');
      var a = item.querySelector('.faq-a');
      var open = item.classList.toggle('open');
      a.style.maxHeight = open ? a.scrollHeight + 'px' : '0px';
    });
  });

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll('.reveal');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
  reveals.forEach(function(el){ io.observe(el); });
  /* Fallback: if IO never fires (e.g. offscreen render), reveal everything */
  setTimeout(function(){ reveals.forEach(function(el){ el.classList.add('in'); }); }, 1600);

  /* ===================================================================
     i18n — PT (padrão) / EN
     Elementos com [data-en] trocam textContent; [data-en-html] trocam innerHTML.
     O conteúdo PT original é capturado na carga.
     =================================================================== */
  var I18N = {
    init:function(){
      document.querySelectorAll('[data-en]').forEach(function(el){
        if(!el.hasAttribute('data-pt')) el.setAttribute('data-pt', el.textContent);
      });
      document.querySelectorAll('[data-en-html]').forEach(function(el){
        if(!el.hasAttribute('data-pt-html')) el.setAttribute('data-pt-html', el.innerHTML);
      });
      var saved = localStorage.getItem('vortice-lang') || 'pt';
      this.apply(saved);
    },
    apply:function(lang){
      document.querySelectorAll('[data-en]').forEach(function(el){
        var v = lang==='en' ? el.getAttribute('data-en') : el.getAttribute('data-pt');
        if(v!=null) el.textContent = v;
      });
      document.querySelectorAll('[data-en-html]').forEach(function(el){
        var v = lang==='en' ? el.getAttribute('data-en-html') : el.getAttribute('data-pt-html');
        if(v!=null) el.innerHTML = v;
      });
      // placeholders
      document.querySelectorAll('[data-en-ph]').forEach(function(el){
        if(!el.hasAttribute('data-pt-ph')) el.setAttribute('data-pt-ph', el.getAttribute('placeholder')||'');
        el.setAttribute('placeholder', lang==='en'?el.getAttribute('data-en-ph'):el.getAttribute('data-pt-ph'));
      });
      document.documentElement.setAttribute('lang', lang==='en'?'en':'pt-BR');
      localStorage.setItem('vortice-lang', lang);
      document.querySelectorAll('.lang-toggle button').forEach(function(b){
        b.classList.toggle('on', b.dataset.lang===lang);
      });
    }
  };
  I18N.init();
  document.querySelectorAll('.lang-toggle button').forEach(function(b){
    b.addEventListener('click', function(){ I18N.apply(b.dataset.lang); });
  });
})();
