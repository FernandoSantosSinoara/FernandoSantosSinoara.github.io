/**
 * Portfólio Fernando Santos Sinoara - Script Principal (Vanilla JS)
 * Funcionalidades: Tema Claro/Escuro, Menu Mobile Acessível, Filtro de Projetos,
 * Intersection Observer para Scroll Reveal, ScrollSpy e Voltar ao Topo.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicialização de Componentes
    initThemeManager();
    initMobileMenu();
    initProjectFilters();
    initScrollReveal();
    initScrollSpy();
    initBackToTop();
    initCurrentYear();
});

/* ==========================================================================
   1. GERENCIAMENTO DE TEMA (Claro/Escuro)
   ========================================================================== */
function initThemeManager() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    // Verificar preferência salva ou padrão do sistema
    const savedTheme = localStorage.getItem('portfolio-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(currentTheme);

    // Escutar mudança de preferência do sistema operacional
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('portfolio-theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    themeToggleBtn.addEventListener('click', () => {
        const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
        
        applyTheme(newTheme);
        try {
            localStorage.setItem('portfolio-theme', newTheme);
        } catch (err) {
            console.warn('Não foi possível salvar a preferência no localStorage:', err);
        }
    });
}

function applyTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

/* ==========================================================================
   2. MENU MOBILE ACESSÍVEL (Gerenciamento de Foco e ARIA)
   ========================================================================== */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    if (!menuToggle || !mainNav) return;

    const navLinks = mainNav.querySelectorAll('.nav-link');

    function toggleMenu(open) {
        const isOpen = open !== undefined ? open : menuToggle.getAttribute('aria-expanded') !== 'true';
        
        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
        mainNav.classList.toggle('is-open', isOpen);

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        } else {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            toggleMenu(false);
            menuToggle.focus();
        }
    }

    menuToggle.addEventListener('click', () => toggleMenu());

    // Fechar ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                toggleMenu(false);
            }
        });
    });

    // Fechar ao redimensionar para desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && mainNav.classList.contains('is-open')) {
            toggleMenu(false);
        }
    });
}

/* ==========================================================================
   3. FILTRO DE PROJETOS (Acessível via Teclado)
   ========================================================================== */
function initProjectFilters() {
    const filterContainer = document.querySelector('.project-filters');
    if (!filterContainer) return;

    const filterButtons = filterContainer.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedFilter = btn.getAttribute('data-filter');

            // Atualizar botões
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            // Filtrar cards
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (selectedFilter === 'all' || category === selectedFilter) {
                    card.classList.remove('is-hidden');
                } else {
                    card.classList.add('is-hidden');
                }
            });
        });
    });
}

/* ==========================================================================
   4. INTERSECTION OBSERVER PARA REVEAL ANIMATION
   ========================================================================== */
function initScrollReveal() {
    // Respeitar preferência de movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const targets = document.querySelectorAll('.skills-card, .project-card, .timeline-item, .about-card, .contact-card');
    
    targets.forEach(el => el.classList.add('reveal-item'));

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    targets.forEach(target => observer.observe(target));
}

/* ==========================================================================
   5. SCROLLSPY (Indicador Visual da Seção Ativa)
   ========================================================================== */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   6. BOTÃO VOLTAR AO TOPO
   ========================================================================== */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    function handleScroll() {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('is-visible');
        } else {
            backToTopBtn.classList.remove('is-visible');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================================================
   7. ANO ATUAL NO RODAPÉ
   ========================================================================== */
function initCurrentYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}
