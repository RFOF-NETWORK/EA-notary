# EA-notary
```
EA-notary/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions für automatisiertes Pages-Deployment
├── public/                         # Statische Assets
│   ├── favicon.ico
│   └── manifest.json               # Ermöglicht Installation als PWA (Lokaler Speicher)
├── src/
│   ├── assets/
│   │   └── styles.css              # Globales Styling
│   ├── core/                       # Das Herzstück: Kryptografie & Logik
│   │   ├── crypto.js               # Hashing (SHA-256/Argon2), AES-GCM Ver-/Entschlüsselung
│   │   ├── hd-wallet.js            # BIP39/BIP32 Logik (Hot/Cold Derivierung)
│   │   └── session.js              # Persistenz-Verwaltung (SessionStorage / LocalStorage)
│   ├── vendor/                     # Externe Abhängigkeiten (BIP39 Wordlists)
│   │   └── scure-bip39/
│   │       └── english.js          # Lokale Kopie der BIP39 English Wordlist
│   ├── views/                      # UI-Komponenten (Reines JS oder Web Components)
│   │   ├── login.js                # Login- & Registrierungsmaske
│   │   ├── dashboard.js            # Zeigt Benutzername & Hot-Wallet an
│   │   └── wallet-import.js        # Optionale Maske für existierende BIP39 Phrasen
│   ├── app.js                      # Router & App-Initialisierung
│   └── config.js                   # Globale Konfiguration (z.B. System-Wallet Public Key)
├── index.html                      # Haupteinstiegspunkt für GitHub Pages
├── package.json                    # Definition der npm-Pakete (falls Build-Step genutzt wird)
└── README.md                       # Projektdokumentation
```
