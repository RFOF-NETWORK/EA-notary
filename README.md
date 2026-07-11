# EA-notary
```
mein-crypto-wallet-app/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions für automatisiertes Pages-Deployment
├── public/                         # Statische Assets
│   ├── favicon.ico
│   └── manifest.json               # Aktiviert PWA-Features (lokaler Speicher-Zugriff & Offline-Modus)
├── src/
│   ├── assets/
│   │   └── styles.css              # Globales Styling und UI-Design
│   ├── core/                       # Das kryptografische & logische Fundament
│   │   ├── auth.js                 # Login-Validierung, Admin-Erkennung & Rollen-Zuweisung
│   │   ├── crypto.js               # Hashing (PBKDF2/SHA-256) & asymmetrische/symmetrische Verschlüsselung
│   │   ├── hd-wallet.js            # BIP39/BIP32-Logik (Hot/Cold Wallet-Derivierung & Adress-Generierung)
│   │   └── session.js              # Persistenz-Verwaltung (Sitzungstoken im Session- & LocalStorage)
│   ├── vendor/                     # Externe, lokal gespiegelte Bibliotheken
│   │   └── scure-bip39/
│   │       └── english.js          # Lokale Kopie der BIP39 English Wordlist für netzwerkunabhängigen Zugriff
│   ├── views/                      # UI-Komponenten (Reines JS / Web Components)
│   │   ├── admin-panel.js          # Exklusive Admin-Ansicht (wird dynamisch freigeschaltet)
│   │   ├── dashboard.js            # Standard-Dashboard für reguläre Benutzer (Extensioned Users)
│   │   ├── login.js                # Kombiniertes Formular für Registrierung, Login & BIP39-Validierung
│   │   └── wallet-import.js        # Optionale Maske für den Import bestehender BIP39-Wallets
│   ├── app.js                      # Zentraler Client-Router & App-Initialisierung
│   └── config.js                   # Globale Konfiguration (Enthält fest codierte ADMIN_WALLET_ADDRESS & PUBLIC_KEY)
├── index.html                      # Haupteinstiegspunkt für GitHub Pages
├── package.json                    # npm-Konfiguration für optionale Build-Schritte & Bundler
└── README.md                       # Projektdokumentation und Sicherheitsarchitektur-Beschreibung
```
