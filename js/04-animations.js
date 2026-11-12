/* ----------------------------------------------------------------------------
 * 4. CHOREOGRAPHED ENTRANCES & TEXT SPLITTING
 * ------------------------------------------------------------------------- */
function initChoreographedAnimations() {
  // Split Headlines into masked bouncy lines
  document.querySelectorAll('.hero-editorial-title, .section-serif-title').forEach((heading) => {
    const rawHtml = heading.innerHTML.trim();
    const lines = rawHtml.split(/<br\s*\/?>/i);
    heading.innerHTML = lines
      .map(
        (line, idx) =>
          `<span class="split-line-mask"><span class="split-line-inner" style="--line-delay:${idx * 100}ms">${line.trim()}</span></span>`
      )
      .join('');
    heading.setAttribute('data-anim-lines', 'true');
  });

  // Split Footer Signature Wordmark into bouncy interactive characters
  const footerWord = document.querySelector('.footer-giant-word');
  if (footerWord) {
    const text = footerWord.textContent.trim();
    footerWord.innerHTML = text
      .split('')
      .map((ch, idx) =>
        ch === ' '
          ? '&nbsp;'
          : `<span class="bouncy-char" style="--char-delay:${idx * 55}ms">${ch}</span>`
      )
      .join('');
    footerWord.setAttribute('data-anim-chars', 'true');
  }

  // Staggered delays setup
  const setStagger = (selector, delayFn, animAttr = null) => {
    document.querySelectorAll(selector).forEach((el, idx) => {
      if (animAttr) el.setAttribute('data-anim', animAttr);
      el.style.setProperty('--anim-delay', `${delayFn(idx)}ms`);
    });
  };

  setStagger('.bento-pillar', (i) => i * 115);
  setStagger('.menu-arch-card', (i) => (i % 2) * 115);
  setStagger('.gallery-polaroid', (i) => i * 95);
  setStagger('.ig-thumb', (i) => i * 85, 'pop-scale');
  setStagger('.footer-nav-col a', (i) => i * 50, 'fade-up');
}
