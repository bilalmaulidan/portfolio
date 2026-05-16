/* ============================================================
   SCRIPT PATCH — mobile-patch.js
   Tambahkan SEBELUM </body>, SETELAH script.js
   <script src="mobile-patch.js"></script>
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------------
     Deteksi mobile (max 768px)
     Gunakan window.matchMedia agar akurat — lebih baik dari userAgent
  ---------------------------------------------------------------- */
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  if (!isMobile) return; // desktop: biarkan script.js jalan normal

  /* ----------------------------------------------------------------
     1. DISABLE PARALLAX SCROLL HANDLER
        script.js menambahkan scroll listener yang set style.transform
        langsung pada cloud-a, cloud-c, dan floating-house.
        Di mobile ini memaksa elemen keluar layar.

        Cara override: re-assign transform ke nilai aman setiap scroll
        setelah script.js selesai menjalankan handler-nya.
        (Karena kita tidak bisa hapus listener asli, kita counter-act)
  ---------------------------------------------------------------- */
  window.addEventListener('scroll', function () {
    const cloudA  = document.querySelector('.cloud-a');
    const cloudC  = document.querySelector('.cloud-c');
    const house   = document.querySelector('.floating-house');

    // Reset ke posisi CSS yang sudah kita set di mobile-patch.css
    // translateY pendek agar masih ada sedikit efek tanpa overflow
    const scrollY = window.scrollY;
    const gentleY = Math.min(scrollY * 0.08, 40); // max 40px — sangat subtle

    if (cloudA)  cloudA.style.transform  = `translateY(${gentleY}px)`;
    if (cloudC)  cloudC.style.transform  = `translateY(${gentleY * 0.6}px)`;
    if (house)   house.style.transform   = `translateX(-50%) translateY(${gentleY * 0.3}px)`;

  }, { passive: true });

  /* ----------------------------------------------------------------
     2. DISABLE GSAP INFINITE ANIMATIONS YANG BERAT
        Cloud dan house GSAP repeat:-1 → selalu aktif → drain baterai.
        Kita pause setelah GSAP load.
  ---------------------------------------------------------------- */
  window.addEventListener('load', function () {
    if (typeof gsap === 'undefined') return;

    // Pause animasi cloud & house (bukan yang lain)
    gsap.globalTimeline.getChildren().forEach(function (tween) {
      const targets = tween.targets ? tween.targets() : [];
      targets.forEach(function (el) {
        if (!el || !el.classList) return;
        const shouldPause =
          el.classList.contains('cloud-a') ||
          el.classList.contains('cloud-b') ||
          el.classList.contains('cloud-c') ||
          el.classList.contains('floating-house');
        if (shouldPause) tween.pause();
      });
    });

    // Tetap jalankan balon & scroll-triggered animations (ringan)
    console.log('[mobile-patch] GSAP heavy animations paused for mobile');
  });

  /* ----------------------------------------------------------------
     3. LAZY LOAD IFRAMES
        lanyard + YouTube + genially semuanya load sekaligus → berat.
        Tunda load hingga iframe masuk viewport.
  ---------------------------------------------------------------- */
  const lazyIframes = document.querySelectorAll('iframe');

  const iframeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const iframe = entry.target;
      if (iframe.dataset.src) {
        iframe.src = iframe.dataset.src;
        delete iframe.dataset.src;
      }
      iframeObserver.unobserve(iframe);
    });
  }, { rootMargin: '200px' });

  lazyIframes.forEach(function (iframe) {
    if (iframe.src && iframe.src !== 'about:blank') {
      iframe.dataset.src = iframe.src;
      iframe.removeAttribute('src');
      iframeObserver.observe(iframe);
    }
  });

  /* ----------------------------------------------------------------
     4. TOUCH FEEDBACK untuk story-dots (tidak ada :hover di mobile)
  ---------------------------------------------------------------- */
  document.querySelectorAll('.story-dot').forEach(function (dot) {
    dot.addEventListener('touchstart', function () {
      this.style.transform = 'scale(1.4)';
    }, { passive: true });
    dot.addEventListener('touchend', function () {
      this.style.transform = '';
    }, { passive: true });
  });

})();
