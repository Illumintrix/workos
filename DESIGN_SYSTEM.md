# Vela Design System

This document serves as the core reference for building and scaling the Vela Intelligence OS. It defines the visual language, component patterns, and interaction guidelines that ensure a premium, unified experience.

---

## 🏛️ Core Principles

1. **Premium Minimalism**: High-fidelity surfaces with zero visual noise.
2. **Context First**: Design elements should guide the user toward intelligent context and relationships.
3. **Glassmorphism**: Use depth, blurs, and subtle reflections to create a "tactile digital" feel.
4. **Motion with Intent**: Every animation should feel fluid and purpose-driven, not decorative.

---

## 🎨 Color Palette

Vela uses a deep, sophisticated dark theme rooted in black and neutral grays, accented by vibrant, low-opacity glows.

### Base Colors
- **Background**: `#050505` (Deep Black)
- **Surface**: `#111111` (Matte Black)
- **Surface Elevated**: `#1a1a1a`
- **Border**: `rgba(255, 255, 255, 0.05)` (Standard) | `rgba(255, 255, 255, 0.1)` (Hover)

### Semantic Colors
- **Primary (Vela Purple)**: `text-purple-400` | `bg-purple-500/10`
- **Success (Emerald)**: `text-emerald-400` | `bg-emerald-500/10`
- **Warning (Amber)**: `text-amber-400` | `bg-amber-500/10`
- **Danger (Red)**: `text-red-400` | `bg-red-500/10`
- **Information (Blue)**: `text-blue-400` | `bg-blue-500/10`

---

## 🔡 Typography

- **Primary Font**: `Inter` (Sans-serif)
- **Secondary Font**: `Playfair Display` (Serif - Used for landing page headlines)

### Scale
- **Display Header**: `text-3xl font-normal tracking-tight`
- **Page Header**: `text-xl sm:text-2xl font-normal tracking-tight`
- **Section Label**: `text-xs font-medium uppercase tracking-wider text-white/40`
- **Body Text**: `text-sm font-light leading-relaxed text-white/70`
- **Small Label**: `text-[10px] font-medium tracking-wide`

---

## 🧩 Component Patterns

### 1. Glassmorphic Cards
Cards should use a vertical gradient and a subtle inner shadow for depth.
```tsx
// Class Pattern
className="p-5 rounded-2xl bg-gradient-to-b from-[#1e1e1e] to-[#141414] border border-white/[0.05] shadow-lg relative group"
style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06), 0 4px 12px rgba(0,0,0,0.3)' }}
```

### 2. CustomDialog (Modals)
The primary interaction pattern for confirmations and alerts.
- **Backdrop**: `bg-black/60 backdrop-blur-sm`
- **Container**: `bg-[#111] border border-white/[0.05] rounded-[32px] shadow-2xl`
- **Animation**: `fade-in` and `zoom-in-95` duration 200ms.

### 3. Hover Actions
Destructive or tertiary actions should be hidden by default and appear on hover.
```tsx
// Delete Button Pattern
className="absolute top-4 right-4 p-1.5 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
```

### 4. Input Fields
Inputs should feel integrated into the background, not separate from it.
- **Background**: `bg-white/[0.02]` or `bg-transparent`
- **Border**: `border-white/[0.05]` or `border-none`
- **Focus**: `focus:outline-none focus:border-white/20`

---

## ✨ Motion & Interaction

Vela utilizes standard Tailwind-based animations for consistent feel:
- **Fade In**: `animate-in fade-in duration-300`
- **Slide Up**: `animate-in slide-in-from-bottom-4 duration-500`
- **Interactive Scaling**: Elements should subtly scale (`scale-[0.98]`) on click or expand slightly (`hover:-translate-y-1`) on hover.

---

## 🛠️ Implementation Rules

1. **No Hard-coded Colors**: Always use Tailwind opacity variants (e.g., `text-white/40`) or semantic utility classes.
2. **Spacing Consistency**: Stick to multiples of 4 (4, 8, 12, 16, 24, 32, 48, 64).
3. **Z-Index Layering**:
   - Sidebar/Layout: `z-10`
   - Popovers/Menus: `z-60`
   - Modals: `z-[100]`
   - Overlays: `z-50`

---

## 📦 Iconography

Powered by **Lucide React**. 
- **Stroke Width**: Default to `1.5` for a refined, thin look.
- **Coloring**: Use a low-opacity color glow container for primary icons.
```tsx
<div className="w-10 h-10 rounded-xl bg-purple-400/10 flex items-center justify-center border border-purple-400/20">
  <Icon className="w-5 h-5 text-purple-400" strokeWidth={1.5} />
</div>
```
