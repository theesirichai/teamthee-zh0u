# TEAMTHEE BLOG | UNDERGROUND

An underground/cyberpunk styled blog web application built with **React**, **TypeScript**, **Tailwind CSS**, and **Firebase (Firestore & Auth)**, matching the aesthetic of [TEAMTHEE PORTAL](https://teamthee-webportal.vercel.app/).

---

## ⚡ Features

- **Cyberpunk Aesthetic & Branding**: Dark background `#050505`, fuchsia/purple ambient glows, geometric `Space Grotesk` & `Playfair Display` fonts, and the signature `TEAMTHEE BLOG | UNDERGROUND` badge logo.
- **Real-time Local Clock & System Telemetry**: Live header showing `OPERATIONAL` status and Firebase Cloud Sync status.
- **Search Terminal**: Fast filter search (`QUERY TERMINAL...`) with tags and category filters (`UNDERGROUND`, `DEV`, `TECH`, `AI`, `SECURITY`, `SYSTEM`).
- **Markdown Article Reader**: Full reading modal with syntax highlighting for code blocks, copy-to-clipboard, image rendering, tags, and reading time.
- **Admin Security Terminal & CMS (Command Center)**:
  - Security login modal.
  - Create, edit, and delete articles with live sync to Firebase Firestore.
  - Built-in **Markdown Editor** with formatting toolbar and real-time live preview.
  - Image URL selector with preset cyberpunk backgrounds.
  - Feature in Spotlight & Publish status toggles.

---

## 🔐 Admin Access Credentials

You can log into the Security Terminal using the following master identifier:

- **Identifier**: `thee-b02`
- **Access Key**: `Thee_Thee207812`

*(Alternative fallback identifier `thee-b01` or standard Firebase Auth email & password credentials are also supported)*

---

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run local dev server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

---

## ☁️ Firebase Firestore Setup

The app is already pre-configured to connect with your Firebase project (`teamthee-blog`).

In Firestore Database, the articles are stored under the **`posts`** collection with the following document structure:

```json
{
  "title": "Article Title",
  "excerpt": "Short excerpt for feed cards",
  "content": "# Markdown content...",
  "coverImage": "https://...",
  "category": "UNDERGROUND",
  "tags": ["DEV", "SYSTEM"],
  "featured": true,
  "published": true,
  "readTimeMinutes": 4,
  "createdAt": "serverTimestamp()",
  "author": {
    "name": "TEAMTHEE ARCHITECT",
    "role": "Core Member",
    "avatar": "https://..."
  }
}
```

