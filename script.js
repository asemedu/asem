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
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
        initAutoHamburgerOnHome();
    }
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
// Activează automat meniul hamburger pe homepage când treci de prima poză
function initAutoHamburgerOnHome() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');
    const heroSection = document.getElementById('acasa');
    let menuWasAutoOpened = false;

    function openMenuAuto() {
        if (hamburger && navLinks && header) {
            hamburger.classList.add('active');
            navLinks.classList.add('active');
            header.classList.add('menu-open');
            header.classList.add('visible');
            menuWasAutoOpened = true;
        }
    }
    function closeMenuAuto() {
        if (hamburger && navLinks && header) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            header.classList.remove('menu-open');
            menuWasAutoOpened = false;
        }
    }

    window.addEventListener('scroll', function() {
        if (!heroSection) return;
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        if (window.scrollY > heroBottom) {
            if (!menuWasAutoOpened) openMenuAuto();
        } else {
            if (menuWasAutoOpened) closeMenuAuto();
        }
    });
}
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

// Funcții pentru galeria de imagini din articole (similar cu carouselul de proiecte)
let currentImageSlide = 0;

function moveImageCarousel(direction) {
    const grid = document.getElementById('galleryGrid');
    const cards = grid ? grid.querySelectorAll('.gallery-image-card') : [];
    
    if (cards.length === 0) return;
    
    const isDesktop = window.innerWidth > 1024;
    const isTablet = window.innerWidth > 768;
    
    let cardsPerView;
    if (isDesktop) {
        cardsPerView = 3;
    } else if (isTablet) {
        cardsPerView = 2;
    } else {
        cardsPerView = 1;
    }
    
    const maxSlides = Math.max(0, cards.length - cardsPerView);
    
    // Calculează noul slide cu loop infinit
    currentImageSlide += direction;
    
    // Implementează loop infinit
    if (currentImageSlide < 0) {
        currentImageSlide = maxSlides;
    } else if (currentImageSlide > maxSlides) {
        currentImageSlide = 0;
    }
    
    // Calculează lățimea unui card plus gap
    const cardWidth = cards[0].offsetWidth;
    const gap = 32; // 2rem în pixeli
    const translateX = -currentImageSlide * (cardWidth + gap);
    
    grid.style.transform = `translateX(${translateX}px)`;
    
    // Actualizează săgețile (acum vor fi mereu vizibile)
    updateImageCarouselArrows();
}

function updateImageCarouselArrows() {
    const prevBtn = document.querySelector('.gallery-carousel .prev-btn');
    const nextBtn = document.querySelector('.gallery-carousel .next-btn');
    const grid = document.getElementById('galleryGrid');
    const cards = grid ? grid.querySelectorAll('.gallery-image-card') : [];
    
    if (!prevBtn || !nextBtn || cards.length === 0) return;
    
    const isDesktop = window.innerWidth > 1024;
    const isTablet = window.innerWidth > 768;
    
    let cardsPerView;
    if (isDesktop) {
        cardsPerView = 3;
    } else if (isTablet) {
        cardsPerView = 2;
    } else {
        cardsPerView = 1;
    }
    
    // În loop infinit, afișează săgețile doar dacă avem mai multe imagini decât cele vizibile
    if (cards.length > cardsPerView) {
        // Ambele săgeți sunt vizibile și funcționale în loop infinit
        prevBtn.style.opacity = '1';
        prevBtn.style.pointerEvents = 'auto';
        nextBtn.style.opacity = '1';
        nextBtn.style.pointerEvents = 'auto';
    } else {
        // Ascunde săgețile dacă nu sunt necesare
        prevBtn.style.opacity = '0';
        prevBtn.style.pointerEvents = 'none';
        nextBtn.style.opacity = '0';
        nextBtn.style.pointerEvents = 'none';
    }
}

function initImageCarousel() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    
    const updateCarousel = () => {
        const cards = grid.querySelectorAll('.gallery-image-card');
        if (cards.length === 0) return;
        
        const isDesktop = window.innerWidth > 1024;
        const isTablet = window.innerWidth > 768;
        
        let cardsPerView;
        if (isDesktop) {
            cardsPerView = 3;
        } else if (isTablet) {
            cardsPerView = 2;
        } else {
            cardsPerView = 1;
        }
        
        // Nu mai resetăm poziția - păstrăm loop-ul infinit pe toate dimensiunile
        // if (!isDesktop && currentImageSlide > 0) {
        //     currentImageSlide = 0;
        //     grid.style.transform = 'translateX(0px)';
        // }
        
        // Actualizează vizibilitatea săgeților
        updateImageCarouselArrows();
    };
    
    // Inițializează săgețile la încărcare
    setTimeout(() => {
        updateImageCarouselArrows();
    }, 100);
    
    window.addEventListener('resize', updateCarousel);
    updateCarousel();
}

// Inițializează galeria când documentul se încarcă
document.addEventListener('DOMContentLoaded', function() {
    // Inițializează galeria dacă există
    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid) {
        initImageCarousel();
    }
    
    // Inițializează funcționalitatea formularelor
    initContactForms();
});

// Funcționalitate pentru formularele de contact
function initContactForms() {
    // Formular de contact
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Colectează datele din formular
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Simulează trimiterea mesajului (aici poți integra cu un serviciu real)
            showMessage('Mesajul tău a fost trimis cu succes! Îți vom răspunde în curând.', 'success');
            
            // Resetează formularul
            contactForm.reset();
        });
    }
    
    // Formular newsletter
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('newsletter-email').value;
            
            // Simulează abonarea la newsletter (aici poți integra cu un serviciu real)
            showMessage('Te-ai abonat cu succes la newsletter-ul nostru!', 'success');
            
            // Resetează formularul
            newsletterForm.reset();
        });
    }
}

// Funcție pentru afișarea mesajelor de feedback
function showMessage(message, type) {
    // Creează elementul de mesaj
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}`;
    messageEl.textContent = message;
    
    // Stilizează mesajul
    messageEl.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? 'rgb(147, 197, 114)' : '#e74c3c'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    
    // Adaugă mesajul în DOM
    document.body.appendChild(messageEl);
    
    // Animație de intrare
    setTimeout(() => {
        messageEl.style.transform = 'translateX(0)';
    }, 10);
    
    // Înlătură mesajul după 5 secunde
    setTimeout(() => {
        messageEl.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    }, 5000);
}
