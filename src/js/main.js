const revealItems = document.querySelectorAll('.reveal');
const progressBar = document.querySelector('.scroll-progress');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const navToggle = document.querySelector('.nav-toggle');
const backToTop = document.querySelector('.back-to-top');
const header = document.querySelector('.site-header');
const carousels = document.querySelectorAll('.work-carousel');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const closeMobileMenu = () => {
  if (!header || !navToggle) {
    return;
  }
  header.classList.remove('menu-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Abrir menu');
};

if (header && navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('menu-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 680) {
      closeMobileMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMobileMenu();
    }
  });
}

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

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 680) {
      closeMobileMenu();
    }
  });
});

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

