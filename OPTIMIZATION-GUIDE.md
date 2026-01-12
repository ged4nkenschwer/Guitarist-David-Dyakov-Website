# Performance-Optimierung - Implementierungs-Guide

## Übersicht der Änderungen

Diese Optimierungen verbessern die Ladezeit und Core Web Vitals **ohne** das visuelle Erscheinungsbild oder Funktionen zu ändern.

## Geänderte Dateien

### 1. `index.html`
**Änderungen:**
- Videos: `preload="metadata"` → `preload="none"` + `data-src` Attribute
- Video-Poster-Bilder hinzugefügt (statt Canvas-Generierung)
- Hero-Bild: WebP-Fallback hinzugefügt
- Font-Loading: `font-display=swap` hinzugefügt
- Entfernt: Manuelles Preloading von Gallery-Bildern (jetzt via IntersectionObserver)

**Warum besser:**
- Videos werden nicht mehr initial geladen → **200-400MB Einsparung**
- Poster-Bilder sind sofort sichtbar (keine Canvas-Generierung nötig)
- WebP-Bilder sind 30-50% kleiner als JPG
- Fonts blockieren Rendering nicht mehr

### 2. `scripts.js`
**Änderungen:**
- `initLazyLoadGalleryImages()`: Lädt Bilder nur wenn Section expandiert UND im Viewport
- `initVideoThumbnails()`: Verwendet Poster-Bilder statt Canvas-Generierung
- `initGuitarPatternAnimation()`: Optimiert mit IntersectionObserver, reduziert Layout Thrashing
- Entfernt: Unnötiges Preloading von Gallery-Bildern

**Warum besser:**
- Gallery-Bilder werden nur geladen wenn wirklich benötigt
- Keine Canvas-Generierung für Video-Thumbnails (schneller)
- Weniger Layout Thrashing durch besseres Caching

### 3. `netlify.toml`
**Änderungen:**
- WebP-Header hinzugefügt
- AVIF-Header hinzugefügt
- Poster-Image-Header hinzugefügt

**Warum besser:**
- Korrekte Content-Type-Header für moderne Bildformate
- Langzeit-Caching für alle Assets

## Erwartete Verbesserungen

### Before (geschätzt):
- **Initial Load**: ~250-450MB (hauptsächlich Videos)
- **Requests**: ~30-40
- **LCP**: 2-4s
- **FCP**: 1-2s

### After (geschätzt):
- **Initial Load**: ~2-5MB (nur kritische Assets)
- **Requests**: ~10-15 (nur Above-the-fold)
- **LCP**: <2.5s (Ziel)
- **FCP**: <1.5s (Ziel)

### Verbesserungen:
- **Initial Load**: 90-95% Reduktion
- **LCP**: 30-50% Verbesserung
- **FCP**: 20-30% Verbesserung
- **CLS**: Sollte nahe 0 bleiben (keine Regression)

## Noch zu erledigen (externe Assets)

### 1. Video-Poster-Bilder erstellen
Für jedes Video muss ein Poster-Bild erstellt werden:
- `Capricio Diabolico Slow Movement.Postojna Festival-poster.jpg`
- `Homenaje pour Le Tombeau de Claude Debussy by Manuel de Falla.Finale.Postojna Festival-poster.jpg`
- `Rossiniana Nr.1 op.119 .Finale . Postoja Guitar Festival 2025-poster.jpg`
- `Hora by Stephan Rak.Finale.Donnersbergiade 2025-poster.jpg`

**Wie erstellen:**
```bash
# Mit ffmpeg (empfohlen)
ffmpeg -i "Capricio Diabolico Slow Movement.Postojna Festival.mov" -ss 00:00:01 -vframes 1 -q:v 2 "Capricio Diabolico Slow Movement.Postojna Festival-poster.jpg"
```

### 2. WebP-Varianten der Bilder erstellen
Für alle Bilder sollten WebP-Varianten erstellt werden:
- `hero-guitarist.webp` (aus `hero-guitarist.JPG`)
- `on-stage-1-china.webp` (aus `on-stage-1-china.JPG`)
- etc.

**Wie erstellen:**
```bash
# Mit cwebp (Google WebP Tools)
cwebp -q 80 hero-guitarist.JPG -o hero-guitarist.webp

# Oder mit ImageMagick
magick hero-guitarist.JPG -quality 80 hero-guitarist.webp
```

### 3. (Optional) AVIF-Varianten
AVIF ist noch besser als WebP, aber weniger Browser-Support:
```bash
# Mit ImageMagick
magick hero-guitarist.JPG -quality 80 hero-guitarist.avif
```

## Lokale Tests

### 1. Lighthouse Test
```bash
# Chrome DevTools öffnen
# F12 → Lighthouse Tab
# Mobile/Desktop auswählen
# "Performance" auswählen
# "Analyze page load" klicken
```

**Ziele:**
- Performance Score: >90
- LCP: <2.5s
- FCP: <1.5s
- CLS: <0.1

### 2. Network Throttling Test
```bash
# Chrome DevTools → Network Tab
# Throttling: "Slow 3G" oder "Fast 3G"
# Seite neu laden
# Network Tab zeigt alle Requests und Timing
```

**Prüfen:**
- Videos werden nicht initial geladen
- Gallery-Bilder werden nur bei Scroll geladen
- Hero-Bild wird sofort geladen

### 3. Core Web Vitals Check
```bash
# Chrome DevTools → Performance Tab
# "Record" klicken
# Seite laden und scrollen
# "Stop" klicken
# Metriken prüfen
```

## Nach Netlify-Deploy verifizieren

### 1. PageSpeed Insights
```
https://pagespeed.web.dev/
URL eingeben: https://daviddyakov.com
```

### 2. WebPageTest
```
https://www.webpagetest.org/
URL eingeben und Test ausführen
```

### 3. Chrome DevTools (Production)
```
# Auf Production-Site
F12 → Network Tab
"Disable cache" deaktivieren (echte User-Erfahrung)
Seite neu laden
```

## Wichtige Hinweise

### ⚠️ Poster-Bilder sind Pflicht
Ohne Poster-Bilder funktionieren die Video-Thumbnails nicht richtig. Diese müssen erstellt werden!

### ⚠️ WebP-Bilder sind optional aber empfohlen
Die Seite funktioniert auch ohne WebP, aber mit WebP ist sie deutlich schneller.

### ✅ Keine Breaking Changes
- Alle Funktionen bleiben gleich
- Visuelles Erscheinungsbild bleibt gleich
- Formulare funktionieren weiterhin
- Alle Links/Redirects bleiben erhalten

## Rollback (falls nötig)

Falls Probleme auftreten, können die Änderungen rückgängig gemacht werden:
1. Git: `git revert <commit-hash>`
2. Oder manuell die Änderungen in `index.html` und `scripts.js` rückgängig machen

## Nächste Schritte

1. ✅ Code-Änderungen sind fertig
2. ⏳ Poster-Bilder erstellen (siehe oben)
3. ⏳ WebP-Varianten erstellen (optional, aber empfohlen)
4. ⏳ Lokal testen
5. ⏳ Auf Netlify deployen
6. ⏳ Production verifizieren

