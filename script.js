// Funcție pentru scroll lin către secțiuni
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Funcție pentru a gestiona afișarea header-ului pe scroll
function initHeaderScrollBehavior() {
    const header = document.querySelector('header');
    let headerVisible = false;
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Odată ce utilizatorul scrollează puțin (mai mult de 50px), afișează header-ul permanent
        if (!headerVisible && scrollTop > 50) {
            header.classList.add('visible');
            headerVisible = true;
        }
    }
    
    window.addEventListener('scroll', handleScroll);
}

// Funcție pentru a poziționa inițial pagina
function setInitialScrollPosition() {
    // Așteaptă ca pagina să se încarce complet
    window.addEventListener('load', () => {
        // Scrollează în jos cu 150px după ce pagina s-a încărcat
        setTimeout(() => {
            window.scrollTo({
                top: 150,
                behavior: 'smooth'
            });
        }, 100);
    });
}
// Funcție pentru a gestiona meniul hamburger
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');
    const closeMenuBtn = document.querySelector('.close-menu');
    
    // Funcție pentru a închide meniul
    function closeMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        header.classList.remove('menu-open');
    }
    
    if (hamburger && navLinks && header) {
        // Event listener pentru hamburger
        hamburger.addEventListener('click', function() {
            // Toggle clasa active pentru animații
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            header.classList.toggle('menu-open');
            
            // Asigură-te că header-ul este vizibil când meniul e deschis
            if (header.classList.contains('menu-open')) {
                header.classList.add('visible');
            }
        });
        
        // Event listener pentru butonul X
        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', function(event) {
                event.stopPropagation(); // Previne propagarea evenimentului
                closeMenu();
            });
        }
        
        // Închide meniul când se face click pe un link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                closeMenu();
            });
        });
        
        // Închide meniul când se face click în afara lui
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navLinks.contains(event.target)) {
                closeMenu();
            }
        });
    }
}

// Funcție pentru a evidenția linkul activ în navigare
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
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

// Efect de fade-in pentru elementele când intră în viewport
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observă toate card-urile și elementele de servicii
    const elementsToObserve = document.querySelectorAll('.info-card, .service-item, .contact-item');
    elementsToObserve.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Funcție pentru a actualiza anul curent în footer
function updateCurrentYear() {
    const footer = document.querySelector('footer p');
    if (footer) {
        const currentYear = new Date().getFullYear();
        footer.innerHTML = footer.innerHTML.replace('2025', currentYear);
    }
}

// Funcție pentru a adăuga efect de hover pe butoane
function addButtonEffects() {
    const buttons = document.querySelectorAll('button, .cta-button');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Funcție pentru a adăuga numărătoare animate pentru statistici
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let count = 0;
        
        const updateCounter = () => {
            if (count < target) {
                count += increment;
                counter.textContent = Math.ceil(count);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Event listeners pentru când pagina se încarcă
document.addEventListener('DOMContentLoaded', function() {
    // Inițializează toate funcțiile
    updateCurrentYear();
    addButtonEffects();
    initHamburgerMenu();
    initHeaderScrollBehavior(); // Noua funcție pentru comportamentul header-ului
    setInitialScrollPosition(); // Poziționare inițială
    observeElements();
    
    // Adaugă event listener pentru scroll
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Adaugă event listeners pentru linkurile de navigare
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    console.log('Site-ul a fost încărcat cu succes!');
});

// Funcție pentru a adăuga efecte de loading
function showLoadingEffect() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        font-size: 1.2rem;
        color: #667eea;
    `;
    loader.textContent = 'Se încarcă...';
    
    document.body.appendChild(loader);
    
    window.addEventListener('load', function() {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }, 500);
    });
}

// Activează efectul de loading
showLoadingEffect();
