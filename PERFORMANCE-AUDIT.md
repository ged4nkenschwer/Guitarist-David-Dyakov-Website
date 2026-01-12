# Performance Audit & Optimierungsplan

## 1. AUDIT - Top Assets nach Größe

### Größte Assets (geschätzt):
1. **Video-Dateien (.mov)**: 
   - `Capricio Diabolico Slow Movement.Postojna Festival.mov`
   - `Homenaje pour Le Tombeau de Claude Debussy by Manuel de Falla.Finale.Postojna Festival.mov`
   - `Rossiniana Nr.1 op.119 .Finale . Postoja Guitar Festival 2025.mov`
   - `Hora by Stephan Rak.Finale.Donnersbergiade 2025.mov`
   - **Geschätzte Größe**: 20-100MB pro Video (insgesamt ~200-400MB)
   - **Problem**: Unoptimiert, .mov Format, keine WebM-Variante, werden teilweise sofort geladen

2. **Hero-Bild**:
   - `hero-guitarist.JPG` - **Geschätzt**: 500KB-2MB
   - **Problem**: Nur JPG, keine WebP/AVIF Variante, kein srcset

3. **Gallery-Bilder** (24 Dateien):
   - `on-stage-*.JPG`, `off-stage-*.jpeg`, `teaching-guitar*.jpg`
   - **Geschätzt**: 200KB-1MB pro Bild (insgesamt ~5-20MB)
   - **Problem**: Nur JPG/JPEG, keine WebP/AVIF, werden als background-image geladen (schlechter für lazy loading)

4. **CSS/JS**:
   - `style.css` - **Geschätzt**: 50-150KB (minifiziert)
   - `animations.js` - **Geschätzt**: 20-30KB
   - `scripts.js` - **Geschätzt**: 30-40KB
   - `gallery.js` - **Geschätzt**: 10-20KB
   - **Problem**: Keine Minifizierung sichtbar, möglicherweise ungenutzter Code

### Render-blocking Ressourcen:
1. **CSS**: `style.css` - wird im `<head>` geladen (aber bereits preload vorhanden)
2. **Fonts**: Google Fonts - mehrere Requests, einige blockieren
3. **Inline CSS**: Critical CSS vorhanden, aber könnte optimiert werden

## 2. Top 5 Core Web Vitals Probleme

### LCP (Largest Contentful Paint):
1. **Hero-Bild nicht optimal geladen**: Nur JPG, kein WebP/AVIF, kein srcset
2. **Videos blockieren möglicherweise**: Auch wenn preload="metadata", werden sie teilweise zu früh geladen
3. **Fonts blockieren Rendering**: Mehrere Google Fonts Requests

### INP (Interaction to Next Paint):
1. **Zu viele Event-Listener**: Mehrfache Scroll-Listener, möglicherweise nicht optimal getthrottelt
2. **Layout Thrashing**: DOM-Reads/Writes nicht optimal gebündelt in einigen Fällen
3. **Animationen**: Anime.js könnte bei vielen gleichzeitigen Animationen blockieren

### CLS (Cumulative Layout Shift):
1. **Bilder ohne dimensions**: background-image ohne feste Größen
2. **Fonts**: Font-display könnte optimiert werden
3. **Videos**: Keine Poster-Bilder, Canvas-Thumbnails werden dynamisch generiert

### FCP (First Contentful Paint):
1. **Zu viele initiale Requests**: Alle Gallery-Bilder werden referenziert (auch wenn nicht sichtbar)
2. **CSS-Größe**: style.css könnte weiter optimiert werden

### TBT (Total Blocking Time):
1. **JS-Execution**: Mehrere Scripts, einige könnten weiter optimiert werden
2. **Animation-Library**: Anime.js wird geladen, auch wenn nicht sofort benötigt

## 3. Optimierungsplan (6 Schritte)

### Schritt 1: Video-Optimierung (höchster Hebel)
- Videos auf `preload="none"` setzen
- IntersectionObserver implementieren: Videos nur laden wenn im Viewport
- Poster-Bilder generieren und setzen (statt Canvas-Thumbnails)
- WebM-Varianten erstellen (optional, aber empfohlen)
- **Erwartete Einsparung**: 200-400MB initial nicht geladen

### Schritt 2: Bild-Optimierung
- WebP/AVIF Varianten für alle Bilder erstellen
- Hero-Bild: srcset mit WebP/AVIF
- Gallery-Bilder: Von background-image zu `<img>` mit srcset/sizes umstellen
- `loading="lazy"` und `decoding="async"` für alle Bilder
- **Erwartete Einsparung**: 30-50% kleinere Dateien, besseres Lazy Loading

### Schritt 3: CSS/JS Optimierung
- Ungenutzten CSS-Code entfernen (nur wenn eindeutig)
- JS: Event-Listener optimieren, Layout Thrashing reduzieren
- Font-loading optimieren: font-display: swap
- **Erwartete Einsparung**: 10-20% kleinere Dateien, schnellere Execution

### Schritt 4: Lazy Loading verbessern
- Gallery-Bilder: IntersectionObserver optimieren
- Videos: Nur laden wenn Section expandiert UND im Viewport
- **Erwartete Einsparung**: Deutlich weniger initiale Requests

### Schritt 5: Netlify Caching optimieren
- Headers für WebP/AVIF hinzufügen
- Cache-Strategie für HTML vs Assets optimieren
- **Erwartete Einsparung**: Bessere Repeat-Visit Performance

### Schritt 6: Finale Optimierungen
- Preload-Strategie optimieren (nur wirklich kritische Assets)
- Font-loading weiter optimieren
- **Erwartete Einsparung**: Schnellere LCP

## 4. Before/After Schätzungen

### Initial Page Load (Before):
- **Total Size**: ~250-450MB (hauptsächlich Videos)
- **Requests**: ~30-40
- **LCP**: Geschätzt 2-4s (je nach Connection)
- **FCP**: Geschätzt 1-2s

### Initial Page Load (After):
- **Total Size**: ~2-5MB (nur kritische Assets)
- **Requests**: ~10-15 (nur Above-the-fold)
- **LCP**: Ziel <2.5s
- **FCP**: Ziel <1.5s

### Erwartete Verbesserungen:
- **Initial Load**: 90-95% Reduktion
- **LCP**: 30-50% Verbesserung
- **FCP**: 20-30% Verbesserung
- **CLS**: Sollte nahe 0 bleiben (keine Regression)

