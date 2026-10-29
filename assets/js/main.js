// ASEM – scripturi comune pentru tot site-ul
// Fiecare funcție verifică singură dacă elementele ei există pe pagină.

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initProjectFilters();
    initForms();
});

// ---------- Meniu (mobil) ----------

function initNavigation() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('site-nav');
    if (!toggle || !nav) return;

    function setOpen(open) {
        nav.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Închide meniul' : 'Deschide meniul');
    }

    toggle.addEventListener('click', function() {
        setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Închide meniul cu Escape și când se dă click în afara lui
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && nav.classList.contains('is-open')) {
            setOpen(false);
            toggle.focus();
        }
    });

    document.addEventListener('click', function(event) {
        if (!nav.contains(event.target) && !toggle.contains(event.target)) {
            setOpen(false);
        }
    });
}

// ---------- Filtre pe pagina Proiecte ----------

function initProjectFilters() {
    const filters = document.querySelector('[data-filters]');
    const list = document.querySelector('[data-project-list]');
    if (!filters || !list) return;

    const buttons = filters.querySelectorAll('button[data-filter]');
    const items = list.querySelectorAll('[data-tags]');
    const empty = document.querySelector('[data-filters-empty]');

    buttons.forEach(function(button) {
        button.addEventListener('click', function() {
            const filter = button.dataset.filter;
            let visible = 0;

            buttons.forEach(function(b) {
                b.setAttribute('aria-pressed', String(b === button));
            });

            items.forEach(function(item) {
                const tags = item.dataset.tags.split(' ');
                const show = filter === 'toate' || tags.includes(filter);
                item.hidden = !show;
                if (show) visible++;
            });

            if (empty) empty.hidden = visible > 0;
        });
    });
}

// ---------- Formulare ----------

const CONTACT_EMAIL = 'consiliu.director.asem@gmail.com';

// Endpoint Formspree (sau Web3Forms) pentru toate formularele.
// Creați formularul pe formspree.io și puneți aici adresa primită, ex: 'https://formspree.io/f/abcdwxyz'.
// Cât timp rămâne 'REPLACE_ME', formularele deschid aplicația de email a vizitatorului.
const CONTACT_ENDPOINT = 'REPLACE_ME';

function isEndpointConfigured() {
    return CONTACT_ENDPOINT.startsWith('https://');
}

// Etichete lizibile pentru câmpurile din emailul precompletat
const FIELD_LABELS = {
    nume: 'Nume',
    email: 'Email',
    sunt: 'Sunt',
    mesaj: 'Mesaj',
    scoala: 'Școala / grădinița',
    localitate: 'Localitate',
    varsta: 'Vârsta elevilor',
    tema: 'Tema dorită',
    perioada: 'Perioada'
};

// Câmpuri tehnice care nu apar în corpul emailului
const HIDDEN_FIELDS = ['_subject', 'formular', 'acord_confidentialitate', 'mesaj_succes'];

function initForms() {
    document.querySelectorAll('form[data-form]').forEach(function(form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            if (isEndpointConfigured()) {
                submitForm(form);
            } else {
                openMailDraft(form);
            }
        });
    });
}

// Trimite formularul la CONTACT_ENDPOINT. Mesajul de succes apare doar dacă serverul confirmă primirea.
async function submitForm(form) {
    const button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true;

    try {
        const response = await fetch(CONTACT_ENDPOINT, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        showMessage(form.dataset.success || 'Mesajul a fost trimis. Mulțumim!', 'success');
        form.reset();
    } catch (error) {
        showMessage(`Mesajul nu a putut fi trimis. Te rugăm să ne scrii direct la ${CONTACT_EMAIL}.`, 'error');
    } finally {
        if (button) button.disabled = false;
    }
}

// Deschide aplicația de email a vizitatorului cu toate câmpurile formularului precompletate.
function openMailDraft(form) {
    const data = new FormData(form);
    const subject = data.get('_subject') || 'Mesaj de pe site-ul ASEM';
    const lines = [];

    data.forEach(function(value, key) {
        if (HIDDEN_FIELDS.includes(key) || !value) return;
        lines.push(`${FIELD_LABELS[key] || key}: ${value}`);
    });

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    showMessage('Se deschide aplicația de email. Apasă „Trimite” acolo ca să ne ajungă mesajul.', 'success');
}

// Mesaj temporar în colțul ecranului; anunțat și cititoarelor de ecran
function showMessage(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast${type === 'error' ? ' toast--error' : ''}`;
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function() {
        toast.remove();
    }, 6000);
}
