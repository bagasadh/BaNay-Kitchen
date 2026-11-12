// Animasi teks & split typography
function initChoreographedAnimations() {
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

  const footerWord = document.getElementById('footer-brand-word');
  if (footerWord) {
    const chars = footerWord.textContent.trim().split('');
    footerWord.innerHTML = chars
      .map((c, i) => {
        if (c === ' ') return ' ';
        return `<span class="bouncy-char" style="--char-delay:${i * 45}ms">${c}</span>`;
      })
      .join('');
  }

  document.querySelectorAll('.bento-pillar').forEach((pillar, i) => {
    pillar.style.setProperty('--anim-delay', `${i * 120}ms`);
  });

  document.querySelectorAll('.menu-arch-card').forEach((card, i) => {
    card.style.setProperty('--anim-delay', `${(i % 2) * 140}ms`);
  });
}
