# Frontend Architecture

## Blog URL → Translation → Audio App (React Native Expo)

---

## 1. Frontend Overview

The frontend is a **React Native application built with Expo**.

Its responsibilities are strictly limited to:

- User interaction (UI)
- Sending requests to backend APIs
- Rendering translated text
- Playing generated audio
- Local caching for better UX

⚠️ No scraping, translation, or TTS logic exists in the frontend.

---

## 2. Core User Flow

1. User opens the app
2. User pastes a blog/article URL
3. User selects a target language
4. User taps "Convert"
5. App sends request to backend
6. App receives:
   - Translated text
   - Audio file URL
7. User reads text or listens to audio

---

## 3. App Screens

### 3.1 HomeScreen

**Purpose:** Input & configuration

Features:

- Text input for blog URL
- Language selection dropdown
- Submit / Convert button
- Loading state

Data sent to backend:

```json
{
  "url": "https://example.com/blog",
  "language": "hi"
}
```
