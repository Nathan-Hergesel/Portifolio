const revealItems = document.querySelectorAll('.reveal');
const progressBar = document.querySelector('.scroll-progress');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const navToggle = document.querySelector('.nav-toggle');
const backToTop = document.querySelector('.back-to-top');
const header = document.querySelector('.site-header');
const carousels = document.querySelectorAll('.work-carousel');
const workCardTriggers = document.querySelectorAll('.work-card-trigger');
const projectModal = document.querySelector('[data-project-modal]');
const projectModalTitle = projectModal?.querySelector('.project-modal-title');
const projectModalImage = projectModal?.querySelector('.project-modal-image');
const projectModalCounter = projectModal?.querySelector('[data-project-counter]');
const projectModalDots = projectModal?.querySelector('[data-project-dots]');
const projectModalFileName = projectModal?.querySelector('[data-project-file-name]');
const projectModalPrev = projectModal?.querySelector('[data-project-prev]');
const projectModalNext = projectModal?.querySelector('[data-project-next]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const formPopup = document.querySelector('[data-form-popup]');
const formPopupTitle = formPopup?.querySelector('[data-form-popup-title]');
const formPopupIcon = formPopup?.querySelector('[data-form-popup-icon]');
const formPopupMessage = formPopup?.querySelector('[data-form-popup-message]');

let modalSlides = [];
let modalSlideIndex = 0;
let modalLastFocusedElement = null;
let modalTimer = null;
let formPopupTimer = null;
const modalIntervalMs = 3500;

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

const clearModalAutoplay = () => {
  if (modalTimer) {
    clearInterval(modalTimer);
    modalTimer = null;
  }
};

const startModalAutoplay = () => {
  clearModalAutoplay();
  if (!projectModal || projectModal.hidden || modalSlides.length <= 1 || prefersReducedMotion) {
    return;
  }

  modalTimer = setInterval(() => {
    modalSlideIndex = (modalSlideIndex + 1) % modalSlides.length;
    updateModalSlide();
  }, modalIntervalMs);
};

const updateModalDots = () => {
  if (!projectModalDots) {
    return;
  }

  projectModalDots.innerHTML = '';
  modalSlides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'project-modal-dot';
    dot.setAttribute('aria-label', `Ir para imagem ${index + 1}`);
    dot.dataset.slideIndex = String(index);
    dot.classList.toggle('is-active', index === modalSlideIndex);
    projectModalDots.appendChild(dot);
  });

  projectModalDots.hidden = modalSlides.length <= 1;
};

const updateModalSlide = () => {
  if (!projectModalImage || modalSlides.length === 0) {
    return;
  }

  const currentSlide = modalSlides[modalSlideIndex];

  const getReadableFileName = (src) => {
    const cleanPath = src.split('#')[0].split('?')[0];
    const fileName = cleanPath.slice(cleanPath.lastIndexOf('/') + 1);
    const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');

    try {
      return decodeURIComponent(fileNameWithoutExtension);
    } catch {
      return fileNameWithoutExtension;
    }
  };

  projectModalImage.classList.remove('is-ready');
  projectModalImage.src = currentSlide.src;
  projectModalImage.alt = currentSlide.alt || `Projeto ${modalSlideIndex + 1}`;

  if (projectModalFileName) {
    projectModalFileName.textContent = getReadableFileName(currentSlide.src || '') || 'arquivo sem nome';
  }

  requestAnimationFrame(() => {
    projectModalImage.classList.add('is-ready');
  });

  if (projectModalCounter) {
    projectModalCounter.textContent = `${modalSlideIndex + 1} / ${modalSlides.length}`;
  }

  if (projectModalPrev) {
    projectModalPrev.hidden = modalSlides.length <= 1;
  }

  if (projectModalNext) {
    projectModalNext.hidden = modalSlides.length <= 1;
  }

  if (projectModalDots) {
    const dots = projectModalDots.querySelectorAll('.project-modal-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === modalSlideIndex);
    });
  }
};

const goToModalSlide = (nextIndex) => {
  if (modalSlides.length === 0) {
    return;
  }

  modalSlideIndex = (nextIndex + modalSlides.length) % modalSlides.length;
  updateModalSlide();
};

const buildSlidesFromCard = (card) => {
  const sourceImages = card.querySelectorAll('.work-modal-data img');
  const fallbackImages = card.querySelectorAll(':scope > img');
  const rawImages = sourceImages.length > 0 ? sourceImages : fallbackImages;

  return Array.from(rawImages)
    .map((image) => ({
      src: image.getAttribute('src') || '',
      alt: image.getAttribute('alt') || ''
    }))
    .filter((slide) => slide.src);
};

const closeProjectModal = () => {
  if (!projectModal || projectModal.hidden) {
    return;
  }

  clearModalAutoplay();
  projectModal.hidden = true;
  projectModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');

  modalSlides = [];
  modalSlideIndex = 0;

  if (projectModalDots) {
    projectModalDots.innerHTML = '';
  }

  if (projectModalFileName) {
    projectModalFileName.textContent = '';
  }

  if (modalLastFocusedElement instanceof HTMLElement) {
    modalLastFocusedElement.focus();
  }
};

const closeFormPopup = () => {
  if (!formPopup || formPopup.hidden) {
    return;
  }

  if (formPopupTimer) {
    clearTimeout(formPopupTimer);
    formPopupTimer = null;
  }

  formPopup.hidden = true;
  formPopup.setAttribute('aria-hidden', 'true');
  formPopup.classList.remove('form-popup--error');
  document.body.classList.remove('popup-open');
};

const openFormPopup = (message, isSuccess = true) => {
  if (!formPopup) {
    return;
  }

  if (formPopupTitle) {
    formPopupTitle.textContent = isSuccess ? 'Tudo certo por aqui' : 'Ops, algo falhou';
  }

  if (formPopupIcon) {
    formPopupIcon.innerHTML = `<i class="bi ${isSuccess ? 'bi-check2-circle' : 'bi-exclamation-triangle-fill'}"></i>`;
  }

  if (formPopupMessage) {
    formPopupMessage.textContent = message;
  }

  formPopup.classList.toggle('form-popup--error', !isSuccess);
  formPopup.hidden = false;
  formPopup.setAttribute('aria-hidden', 'false');
  document.body.classList.add('popup-open');

  if (formPopupTimer) {
    clearTimeout(formPopupTimer);
  }

  formPopupTimer = window.setTimeout(() => {
    closeFormPopup();
  }, 4200);
};

const openProjectModal = (card) => {
  if (!projectModal || !projectModalTitle || !projectModalImage) {
    return;
  }

  const slides = buildSlidesFromCard(card);
  if (slides.length === 0) {
    return;
  }

  modalLastFocusedElement = card;
  modalSlides = slides;
  modalSlideIndex = 0;

  const cardTitle = card.dataset.projectTitle || card.querySelector('.work-overlay h4')?.textContent || 'Projeto';
  projectModalTitle.textContent = cardTitle;

  updateModalDots();
  updateModalSlide();

  projectModal.hidden = false;
  projectModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  startModalAutoplay();
};

workCardTriggers.forEach((card) => {
  card.addEventListener('click', () => {
    openProjectModal(card);
  });

  card.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    event.preventDefault();
    openProjectModal(card);
  });
});

if (projectModal) {
  projectModal.querySelectorAll('[data-project-close]').forEach((element) => {
    element.addEventListener('click', () => {
      closeProjectModal();
    });
  });

  projectModalPrev?.addEventListener('click', () => {
    goToModalSlide(modalSlideIndex - 1);
    startModalAutoplay();
  });

  projectModalNext?.addEventListener('click', () => {
    goToModalSlide(modalSlideIndex + 1);
    startModalAutoplay();
  });

  projectModalDots?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.classList.contains('project-modal-dot')) {
      return;
    }

    const nextIndex = Number(target.dataset.slideIndex);
    if (Number.isNaN(nextIndex)) {
      return;
    }

    goToModalSlide(nextIndex);
    startModalAutoplay();
  });
}

document.addEventListener('keydown', (event) => {
  if (formPopup && !formPopup.hidden && event.key === 'Escape') {
    closeFormPopup();
    return;
  }

  if (!projectModal || projectModal.hidden) {
    return;
  }

  if (event.key === 'Escape') {
    closeProjectModal();
    return;
  }

  if (event.key === 'ArrowLeft') {
    goToModalSlide(modalSlideIndex - 1);
    startModalAutoplay();
    return;
  }

  if (event.key === 'ArrowRight') {
    goToModalSlide(modalSlideIndex + 1);
    startModalAutoplay();
  }
});

if (formPopup) {
  formPopup.querySelectorAll('[data-form-close]').forEach((element) => {
    element.addEventListener('click', () => {
      closeFormPopup();
    });
  });
}

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
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const button = form.querySelector('button[type="submit"]');
    const originalText = button?.textContent || 'Enviar contato →';

    if (button) {
      button.textContent = 'Enviando...';
      button.disabled = true;
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: new FormData(form)
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || payload?.success === false) {
        throw new Error(payload?.message || 'Falha no envio');
      }

      form.reset();
      openFormPopup('Sua mensagem foi enviada com sucesso. Em breve entro em contato.');
    } catch {
      openFormPopup('Não foi possível enviar agora. Tente novamente em instantes.');
    } finally {
      if (button) {
        button.textContent = originalText;
        button.disabled = false;
      }
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

