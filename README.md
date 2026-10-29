# ASEM – site oficial

Site-ul Asociației pentru Susținerea Educației Medicale: **https://asem.edu-med.ro**

Site static (HTML, CSS, JavaScript), fără framework și fără pas de build: fișierele HTML din repo sunt chiar paginile publicate și se editează direct. Site-ul e publicat automat pe GitHub Pages la fiecare push pe `main`.

## Structura proiectului

```
.
├── index.html               # Acasă
├── despre.html              # Despre ASEM, echipa, transparență
├── proiecte.html            # Lista proiectelor, cu filtre
├── parteneri.html           # Pentru companii și finanțatori
├── implica-te.html          # Voluntari, ateliere pentru școli, donații
├── biblioteca.html          # Biblioteca Digitală (resurse gratuite)
├── confidentialitate.html   # Politica de confidențialitate
├── en.html                  # About ASEM (engleză)
├── 404.html                 # Pagina pentru linkuri inexistente
├── proiect1.html … proiect5.html   # Adrese vechi: redirecționează spre proiecte/
│
├── proiecte/                # O pagină pentru fiecare proiect
│   ├── gomed.html
│   ├── educatie-medicala-incluziva.html
│   └── …
│
├── assets/
│   ├── css/main.css         # Toate stilurile (variabile de culoare în :root)
│   ├── js/main.js           # Meniu, filtre, formulare
│   ├── fonts/               # Inter (găzduit local)
│   └── img/
│       ├── brand/           # Logo-uri, favicon
│       ├── hero/            # Imaginea mare de pe Acasă
│       ├── acasa/, implica-te/   # Poze pentru paginile respective (fără ramele finanțatorilor)
│       ├── proiecte/<proiect>/   # Coperta și galeria fiecărui proiect
│       ├── biblioteca/      # Copertele resurselor
│       ├── echipa/          # Consiliul Director
│       ├── parteneri/       # Emblema UE și logo-urile finanțatorilor
│       ├── sponsori/        # Banda de logo-uri Start ONG
│       └── og/              # Imagini 1200×630 pentru previzualizări pe rețele sociale
│
├── templates/proiect-template.html   # Șablon pentru un proiect nou (nu se publică)
├── scripts/verifica-site.py          # Verificări automate (rulate și la deploy)
├── favicon.ico, robots.txt, sitemap.xml, site.webmanifest
└── .github/workflows/deploy.yml
```

Folderul `docs/` (plan de lucru, audit, texte-sursă, poze originale) există doar local și este exclus din git, pentru că repo-ul e public.

## Rulare locală

```bash
python3 -m http.server 8000
```

Apoi deschide http://localhost:8000. În VS Code există și task-ul „Deschide site-ul în browser”.

## Verificare înainte de publicare

```bash
python3 scripts/verifica-site.py
```

Scriptul verifică:
- linkurile și imaginile locale și ancorele;
- un singur `<h1>` pe pagină și `alt`/`width`/`height` pe imagini;
- că header-ul și footer-ul sunt identice pe toate paginile;
- regulile finanțatorilor (vezi mai jos).

Afișează și lista textelor `[de completat]`. Același script rulează la deploy: dacă găsește o eroare, site-ul nu se publică.

## Cum adaugi un proiect nou

1. Copiază `templates/proiect-template.html` în `proiecte/<slug>.html` (slug = nume scurt, fără diacritice, cu cratimă).
2. Înlocuiește textele păstrând structura: antet, indicatori, text, galerie, citate, „Parteneri și finanțare”.
3. Poze: în `assets/img/proiecte/<slug>/` (`coperta.webp`, apoi `01-descriere.webp` + `.jpg`), maxim 1600 px lățime. Imaginea pentru rețele sociale: `assets/img/og/<slug>.jpg`, 1200×630.
   ```bash
   cwebp -q 80 -resize 1600 0 poza.jpg -o assets/img/proiecte/<slug>/01-descriere.webp
   ```
4. Adaugă cardul în `proiecte.html` (cel mai nou primul) și URL-ul în `sitemap.xml`.
5. Actualizează linkurile „Proiectul anterior / următor” din paginile vecine.
6. Rulează `python3 scripts/verifica-site.py`.

Header-ul și footer-ul sunt copiate în fiecare pagină. Dacă le schimbi, schimbă-le peste tot (verificarea îți arată dacă ai uitat una).

## Formulare

Formularele (contact, newsletter, solicitare atelier) trimit prin Formspree sau Web3Forms. Endpointul se pune o singură dată, în constanta `CONTACT_ENDPOINT` din `assets/js/main.js`. Cât timp nu e completat, formularele deschid aplicația de email a vizitatorului, cu mesajul precompletat.

## Reguli de conținut

- **Chirurg pentru o zi:** apar doar PEPCO, Pepcolandia și Asociația pastel (regula Pepcolandia).
- **Proiectele finanțate de UE** (Educație Medicală Incluzivă, EduSAFE): emblema „Finanțat de Uniunea Europeană” nemodificată și textul complet de declinare a responsabilității.
- Cifrele provizorii sau „țintă” rămân marcate așa.
- Pozele care au imprimat logo-ul unui finanțator pot apărea ca imagine a proiectului respectiv (pagina și cardul lui). Pentru pozele de secțiune de pe alte pagini (Acasă, Implică-te) se decupează rama.
- Nu se publică poze cu minori fără acordul scris al părinților și nici imagini cu copiii pacienți (MedArt).
- Pozele originale nu se pun în git. Aici intră doar versiunile optimizate (WebP, sub ~300 KB).
- Lucrează pe un branch separat și fă Pull Request în `main`: orice push pe `main` ajunge imediat live.
