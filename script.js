// Variabile globale
let lastScrollY = window.scrollY;

// Inițializare când documentul e gata
document.addEventListener('DOMContentLoaded', function() {
    initHamburgerMenu();
    initScrollHeader();
    updateActiveNavLink();
    initCarousel();
    
    // Event listener pentru scroll
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', updateActiveNavLink);
});

// Funcție pentru scroll smooth către secțiuni
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Funcție pentru gestionarea scroll-ului și afișarea header-ului
function handleScroll() {
    const header = document.querySelector('header');
    const currentScrollY = window.scrollY;
    
    if (header) {
        // Header-ul devine vizibil după primul scroll
        if (currentScrollY > 50) {
            header.classList.add('visible');
        }
    }
    
    lastScrollY = currentScrollY;
}

// Inițializare header la scroll
function initScrollHeader() {
    const header = document.querySelector('header');
    if (header && window.scrollY > 50) {
        header.classList.add('visible');
    }
}

// Funcție pentru a gestiona meniul hamburger
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');
    
    // Funcție pentru a închide meniul
    function closeMenu() {
        if (hamburger) hamburger.classList.remove('active');
        if (navLinks) navLinks.classList.remove('active');
        if (header) header.classList.remove('menu-open');
    }
    
    // Funcție pentru a deschide meniul
    function openMenu() {
        if (hamburger) hamburger.classList.add('active');
        if (navLinks) navLinks.classList.add('active');
        if (header) {
            header.classList.add('menu-open');
            header.classList.add('visible'); // Asigură-te că header-ul este vizibil
        }
    }
    
    if (hamburger && navLinks && header) {
        // Event listener pentru hamburger
        hamburger.addEventListener('click', function() {
            // Toggle meniul
            if (navLinks.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Închide meniul când se face click pe un link de navigare
        const navLinksItems = navLinks.querySelectorAll('a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                closeMenu();
            });
        });
        
        // Închide meniul când se face click în afara lui
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnHamburger) {
                closeMenu();
            }
        });
    }
}

// Funcție pentru a evidenția linkul activ în navigare
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Variabile pentru carousel
let currentSlide = 0;
const cardsPerView = 3;

// Funcție pentru a actualiza vizibilitatea săgeților
function updateArrowsVisibility() {
    const grid = document.getElementById('projectsGrid');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!grid || !prevBtn || !nextBtn) return;
    
    const cards = grid.querySelectorAll('.project-card');
    const totalCards = cards.length;
    const isDesktop = window.innerWidth > 768;
    const cardsPerViewCurrent = isDesktop ? 3 : 1;
    const maxSlides = Math.ceil(totalCards / cardsPerViewCurrent) - 1;
    
    // Ascunde/afișează săgeata stângă
    if (currentSlide <= 0) {
        prevBtn.style.opacity = '0';
        prevBtn.style.pointerEvents = 'none';
    } else {
        prevBtn.style.opacity = '1';
        prevBtn.style.pointerEvents = 'auto';
    }
    
    // Ascunde/afișează săgeata dreaptă
    if (currentSlide >= maxSlides) {
        nextBtn.style.opacity = '0';
        nextBtn.style.pointerEvents = 'none';
    } else {
        nextBtn.style.opacity = '1';
        nextBtn.style.pointerEvents = 'auto';
    }
}

// Funcție pentru a muta carousel-ul
function moveCarousel(direction) {
    const grid = document.getElementById('projectsGrid');
    const cards = grid.querySelectorAll('.project-card');
    const totalCards = cards.length;
    const isDesktop = window.innerWidth > 768;
    const cardsPerViewCurrent = isDesktop ? 3 : 1;
    const maxSlides = Math.ceil(totalCards / cardsPerViewCurrent) - 1;
    
    // Calculează noul slide
    currentSlide += direction;
    
    // Limitează valorile
    if (currentSlide < 0) {
        currentSlide = 0;
    } else if (currentSlide > maxSlides) {
        currentSlide = maxSlides;
    }
    
    // Calculează deplasarea
    const cardWidth = cards[0].offsetWidth;
    const gap = 32; // 2rem gap
    const slideWidth = isDesktop ? (cardWidth + gap) * cardsPerViewCurrent : cardWidth + gap;
    const translateX = -currentSlide * slideWidth;
    
    // Aplică transformarea
    grid.style.transform = `translateX(${translateX}px)`;
    
    // Actualizează vizibilitatea săgeților
    updateArrowsVisibility();
}

// Adaugă inițializarea carousel-ului
function initCarousel() {
    const updateCarousel = () => {
        const grid = document.getElementById('projectsGrid');
        if (grid) {
            const isDesktop = window.innerWidth > 768;
            const cardsPerViewCurrent = isDesktop ? 3 : 1;
            
            if (!isDesktop) {
                // Pe mobile, resetează poziția
                currentSlide = 0;
                grid.style.transform = 'translateX(0px)';
            }
            
            // Actualizează vizibilitatea săgeților
            updateArrowsVisibility();
        }
    };
    
    // Inițializează săgețile la încărcare
    setTimeout(() => {
        updateArrowsVisibility();
    }, 100);
    
    window.addEventListener('resize', updateCarousel);
    updateCarousel();
}
