# White Screen Diagnose-Checkliste

## ⚡ SOFORT-CHECKS (2 Minuten)

### 1. Browser DevTools öffnen (F12)
**Console Tab:**
- [ ] Rote Fehler sichtbar? → Screenshot machen
- [ ] Typische Fehler: `Uncaught SyntaxError`, `Failed to load resource`, `404`
- [ ] **Screenshot 1: Console Error** (wenn vorhanden)

**Network Tab:**
- [ ] Hard Reload (Ctrl+Shift+R / Cmd+Shift+R)
- [ ] Filter: "All" oder "Doc"
- [ ] Status-Codes prüfen:
  - [ ] `index.html` → Status 200? (grün) oder 404/500? (rot)
  - [ ] `style.css` → Status 200? oder 404?
  - [ ] `scripts.js` → Status 200? oder 404?
- [ ] **Screenshot 2: Network Tab** (fehlende/rote Requests markieren)

### 2. Datei-Größen prüfen (PowerShell/Terminal)
```powershell
# Im Projektverzeichnis ausführen:
(Get-Item index.html).Length
(Get-Item style.css).Length
(Get-Item scripts.js).Length
```
- [ ] `index.html` > 0 Bytes? (sollte ~100-200 KB sein)
- [ ] `style.css` > 0 Bytes? (sollte ~100-300 KB sein)
- [ ] Wenn 0 Bytes → Datei wurde gelöscht/überschrieben!

### 3. Git Status prüfen
```powershell
git status
git diff index.html
```
- [ ] Wurde `index.html` versehentlich gelöscht/geändert?
- [ ] Wenn ja: `git restore index.html` oder `git checkout HEAD -- index.html`

---

## 🔍 DETAILLIERTE DIAGNOSE (3 Minuten)

### 4. CSS/JS Syntax-Fehler prüfen
**CSS:**
```powershell
# Prüfe auf ungeschlossene Klammern:
Select-String -Path style.css -Pattern '\{[^}]*$' -Context 0,2
Select-String -Path style.css -Pattern '\([^)]*$' -Context 0,2
```

**JavaScript:**
- [ ] Browser Console: Gibt es JS-Fehler?
- [ ] Prüfe `scripts.js`, `animations.js` auf Syntaxfehler

### 5. Asset-Pfade prüfen
**In `index.html` suchen:**
- [ ] `<link rel="stylesheet" href="style.css">` → Pfad korrekt?
- [ ] `<script src="scripts.js">` → Pfad korrekt?
- [ ] Bilder: `./hero-guitarist.JPG` → Datei existiert?

### 6. CSS Overlay/Display-Probleme
**In Browser DevTools:**
- [ ] Elements Tab → `<body>` auswählen
- [ ] Computed Styles prüfen:
  - [ ] `display: none`? → Problem!
  - [ ] `visibility: hidden`? → Problem!
  - [ ] `opacity: 0`? → Problem!
  - [ ] `background-color: white` mit `color: white`? → Problem!

**In `style.css` suchen:**
```powershell
Select-String -Path style.css -Pattern 'body.*\{[^}]*display.*none' -CaseSensitive
Select-String -Path style.css -Pattern 'html.*\{[^}]*display.*none' -CaseSensitive
```

### 7. Z-Index Overlay-Problem
**In Browser DevTools:**
- [ ] Elements Tab → Prüfe ob ein Element mit `z-index: 9999` alles überdeckt
- [ ] Suche nach: `.loading`, `#page-loader`, `.overlay`

---

## 🛠️ SOFORT-FIXES je nach Befund

### Fix 1: Leere index.html (0 Bytes)
```powershell
# Wiederherstellen aus letztem funktionierenden Commit:
git log --oneline -10
git show <commit-hash>:index.html > index.html

# Oder aus HEAD (falls dort vorhanden):
git checkout HEAD -- index.html
```

### Fix 2: CSS nicht geladen (404)
- [ ] Pfad in `index.html` prüfen: `href="style.css"` vs `href="./style.css"`
- [ ] Datei existiert? `Test-Path style.css`
- [ ] Browser Cache leeren: Hard Reload (Ctrl+Shift+R)

### Fix 3: JavaScript-Fehler
- [ ] Console Error lesen → Zeile/Datei identifizieren
- [ ] Minimaler Fix: Fehlerhafte Zeile auskommentieren oder Guard hinzufügen
- [ ] Beispiel: `if (element) { ... }` statt `element.addEventListener(...)`

### Fix 4: CSS Syntax-Fehler
```powershell
# Ungeschlossene Klammern finden:
# Manuell in style.css nach { ohne } suchen
# Oder CSS Validator nutzen
```

### Fix 5: Overlay überdeckt alles
**In `style.css` suchen und anpassen:**
```css
/* Problem: */
#page-loader { display: block; z-index: 9999; }

/* Fix: */
#page-loader { display: none; } /* Oder: opacity: 0; pointer-events: none; */
```

---

## 📸 SCREENSHOTS für weitere Hilfe

Wenn die Seite immer noch weiß ist, sende diese 3 Screenshots:

1. **Browser Console** (F12 → Console Tab)
   - Zeige alle roten Fehler
   - Scroll bis zum ersten Fehler

2. **Network Tab** (F12 → Network Tab → Hard Reload)
   - Filter: "Doc" oder "All"
   - Zeige Status-Codes (200 = grün, 404/500 = rot)
   - Markiere fehlende/fehlerhafte Requests

3. **Elements Tab** (F12 → Elements → `<body>` auswählen)
   - Zeige Computed Styles
   - Prüfe `display`, `visibility`, `opacity`, `background-color`

---

## ✅ PRIORITÄTEN

1. **Erst:** Inhalte wieder sichtbar bekommen
   - Dateien wiederherstellen
   - Syntax-Fehler beheben
   - Asset-Pfade korrigieren

2. **Dann:** Sauber refactoren
   - Code optimieren
   - Best Practices anwenden

---

## 🎯 TYPISCHE ROOT-CAUSES nach Hero/Asset-Änderungen

1. **Leere index.html** (0 Bytes) ← **DEIN FALL**
   - Ursache: Versehentliches Löschen/Überschreiben
   - Fix: `git restore index.html` oder aus Commit wiederherstellen

2. **CSS Syntax-Fehler** (ungeschlossene `{` oder `}`)
   - Ursache: Beim Bearbeiten Klammer vergessen
   - Fix: CSS validieren, fehlende Klammer hinzufügen

3. **Asset-Pfade falsch** (404 Errors)
   - Ursache: Relative Pfade nach Verschieben geändert
   - Fix: Pfade in `index.html` korrigieren

4. **JavaScript crasht** (Uncaught Error)
   - Ursache: Element nicht gefunden, null reference
   - Fix: Guards hinzufügen: `if (element) { ... }`

5. **Overlay überdeckt** (z-index zu hoch)
   - Ursache: Loader/Overlay bleibt sichtbar
   - Fix: `display: none` oder `opacity: 0` setzen

---

## 📝 NOTIZEN

**Dein aktuelles Problem:**
- ✅ **GELÖST:** `index.html` war 0 Bytes (leer)
- ✅ **FIX:** Wiederhergestellt aus Commit `25e522e`
- ✅ **Status:** Datei wiederhergestellt (127.780 Bytes)

**Nächste Schritte:**
1. Browser Hard Reload (Ctrl+Shift+R)
2. Seite sollte jetzt funktionieren
3. Falls nicht: Screenshots aus Checkliste senden
