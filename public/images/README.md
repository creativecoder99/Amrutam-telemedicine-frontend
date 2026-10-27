# Amrutam Telemedicine Image Assets Directory

This folder is configured for all static image assets in the Amrutam Telemedicine application. In Next.js, files placed inside the `public/` folder are automatically served from the root path `/`.

---

## 📁 Directory Structure

```
frontend/
└── public/
    └── images/
        ├── logo/
        │   ├── logo.png           <-- Put your main Amrutam brand logo here
        │   ├── logo.svg           <-- Vector SVG logo alternative
        │   └── favicon.ico        <-- Browser tab icon
        │
        └── hero/
            ├── hero-banner.png    <-- Main hero background or illustration
            ├── ayurveda-doctor.png<-- Doctor consultation graphic / photo
            └── herbs-wellness.jpg <-- Ayurvedic herbs / lifestyle imagery
```

---

## 🚀 How to Add and Use Your Images

### 1. Logo Image
- Place your logo file in:
  `frontend/public/images/logo/logo.png` (or `.svg`)
- In any React component (e.g., `Header.tsx` or `Footer.tsx`), reference it as:
  ```tsx
  <img 
    src="/images/logo/logo.png" 
    alt="Amrutam Telemedicine Logo" 
    style={{ height: '40px', width: 'auto' }} 
  />
  ```

### 2. Hero Section Images
- Place your hero section images in:
  `frontend/public/images/hero/hero-banner.png`
  `frontend/public/images/hero/ayurveda-doctor.png`
- In `frontend/src/app/page.tsx`, reference them as:
  ```tsx
  <img 
    src="/images/hero/hero-banner.png" 
    alt="Ayurvedic Telehealth Consultation" 
    style={{ maxWidth: '100%', borderRadius: '16px' }} 
  />
  ```

---

## 💡 Supported Image Formats
- `.png` (Recommended for transparent logos and graphics)
- `.svg` (Best for sharp vector icons and marks)
- `.jpg` / `.jpeg` (Great for clinical photos)
- `.webp` (High efficiency modern web format)
