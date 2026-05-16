/* ============================================================
   MOBILE PATCH JS v2 — mobile-patch.js
   Ganti mobile-patch.js sebelumnya dengan file ini.
   Letakkan SETELAH script.js, sebelum </body>:
   <script src="mobile-patch.js"></script>
   ============================================================ */

(function () {
  'use strict';

  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  /* ----------------------------------------------------------------
     PARALLAX OVERRIDE — berlaku di mobile DAN tablet semua width
     Script.js set transform langsung pada cloud & house setiap scroll.
     Kita counter dengan handler yang jalan SETELAH handler asli.
  ---------------------------------------------------------------- */
  if (isMobile) {

    // Pakai requestAnimationFrame agar tidak tumpuk dengan handler asli
    let rafId = null;

    window.addEventListener('scroll', function () {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(function () {
        const cloudA = document.querySelector('.cloud-a');
        const cloudC = document.querySelector('.cloud-c');
        const house  = document.querySelector('.floating-house');

        // Parallax sangat minimal — hanya 4% dari scrollY, max 30px
        const sy       = window.scrollY;
        const gentleY  = Math.min(sy * 0.04, 30);

        if (cloudA) cloudA.style.transform  = `translateY(${gentleY}px)`;
        if (cloudC) cloudC.style.transform  = `translateY(${gentleY * 0.6}px)`;
        // Rumah HARUS tetap translateX(-50%) agar tidak loncat ke kiri
        if (house)  house.style.transform   = `translateX(-50%) translateY(${gentleY * 0.3}px)`;

        rafId = null;
      });
    }, { passive: true });

    /* ----------------------------------------------------------------
       GSAP PAUSE — cloud & house animations drain GPU di mobile
    ---------------------------------------------------------------- */
    window.addEventListener('load', function () {
      if (typeof gsap === 'undefined') return;

      try {
        gsap.globalTimeline.getChildren(true, true, false).forEach(function (tween) {
          const targets = tween.targets ? tween.targets() : [];
          targets.forEach(function (el) {
            if (!el || !el.classList) return;
            const isPaused =
              el.classList.contains('cloud-a') ||
              el.classList.contains('cloud-b') ||
              el.classList.contains('cloud-c') ||
              el.classList.contains('floating-house');
            if (isPaused) tween.pause();
          });
        });
      } catch (e) {
        // Kalau GSAP API berubah, skip saja
      }
    });

    /* ----------------------------------------------------------------
       LAZY LOAD IFRAMES — tunda load hingga masuk viewport
       Ini sangat membantu performa initial load di mobile
    ---------------------------------------------------------------- */
    if ('IntersectionObserver' in window) {
      const iframes = document.querySelectorAll('iframe');

      const obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const iframe = entry.target;
          if (iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
            delete iframe.dataset.src;
          }
          obs.unobserve(iframe);
        });
      }, { rootMargin: '150px' });

      iframes.forEach(function (iframe) {
        if (iframe.src && !iframe.src.includes('about:blank')) {
          iframe.dataset.src = iframe.src;
          iframe.removeAttribute('src');
          obs.observe(iframe);
        }
      });
    }

    /* ----------------------------------------------------------------
       FIX: room-clock margin-top:500px override
       CSS sudah handle ini tapi !important mungkin kalah dengan inline.
       Pastikan via JS juga.
    ---------------------------------------------------------------- */
    window.addEventListener('DOMContentLoaded', function () {
      const clock = document.querySelector('.room-clock');
      if (clock) {
        clock.style.removeProperty('margin-top');
        clock.style.marginTop = '0';
      }

      // Pastikan game-screen tidak punya right:353px yang dipasang inline
      const gameScreen = document.querySelector('.game-screen');
      if (gameScreen) {
        // Biarkan CSS handle, cukup pastikan tidak ada inline style
        // gameScreen.removeAttribute('style');
      }
    });

  } // end isMobile

  /* ----------------------------------------------------------------
     NAV DOT ACTIVE — touch feedback (semua device)
  ---------------------------------------------------------------- */
  document.querySelectorAll('.story-dot').forEach(function (dot) {
    dot.addEventListener('touchstart', function () {
      this.style.transform = 'scale(1.5)';
      this.style.background = 'var(--sun, #ffd66d)';
    }, { passive: true });
    dot.addEventListener('touchend', function () {
      this.style.transform = '';
      // Jangan reset background — biarkan .is-active handle
    }, { passive: true });
  });

})();
