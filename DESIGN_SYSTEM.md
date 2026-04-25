# 🌌 Vela Intelligence OS: Detailed Design System

This document is the absolute source of truth for the Vela visual language. It captures the high-fidelity, premium "Intelligence Dashboard" aesthetic.

---

## 🏛️ Core Visual Principles

1.  **Tactile Depth**: Surfaces should feel three-dimensional through the use of layered inner and outer shadows.
2.  **Glassmorphism (Subtle)**: Use high-blur backdrops and low-opacity borders to create a "tactile digital" feel.
3.  **Matte Textures**: Use subtle noise and radial dot patterns to give surfaces a physical quality.
4.  **Zero Visual Noise**: Every line, border, and shadow must serve a purpose. Avoid generic Tailwind defaults.

---

## 🎨 Color Palette & Surfaces

### Base Environment
- **Background**: `#050505` (Deep Black)
- **Selection**: `bg-white/10`
- **Noise Texture**: 
  ```css
  radial-gradient(circle at center, #ffffff 1px, transparent 1px)
  background-size: 4px 4px;
  opacity: 0.03;
  ```

### Surface Tokens
- **Standard Card**: `bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f]`
  - *Border*: `1px solid rgba(255, 255, 255, 0.05)`
  - *Inner Shadow*: `inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -2px 6px rgba(0,0,0,0.8)`
  - *Outer Shadow*: `0 24px 48px -12px rgba(0,0,0,0.9)`
- **Elevated Icon Container**: `bg-gradient-to-b from-[#2a2a2a] to-[#111]`
  - *Inner Shadow*: `inset 0 2px 2px rgba(255,255,255,0.12), inset 0 -2px 6px rgba(0,0,0,0.8)`
  - *Outer Shadow*: `0 12px 24px -6px rgba(0,0,0,0.7)`

---

## 🔡 Typography & Text Effects

- **Font Family**: Inter (Standard), Playfair Display (Italic Headlines)
- **Text Shadow**: Use `textShadow: '0 1px 2px rgba(0,0,0,0.8)'` for all text on dark surfaces to ensure maximum clarity and depth.

### Text Scale
- **Display Header**: `text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.1]`
- **Page Header**: `text-xl sm:text-2xl font-normal tracking-tight`
- **Body Context**: `text-sm sm:text-base text-white/60 font-light leading-relaxed`
- **Micro Label**: `text-[10px] font-medium uppercase tracking-[0.2em] text-white/40`

---

## 🧩 Premium Components

### 1. High-Fidelity Buttons
- **Primary Hero Action**: `bg-gradient-to-b from-[#2e2e2e] to-[#141414]`
  - *Shadow*: `inset 0 2px 2px rgba(255,255,255,0.15), inset 0 -2px 8px rgba(0,0,0,0.8), 0 12px 24px -6px rgba(0,0,0,0.9)`
- **Standard Tool Button**: `bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl border border-white/[0.05]`

### 2. Semantic Pills (Badges)
- **Default**: `bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-white/[0.05] text-white/70 text-xs px-2.5 py-1 rounded`
- **Critical (Red)**: `from-[#3a1d1d] to-[#241010] text-[#ff8a8a] border-[#522525]`
- **Success (Green)**: `from-[#1d3a24] to-[#102415] text-[#8affb1] border-[#2b5936]`

### 3. Navigation Dividers
- `border-b border-white/[0.04]` with a subtle bottom shadow: `boxShadow: '0 1px 2px rgba(0,0,0,0.2)'`

### 4. Premium Dropdowns & Popovers
This is the standard for all contextual menus, pickers, and sort menus.
- **Surface**: `bg-[#000000]` or `bg-[#0a0a0a]`
- **Border**: `1px solid rgba(255, 255, 255, 0.1)`
- **Rounding**: `rounded-2xl`
- **Shadow**: `0 20px 40px rgba(0,0,0,0.9)` (Maximum depth)
- **Animation**: `animate-in fade-in slide-in-from-top-2 duration-200`
- **Item Style**: `px-3 py-2 rounded-xl text-sm font-light text-white/60 hover:text-white hover:bg-white/5 transition-all`

---

## ✨ Motion & Transitions

- **Page Entrance**: `animate-in fade-in duration-1000`
- **Component Slide**: `animate-in slide-in-from-bottom-4 duration-1000`
- **Interaction**: Subtle scaling `active:scale-[0.98]` and lifts `hover:-translate-y-0.5`.

---

## 🛠️ Global Utility Classes

- **Scrollbar Hide**: `.hide-scrollbar`
- **Glass Blur**: `backdrop-blur-xl` or `backdrop-blur-2xl`
- **Selection Highlight**: `selection:bg-white/10 text-white`
