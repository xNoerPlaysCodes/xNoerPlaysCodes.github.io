const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.getElementById('year').textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

if (!prefersReducedMotion) {
  document.querySelectorAll('.tilt').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 7;
      const rotateX = -((y / rect.height) - 0.5) * 7;

      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

async function hydrateRepoStats() {
  const targets = [...document.querySelectorAll('[data-repo]')];
  if (!targets.length) return;

  await Promise.allSettled(targets.map(async (target) => {
    const repo = target.dataset.repo;
    const response = await fetch(`https://api.github.com/repos/xNoerPlaysCodes/${repo}`, {
      headers: { Accept: 'application/vnd.github+json' }
    });
    if (!response.ok) return;

    const data = await response.json();
    const stars = Number(data.stargazers_count || 0);
    const forks = Number(data.forks_count || 0);
    const lang = data.language || 'Code';
    target.textContent = `${lang} · ★ ${stars} · forks ${forks}`;
  }));
}

hydrateRepoStats();
