# Halide Vault

Tableau de bord pour suivre tout son patrimoine au même endroit : crypto, actions, skins CS2, métaux précieux et cartes Pokémon, avec des prix en direct.

**[Ouvrir l'application →](https://halides.netlify.app)**

![Aperçu du tableau de bord](docs/apercu.png)

## Fonctionnalités

- **Portefeuille multi-actifs** : crypto, actions, skins CS2, matières premières (or, argent, platine, palladium) et Pokémon
- **Prix en direct** : CoinGecko pour la crypto, Nasdaq et Yahoo Finance pour les actions et les métaux, Steam Community Market pour les skins CS2
- **Recherche** : n'importe quelle crypto ou action, à ajouter au portefeuille ou à suivre sans en détenir
- **PnL** : gains et pertes latents par actif, variation du jour, total investi contre valeur actuelle
- **Graphiques** sur 30 jours
- **Comptes utilisateurs** : chaque portefeuille est stocké dans Firestore et n'est lisible que par son propriétaire

## Architecture

| Dossier | Rôle |
|---|---|
| `app/api/` | Routes serveur qui interrogent les APIs de prix (`prices`, `cs2prices`, `chart`, `stockchart`, `lookup`) |
| `components/ui/` | Un composant par onglet (`vault-crypto`, `vault-cs2`, `vault-pnl`…) et les fenêtres modales |
| `lib/` | Client Firebase, contexte d'authentification, contexte des prix |
| `firestore.rules` | Accès limité au document `portfolios/{uid}` de l'utilisateur connecté |

Le déploiement sur Netlify ajoute des en-têtes de sécurité (CSP, `X-Frame-Options`, `Referrer-Policy`), voir `netlify.toml`.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS · Firebase (Auth, Firestore) · Framer Motion · lightweight-charts · Netlify

## Lancer en local

Créer un fichier `.env.local` avec la configuration d'un projet Firebase :

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Puis :

```bash
npm ci
npm run dev
# http://localhost:3000
```

## Licence

[MIT](LICENSE)
