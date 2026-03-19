const revealItems = document.querySelectorAll('.reveal');
const progressBar = document.querySelector('.scroll-progress');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const parallaxItems = document.querySelectorAll('[data-parallax]');
const tiltCards = document.querySelectorAll('.tilt-card');
const backToTop = document.querySelector('.back-to-top');
const header = document.querySelector('.site-header');
const carousels = document.querySelectorAll('.work-carousel');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item, index) => {
  if (!item.classList.toString().includes('delay-')) {
    item.style.transitionDelay = `${Math.min(index * 0.04, 0.28)}s`;
  }
  revealObserver.observe(item);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', isActive);
      });
    });
  },
  { threshold: 0.45 }
);

sections.forEach((section) => sectionObserver.observe(section));

const updateScrollUi = () => {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }

  if (header) {
    header.classList.toggle('scrolled', scrollTop > 22);
  }

  if (backToTop) {
    backToTop.classList.toggle('visible', scrollTop > 420);
  }
};

document.addEventListener('scroll', updateScrollUi);
updateScrollUi();

if (!prefersReducedMotion) {
  document.addEventListener('mousemove', (event) => {
    const { innerWidth, innerHeight } = window;
    const moveX = (event.clientX / innerWidth - 0.5) * 2;
    const moveY = (event.clientY / innerHeight - 0.5) * 2;

    parallaxItems.forEach((element) => {
      const speed = Number(element.dataset.parallax || 0.02);
      const translateX = moveX * 18 * speed * 20;
      const translateY = moveY * 14 * speed * 20;
      element.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
    });
  });
}

tiltCards.forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    if (prefersReducedMotion || window.innerWidth < 769) {
      return;
    }
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 9;
    const rotateX = (0.5 - (y / rect.height)) * 9;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

carousels.forEach((carousel) => {
  const slides = carousel.querySelectorAll('.carousel-slide');
  if (slides.length <= 1) {
    return;
  }

  let activeIndex = 0;
  const intervalMs = Number(carousel.dataset.interval || 3000);

  const setActiveSlide = (index) => {
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === index);
    });
  };

  const nextSlide = () => {
    activeIndex = (activeIndex + 1) % slides.length;
    setActiveSlide(activeIndex);
  };

  setActiveSlide(activeIndex);
  let timer = setInterval(nextSlide, intervalMs);

  carousel.addEventListener('mouseenter', () => {
    clearInterval(timer);
  });

  carousel.addEventListener('mouseleave', () => {
    timer = setInterval(nextSlide, intervalMs);
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') {
      return;
    }
    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = form.querySelector('button');
    if (button) {
      button.textContent = 'Mensagem enviada';
      button.disabled = true;
    }
  });
}

const githubPreview = document.querySelector('[data-github-preview]');
if (githubPreview) {
  const username = 'Nathan-Hergesel';
  const endpoint = `https://api.github.com/users/${username}/repos?sort=updated&per_page=2&type=owner`;

  const renderPreviewFallback = (text) => {
    githubPreview.innerHTML = '';
    const fallback = document.createElement('span');
    fallback.className = 'repo-preview-empty';
    fallback.textContent = text;
    githubPreview.appendChild(fallback);
  };

  const createMetric = (iconClass, value, extraClass = '') => {
    const metric = document.createElement('span');
    metric.className = 'repo-mini-metric';

    const icon = document.createElement('i');
    icon.className = iconClass;
    icon.setAttribute('aria-hidden', 'true');

    const text = document.createElement('span');
    text.textContent = value;
    if (extraClass) {
      text.className = extraClass;
    }

    metric.appendChild(icon);
    metric.appendChild(text);
    return metric;
  };

  fetch(endpoint)
    .then((response) => {
      if (!response.ok) {
        throw new Error('GitHub API indisponivel');
      }
      return response.json();
    })
    .then((repos) => {
      if (!Array.isArray(repos) || repos.length === 0) {
        renderPreviewFallback('Sem repositorios recentes');
        return;
      }

      githubPreview.innerHTML = '';

      repos.slice(0, 2).forEach((repo) => {
        const row = document.createElement('div');
        row.className = 'repo-mini-row';

        const name = document.createElement('span');
        name.className = 'repo-mini-name';
        name.textContent = repo.name;

        const metrics = document.createElement('span');
        metrics.className = 'repo-mini-metrics';
        metrics.appendChild(createMetric('bi bi-star-fill', String(repo.stargazers_count || 0)));
        metrics.appendChild(createMetric('bi bi-diagram-3-fill', String(repo.forks_count || 0)));
        metrics.appendChild(createMetric('bi bi-exclamation-circle-fill', String(repo.open_issues_count || 0)));
        metrics.appendChild(createMetric('bi bi-code-slash', repo.language || 'N/A', 'repo-mini-language'));

        row.appendChild(name);
        row.appendChild(metrics);
        githubPreview.appendChild(row);
      });
    })
    .catch(() => {
      renderPreviewFallback('Nossos projetos open source');
    });
}
