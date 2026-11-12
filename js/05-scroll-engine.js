// Scroll animations & marquee
function initScrollScrubbingEngine() {
  const progressBar = document.getElementById('scroll-progress-bar');
  const animTargets = Array.from(
    document.querySelectorAll('[data-anim], [data-anim-lines="true"], [data-anim-chars="true"]')
  );

  const heroArchStage = document.getElementById('hero-arch-stage');
  const heroWordLeft = document.getElementById('hero-word-left');
  const heroWordRight = document.getElementById('hero-word-right');
  const heroSeal = document.getElementById('hero-seal-badge');
  const heroSticker1 = document.getElementById('hero-sticker-1');
  const heroSticker2 = document.getElementById('hero-sticker-2');
  const orbitStrudel = document.getElementById('orbit-strudel');
  const orbitQqball = document.getElementById('orbit-qqball');
  const ribbonTrack1 = document.getElementById('ribbon-track-1');
  const ribbonTrack2 = document.getElementById('ribbon-track-2');
  const storyHalo = document.getElementById('story-logo-halo');
  const storySection = document.getElementById('cerita');
  const galleryGrid = document.getElementById('gallery-fanned-grid');
  const polCards = document.querySelectorAll('.gallery-polaroid');
  const filmstripTrack = document.getElementById('filmstrip-track');

  let currentScroll = window.scrollY;
  let targetScroll = window.scrollY;
  let isTicking = false;

  let ribbon1SetWidth = 0;
  let ribbon2SetWidth = 0;
  let filmstripSetWidth = 0;

  function measureTrackSetWidth(track, itemsPerSet) {
    if (!track) return 0;
    const children = track.children;
    if (children.length > itemsPerSet) {
      const w = children[itemsPerSet].offsetLeft - children[0].offsetLeft;
      if (w > 0) return w;
    }
    const count = children.length;
    return count > 0 ? track.scrollWidth / Math.max(1, Math.floor(count / itemsPerSet)) : 0;
  }

  function setupMarqueeTracks() {
    function fillTrack(track, itemsPerSet) {
      if (!track) return;
      const initialChildren = Array.from(track.children);
      if (initialChildren.length < itemsPerSet) return;
      let setW = measureTrackSetWidth(track, itemsPerSet);
      if (setW <= 0) return;

      const neededWidth = window.innerWidth + setW * 2;
      const baseSlice = initialChildren.slice(0, itemsPerSet);
      let attempts = 0;
      while (track.scrollWidth < neededWidth && attempts < 8) {
        baseSlice.forEach((item) => {
          const clone = item.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          track.appendChild(clone);
        });
        attempts++;
      }
    }

    fillTrack(ribbonTrack1, 6);
    fillTrack(ribbonTrack2, 4);
    fillTrack(filmstripTrack, 6);

    ribbon1SetWidth = measureTrackSetWidth(ribbonTrack1, 6);
    ribbon2SetWidth = measureTrackSetWidth(ribbonTrack2, 4);
    filmstripSetWidth = measureTrackSetWidth(filmstripTrack, 6);
  }

  setupMarqueeTracks();

  function getSectionProgress(el) {
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    return Utils.clamp((vh - rect.top) / (vh + rect.height), 0, 1);
  }

  function updateScrubbedElements(scrollVal) {
    const vh = window.innerHeight;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
    const pct = Utils.clamp((scrollVal / maxScroll) * 100, 0, 100);

    if (progressBar) {
      progressBar.style.width = `${pct.toFixed(2)}%`;
    }

    // Reveal animasi saat elemen masuk viewport
    const enterBottom = vh * 0.94;
    const resetBottom = vh * 0.98;
    for (let i = 0; i < animTargets.length; i++) {
      const el = animTargets[i];
      const rect = el.getBoundingClientRect();
      if (rect.top < enterBottom && rect.bottom > -20) {
        if (!el.classList.contains('is-inview')) {
          el.classList.add('is-inview');
        }
      } else if (rect.top >= resetBottom) {
        el.classList.remove('is-inview');
      }
    }

    // Hero section scroll effects
    const heroProg = getSectionProgress(heroArchStage);
    const heroCentered = (heroProg - 0.5) * 2;

    if (heroWordLeft) {
      const shiftX = Utils.clamp(-scrollVal * 0.12, -90, 0);
      const shiftY = Utils.clamp(scrollVal * 0.05, 0, 40);
      heroWordLeft.style.transform = `translate3d(${shiftX.toFixed(1)}px, ${shiftY.toFixed(1)}px, 0)`;
    }
    if (heroWordRight) {
      const shiftX = Utils.clamp(scrollVal * 0.12, 0, 90);
      const shiftY = Utils.clamp(scrollVal * 0.05, 0, 40);
      heroWordRight.style.transform = `translate3d(${shiftX.toFixed(1)}px, ${shiftY.toFixed(1)}px, 0)`;
    }
    if (heroSeal) {
      heroSeal.style.setProperty('--scroll-rot', `${(heroCentered * 10).toFixed(1)}deg`);
    }
    if (heroSticker1) {
      heroSticker1.style.setProperty('--scroll-rot', `${(-7 - heroCentered * 3.5).toFixed(1)}deg`);
      heroSticker1.style.setProperty('--scroll-y', `${(-heroCentered * 5).toFixed(1)}px`);
    }
    if (heroSticker2) {
      heroSticker2.style.setProperty('--scroll-rot', `${(5 + heroCentered * 3.5).toFixed(1)}deg`);
      heroSticker2.style.setProperty('--scroll-y', `${(heroCentered * 5).toFixed(1)}px`);
    }

    if (window.innerWidth > 768) {
      if (orbitStrudel) {
        orbitStrudel.style.setProperty('--scroll-y', `${(-heroCentered * 5).toFixed(1)}px`);
        orbitStrudel.style.setProperty('--scroll-rot', `${(-1.5 + heroCentered * 1.2).toFixed(2)}deg`);
      }
      if (orbitQqball) {
        orbitQqball.style.setProperty('--scroll-y', `${(heroCentered * 5).toFixed(1)}px`);
        orbitQqball.style.setProperty('--scroll-rot', `${(1.5 - heroCentered * 1.2).toFixed(2)}deg`);
      }
    } else {
      if (orbitStrudel) {
        orbitStrudel.style.setProperty('--scroll-y', '0px');
        orbitStrudel.style.setProperty('--scroll-rot', '0deg');
      }
      if (orbitQqball) {
        orbitQqball.style.setProperty('--scroll-y', '0px');
        orbitQqball.style.setProperty('--scroll-rot', '0deg');
      }
    }

    const mod = (n, m) => ((n % m) + m) % m;

    // Ribbon marquee scroll
    const r1W = ribbon1SetWidth || (ribbonTrack1 ? ribbonTrack1.scrollWidth / 6 : 0);
    if (ribbonTrack1 && r1W > 0) {
      const shift1 = -mod(scrollVal * 0.38, r1W);
      ribbonTrack1.style.transform = `translate3d(${shift1.toFixed(1)}px, 0, 0)`;
    }
    const r2W = ribbon2SetWidth || (ribbonTrack2 ? ribbonTrack2.scrollWidth / 6 : 0);
    if (ribbonTrack2 && r2W > 0) {
      const shift2 = -r2W + mod(scrollVal * 0.38, r2W);
      ribbonTrack2.style.transform = `translate3d(${shift2.toFixed(1)}px, 0, 0)`;
    }

    // Story logo rotation
    if (storySection && storyHalo) {
      const p = getSectionProgress(storySection);
      const scale = 0.92 + Math.sin(p * Math.PI) * 0.16;
      storyHalo.style.transform = `rotate(${(p * 240).toFixed(1)}deg) scale(${scale.toFixed(3)})`;
    }

    // Gallery polaroid fan & filmstrip
    if (galleryGrid) {
      if (window.innerWidth > 1024) {
        const p = getSectionProgress(galleryGrid);
        const spread = (p - 0.5) * 2;
        const baseAngles = [-4, 2.5, -2.5, 4];
        const baseY = [10, -8, -6, 10];

        polCards.forEach((card, idx) => {
          const rot = baseAngles[idx] + spread * (idx % 2 === 0 ? -5 : 5);
          const dy = baseY[idx] + spread * (idx % 2 === 0 ? -14 : 14);
          card.style.setProperty('--scroll-y', `${dy.toFixed(1)}px`);
          card.style.setProperty('--scroll-rot', `${rot.toFixed(2)}deg`);
        });
      } else {
        polCards.forEach((card) => {
          card.style.setProperty('--scroll-y', '0px');
          card.style.setProperty('--scroll-rot', '0deg');
        });
      }
    }

    const fsW = filmstripSetWidth || (filmstripTrack ? filmstripTrack.scrollWidth / 6 : 0);
    if (filmstripTrack && fsW > 0) {
      const loopShift = -mod(scrollVal * 0.42, fsW);
      filmstripTrack.style.transform = `translate3d(${loopShift.toFixed(1)}px, 0, 0)`;
    }
  }

  function animateScrollLoop() {
    currentScroll = Utils.lerp(currentScroll, targetScroll, 0.16);
    updateScrubbedElements(currentScroll);

    if (Math.abs(targetScroll - currentScroll) > 0.08) {
      requestAnimationFrame(animateScrollLoop);
    } else {
      currentScroll = targetScroll;
      updateScrubbedElements(currentScroll);
      isTicking = false;
    }
  }

  function requestTick() {
    targetScroll = window.scrollY;
    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(animateScrollLoop);
    }
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', () => {
    setupMarqueeTracks();
    requestTick();
  });

  requestTick();
}
