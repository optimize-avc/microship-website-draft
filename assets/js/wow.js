/* ═══════════════════════════════════════════════════
   MicroShip — WOW Factor JS (all pages)
   ═══════════════════════════════════════════════════ */
(function(){
  'use strict';

  /* ── Scroll Progress Bar ── */
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', function(){
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h * 100) : 0) + '%';
  }, {passive:true});

  /* ── Page Fade-in ── */
  document.body.classList.add('page-fade');

  /* ── Smooth Page Transitions ── */
  document.addEventListener('click', function(e){
    var a = e.target.closest('a');
    if(!a) return;
    var href = a.getAttribute('href');
    if(!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http') || a.target === '_blank') return;
    e.preventDefault();
    document.body.classList.add('page-fade-out');
    setTimeout(function(){ window.location.href = href; }, 200);
  });

  /* ── Back to Top Button ── */
  var btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label','Back to top');
  btn.onclick = function(){ window.scrollTo({top:0,behavior:'smooth'}); };
  document.body.appendChild(btn);
  window.addEventListener('scroll', function(){
    btn.classList.toggle('visible', window.scrollY > 500);
  }, {passive:true});

  /* ── Dark/Light Mode Toggle ── */
  var headerInner = document.querySelector('.header-inner');
  if(headerInner){
    var toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.setAttribute('aria-label','Toggle light/dark mode');
    var savedTheme = localStorage.getItem('ms-theme');
    if(savedTheme === 'light') document.body.classList.add('light-mode');
    function updateIcon(){ toggle.innerHTML = document.body.classList.contains('light-mode') ? '☀️' : '🌙'; }
    updateIcon();
    toggle.onclick = function(){
      document.body.classList.toggle('light-mode');
      localStorage.setItem('ms-theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
      updateIcon();
    };
    headerInner.appendChild(toggle);
  }

  /* ── FAQ Smooth Accordion ── */
  document.querySelectorAll('.faq-item').forEach(function(item){
    var summary = item.querySelector('summary');
    var answer = item.querySelector('.faq-answer');
    if(!summary || !answer) return;
    summary.addEventListener('click', function(e){
      e.preventDefault();
      if(item.open){
        answer.style.maxHeight = '0';
        answer.style.padding = '0';
        setTimeout(function(){ item.open = false; }, 400);
      } else {
        item.open = true;
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.padding = '0 0 24px';
      }
    });
  });

  /* ── Section Nav Highlight ── */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');
  if(sections.length && navLinks.length){
    var sObs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          var id = e.target.id;
          navLinks.forEach(function(l){
            var href = l.getAttribute('href');
            if(href && href.includes('#' + id)) l.classList.add('section-active');
            else l.classList.remove('section-active');
          });
        }
      });
    }, {threshold:0.3, rootMargin:'-80px 0px -50% 0px'});
    sections.forEach(function(s){ sObs.observe(s); });
  }
})();
