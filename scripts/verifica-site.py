"""Verificări automate înainte de publicare. Rulare: python3 scripts/verifica-site.py

Verifică: linkuri și imagini locale, ancore (#), un singur <h1> pe pagină,
header/footer identice, regulile finanțatorilor și lista textelor [de completat].
Iese cu cod 1 dacă găsește erori (textele [de completat] sunt doar raportate).
"""
import glob
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

errors = []
todos = {}

# Paginile publicate (templates/ nu se publică)
pages = sorted(glob.glob("*.html") + glob.glob("proiecte/*.html"))
redirects = [p for p in pages if 'http-equiv="refresh"' in open(p, encoding="utf-8").read()]
content_pages = [p for p in pages if p not in redirects]

ids = {p: set(re.findall(r'\bid="([^"]+)"', open(p, encoding="utf-8").read())) for p in pages}


def resolve(page, ref):
    path, _, frag = ref.partition("#")
    path = path.partition("?")[0]  # ex. main.css?v=... (versiune pentru cache)
    if path.startswith("/"):
        target = path.lstrip("/")
    elif path:
        target = os.path.normpath(os.path.join(os.path.dirname(page), path))
    else:
        target = page
    if target in ("", ".") or target.endswith("/") or os.path.isdir(target):
        target = os.path.join(target, "index.html") if target not in ("", ".") else "index.html"
    return target, frag


# 1. Linkuri, imagini, ancore
for page in pages + glob.glob("assets/css/*.css") + ["site.webmanifest"]:
    text = open(page, encoding="utf-8").read()
    refs = re.findall(r'(?:src|href|poster)="([^"]+)"', text) + re.findall(r'url\(["\']?([^"\')]+)', text)
    for srcset in re.findall(r'srcset="([^"]+)"', text):
        refs += [part.strip().split()[0] for part in srcset.split(",")]
    refs += re.findall(r'"src":\s*"([^"]+)"', text)
    refs += re.findall(r'url=([^"]+)"', text)  # meta refresh
    for ref in refs:
        if re.match(r"(https?:|mailto:|data:|tel:)", ref):
            continue
        target, frag = resolve(page, ref)
        if not os.path.exists(target):
            errors.append(f"{page}: lipsește {ref}")
        elif frag and target.endswith(".html") and frag not in ids.get(target, set()):
            errors.append(f"{page}: ancoră inexistentă {ref}")
    if "docs/" in text or "poze-originale" in text:
        errors.append(f"{page}: referință la docs/ (nepublicat)")

# 2. Structura paginilor
def normalize(block, page):
    block = block.replace(' aria-current="page"', "")
    block = block.replace('href="../', 'href="').replace('src="../', 'src="').replace('href="/', 'href="').replace('src="/', 'src="')
    return block.replace('href=""', 'href="./"')

headers, footers = {}, {}
for page in content_pages:
    text = open(page, encoding="utf-8").read()
    h1 = len(re.findall(r"<h1\b", text))
    if h1 != 1:
        errors.append(f"{page}: {h1} titluri <h1> (trebuie exact 1)")
    for tag in re.findall(r"<img\b[^>]*>", text):
        if 'alt="' not in tag:
            errors.append(f"{page}: imagine fără alt: {tag[:80]}")
        if 'width="' not in tag:
            errors.append(f"{page}: imagine fără width/height: {tag[:80]}")
    if page != "en.html":
        m = re.search(r'<header class="site-header">.*?</header>', text, re.S)
        headers[page] = normalize(m.group(0), page) if m else None
    m = re.search(r'<footer class="site-footer">.*?</footer>', text, re.S)
    footers[page] = normalize(m.group(0), page) if m else None
    found = re.findall(r'<span class="todo">\[([^\]]+)\]</span>', text)
    if found:
        todos[page] = found

for name, blocks in (("header", headers), ("footer", footers)):
    reference = blocks.get("index.html")
    for page, block in blocks.items():
        if block != reference:
            errors.append(f"{page}: {name} diferit de cel din index.html")

# Canonical și og:url trebuie să indice pagina însăși (ex. după copierea șablonului)
SITE = "https://asem.edu-med.ro"
titles = {}
for page in content_pages:
    if page == "404.html":
        continue
    text = open(page, encoding="utf-8").read()
    expected = SITE + ("/" if page == "index.html" else "/" + page)
    for label, pattern in (("canonical", r'<link rel="canonical" href="([^"]+)"'), ("og:url", r'<meta property="og:url" content="([^"]+)"')):
        m = re.search(pattern, text)
        if not m or m.group(1) != expected:
            errors.append(f"{page}: {label} trebuie să fie {expected}")
    title = re.search(r"<title>(.*?)</title>", text).group(1)
    if title in titles:
        errors.append(f"{page}: același <title> ca {titles[title]}")
    titles[title] = page

# Elemente provizorii care nu sunt marcate cu [de completat]
mocks = {}
for page in content_pages:
    text = open(page, encoding="utf-8").read()
    logos = len(re.findall(r"<!-- LOGO DE ADĂUGAT -->([^<]+)", text))
    if logos:
        mocks.setdefault(page, []).append(f"{logos} logo-uri lipsă (casete cu numele)")
    if "CIORNĂ" in text:
        mocks.setdefault(page, []).append("text ciornă, necesită verificare juridică")

# 3. Regulile finanțatorilor
chirurg = open("proiecte/chirurg-pentru-o-zi.html", encoding="utf-8").read()
for word in ["Kaufland", "Lidl", "Start ONG", "Act for Tomorrow", "Uniunea European", "FFCR", "Fundația Comunitară", "sponsori.svg", "Hands Across"]:
    if word in chirurg:
        errors.append(f"proiecte/chirurg-pentru-o-zi.html: apare „{word}” (regula Pepcolandia: doar PEPCO, Pepcolandia, Asociația pastel)")

for page in ["proiecte/educatie-medicala-incluziva.html", "proiecte/edusafe.html"]:
    text = open(page, encoding="utf-8").read()
    if "ue-finantat-de-uniunea-europeana.png" not in text:
        errors.append(f"{page}: lipsește emblema UE")
    if "Nici Uniunea Europeană și nici ANPCDEFP nu pot fi ținute răspunzătoare pentru acestea." not in text:
        errors.append(f"{page}: lipsește textul complet de declinare a responsabilității UE")

# Raport
print(f"{len(pages)} pagini verificate ({len(redirects)} redirecționări).")
if todos:
    print("\nDe completat înainte de publicare:")
    for page, items in todos.items():
        for item in items:
            print(f"  {page}: [{item}]")
if mocks:
    print("\nElemente provizorii:")
    for page, items in mocks.items():
        for item in items:
            print(f"  {page}: {item}")
if errors:
    print("\nERORI:")
    for e in errors:
        print("  " + e)
    sys.exit(1)
print("\nOK: nicio eroare.")
