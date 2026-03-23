# Vendly: Frontend Design & Branding Plan

This document outlines the visual identity and design system for Vendly, focusing on a premium, minimalist, and developer-centric aesthetic.

## 1. Brand Identity

### Brand Language & Keywords
- **The "Digital Employee":** Our primary value proposition. We don't just provide a bot; we provide a trained employee.
- **"Vendly AI":** The internal name/persona of the AI assistant that vendors deploy.
- **"Commerce-as-a-Service":** Redefining how small and large vendors sell on social platforms.
- **Keywords:** *Precision, Autonomy, Scaling, Resilience, Minimalist.*

### Voice & Tone
- **Professional & Clean:** The dashboard uses a sophisticated, data-driven tone.
- **Iconography over Emojis:** **Strictly no emojis** are to be used in the frontend dashboard. Use **Lucide Icons** exclusively for visual cues.
- **Action-Oriented:** "Deploy your employee," "Verify payment," "Scale inventory."

## 2. Color System

### Primary Palette
- **Primary Green:** `#006C38` (Deep Forest Green) - Used for brand-heavy elements and primary buttons in Light Mode.
- **Action Green:** `#03914c` (Vibrant Leaf Green) - Used for success states, highlights, and interactive accents.

### Mode Adjustments
| Element | Light Mode | Dark Mode |
| :--- | :--- | :--- |
| **Background** | `#FFFFFF` | `#0A0A0A` (Near Black) |
| **Foreground** | `#1A1A1A` | `#EDEDED` |
| **Primary Button** | `#006C38` | `#03914c` (Brighter for visibility) |
| **Surface/Card** | `#F9F9F9` | `#141414` (Deep Grey) |
| **Border** | `#E5E5E5` | `#262626` |

## 3. Design Principles (21st-Century Dev Inspired)

### Geometry & Spacing
- **Minimalist Sharpness:** Avoid large border-radii. Use `4px` or `0px` (sharp) for a professional, "Linear-style" look.
- **Subtle Gradients:** Use very subtle mesh gradients for background depth in dark mode.
- **Shadows:** Avoid heavy dropshadows. Use thin, high-contrast borders (`1px`) to define depth instead.

### Typography
- **Primary Font:** Nunito (Google Font).
- **Weights:** Use Medium (500) and Semi-bold (600) for hierarchy.
- **Scaling:** Focus on readability with generous line heights (`1.6`).

### Key Components
- **Command Palette (`Cmd + K`):** A central feature for vendors to quickly search inventory or orders.
- **Bento Grid Layouts:** For the dashboard overview (Stats, Bot Status, Recent Sales).
- **Lucide Iconography:** Use a consistent stroke width of `1.5px` for all Lucide icons.
- **Glassmorphism:** Subtle use of backdrop-blur on navigation sidebars in Dark Mode.

## 4. Brand Symbols
- **Logo:** Minimalist "V" with a digital pulse or a stylized "slash" representing the "Employee as a Service" interface.
- **Icons:** Use Lucide or Radix Icons (Thin stroke width: `1.5px`).

---

## Implementation Strategy
1. **Design Tokens:** Define CSS variables in `globals.css` using the tokens above.
2. **Next-themes:** Implement `next-themes` for seamless light/dark mode switching.
3. **Component Library:** Build custom primitives using Tailwind CSS to ensure adherence to the "No big shadows/corners" rule.
