**Live app:** [fitclue.app](https://fitclue.app) · **Author:** [@marditds](https://github.com/marditds)

<p align="center">
  <a href="https://fitclue.app" target="_blank"> 
    <img width="100%" alt="FitClue Logo" src="https://github.com/user-attachments/assets/81128de5-8ebd-41f0-a137-cfdf8c2b55bd" /> 
  </a>
</p>

## Overview
FitClue is a community-powered platform for identifying clothing and outfits seen in Instagram posts. Users submit a link to a post, and the community helps identify the brands, items, and where to buy them or suggests similar alternatives.

## Features

- **Link-based outfit discovery** — submit an Instagram post link to start a search thread for identifying what's being worn
- **Contributor ranking** — a reputation/ranking system rewards users who help identify outfits
- **Search** — browse and search existing identified outfits and posts
- **Full account system** — sign up, sign in, password reset, and account deletion, backed by Appwrite
- **Installable PWA** — installable on mobile/desktop with offline-friendly asset caching (vite-plugin-pwa)
- **Bot & abuse protection** — reCAPTCHA on key actions, plus a hardened link-submission pipeline (see below)

## Tech Stack

- **Frontend:** React 19, React Router, React Bootstrap, TanStack Query
- **Backend:** Appwrite (auth, database, storage), Appwrite serverless Functions (Node.js)
- **Infra:** Vite, PWA support, reCAPTCHA

## Link Submission Safety Pipeline

One of the more involved pieces of the backend is the `scanlink` function, which validates every submitted link before it's accepted:

- Domain and TLD blocklists, plus pattern-based checks for unsafe/explicit content, including detection of leet-speak and obfuscated variants
- DNS resolution with SSRF protection which rejects links that resolve to private/internal IP ranges
- Timeout-wrapped lookups to prevent function hangs on unresponsive hosts

This keeps the platform's core loop resistant to abuse without relying on manual moderation for every submission.

## Serverless Functions

| Function | Purpose |
|---|---|
| `scanlink` | Validates and safety-checks submitted links before they're accepted |
| `recaptcha` | Server-side reCAPTCHA verification |
| `userdelete` | Handles full account deletion |

## Getting Started

```bash
npm install
npm run dev
```

Requires an Appwrite project with the appropriate database/tables configured, plus environment variables for Appwrite, and reCAPTCHA credentials.
