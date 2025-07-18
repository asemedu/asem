// Variabile globale
let lastScrollY = window.scrollY;

// Inițializare când documentul e gata
document.addEventListener('DOMContentLoaded', function() {
    initHamburgerMenu();
    initScrollHeader();
    updateActiveNavLink();
    
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
    const closeMenuBtn = document.querySelector('.close-menu');
    
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
        
        // Event listener pentru butonul X
        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', function(event) {
                event.stopPropagation(); // Previne propagarea evenimentului
                closeMenu();
            });
        }
        
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
            const isClickOnCloseBtn = closeMenuBtn && closeMenuBtn.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnHamburger && !isClickOnCloseBtn) {
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
