/* ═══════════════════════════════════════════════════
   MicroShip — Index-only WOW Features
   ═══════════════════════════════════════════════════ */
(function(){
  'use strict';

  /* ── Animated Stats Counters (desktop only) ── */
  if(window.innerWidth > 768){
    var counters = document.querySelectorAll('[data-count]');
    var counted = new Set();
    var cObs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(!e.isIntersecting || counted.has(e.target)) return;
        counted.add(e.target);
        var el = e.target;
        var target = parseInt(el.getAttribute('data-count'),10);
        var suffix = el.textContent.replace(/[\d,]/g,'').trim();
        var duration = 1500;
        var start = performance.now();
        function step(now){
          var p = Math.min((now - start) / duration, 1);
          var ease = 1 - Math.pow(1 - p, 3); // easeOutCubic
          var val = Math.floor(ease * target);
          el.textContent = val.toLocaleString() + suffix;
          if(p < 1) requestAnimationFrame(step);
        }
        el.textContent = '0' + suffix;
        requestAnimationFrame(step);
      });
    }, {threshold:0.3});
    counters.forEach(function(c){ cObs.observe(c); });
  }

  /* ── Loading Screen ── */
  var loader = document.getElementById('siteLoader');
  if(loader){
    setTimeout(function(){ loader.classList.add('done'); }, 1200);
    setTimeout(function(){ loader.style.display = 'none'; }, 1600);
  }

  /* ── Before/After Slider ── */
  var slider = document.querySelector('.ba-slider');
  if(slider){
    var divider = slider.querySelector('.ba-divider');
    var before = slider.querySelector('.ba-before');
    var dragging = false;
    function setPos(x){
      var rect = slider.getBoundingClientRect();
      var pct = Math.max(10, Math.min(90, ((x - rect.left) / rect.width) * 100));
      divider.style.left = pct + '%';
      before.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    }
    slider.addEventListener('mousedown', function(){ dragging = true; });
    window.addEventListener('mouseup', function(){ dragging = false; });
    slider.addEventListener('mousemove', function(e){ if(dragging) setPos(e.clientX); });
    slider.addEventListener('touchmove', function(e){ setPos(e.touches[0].clientX); }, {passive:true});
    slider.addEventListener('click', function(e){ setPos(e.clientX); });
  }

  /* ── Chat Widget ── */
  var body = document.body;
  body.classList.add('has-chat');
  var bubble = document.createElement('button');
  bubble.className = 'chat-bubble';
  bubble.innerHTML = '💬';
  bubble.setAttribute('aria-label','Open chat');

  var panel = document.createElement('div');
  panel.className = 'chat-panel';
  panel.innerHTML = '<div class="chat-header"><h4>💬 Ask About Your Move</h4><button class="chat-close" aria-label="Close chat">&times;</button></div>'
    + '<div class="chat-messages">'
    + '<div class="chat-msg bot">Hi! I\'m MicroShip\'s AI assistant. 👋 How can I help with your move?</div>'
    + '<div class="chat-msg bot">I can answer questions about pricing, services, or help you get a free quote!</div>'
    + '</div>'
    + '<div class="chat-input-area"><input type="text" placeholder="Type your question..." readonly><button aria-label="Send">➤</button></div>'
    + '<div class="chat-powered">Powered by AVC Optimize AI</div>';

  body.appendChild(panel);
  body.appendChild(bubble);

  bubble.onclick = function(){
    panel.classList.toggle('open');
    bubble.classList.toggle('hidden', panel.classList.contains('open'));
  };
  panel.querySelector('.chat-close').onclick = function(){
    panel.classList.remove('open');
    bubble.classList.remove('hidden');
  };
})();
