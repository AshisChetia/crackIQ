---
colors:
  surface: '#141218'
  surface-dim: '#141218'
  surface-bright: '#3b383e'
  surface-container-lowest: '#0f0d13'
  surface-container-low: '#1d1b20'
  surface-container: '#211f24'
  surface-container-high: '#2b292f'
  surface-container-highest: '#36343a'
  on-surface: '#e6e0e9'
  on-surface-variant: '#cbc4d2'
  inverse-surface: '#e6e0e9'
  inverse-on-surface: '#322f35'
  outline: '#948e9c'
  outline-variant: '#494551'
  surface-tint: '#cfbcff'
  primary: '#cfbcff'
  on-primary: '#381e72'
  primary-container: '#6750a4'
  on-primary-container: '#e0d2ff'
  inverse-primary: '#6750a4'
  secondary: '#cdc0e9'
  on-secondary: '#342b4b'
  secondary-container: '#4d4465'
  on-secondary-container: '#bfb2da'
  tertiary: '#e7c365'
  on-tertiary: '#3e2e00'
  tertiary-container: '#c9a74d'
  on-tertiary-container: '#503d00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#cfbcff'
  on-primary-fixed: '#22005d'
  on-primary-fixed-variant: '#4f378a'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#cdc0e9'
  on-secondary-fixed: '#1f1635'
  on-secondary-fixed-variant: '#4b4263'
  tertiary-fixed: '#ffdf93'
  tertiary-fixed-dim: '#e7c365'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#141218'
  on-background: '#e6e0e9'
  surface-variant: '#36343a'
typography:
  display-xl:
    fontFamily: Metropolis
    fontSize: 80px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg:
    fontFamily: Metropolis
    fontSize: 56px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Metropolis
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Metropolis
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  xs: 0.5rem
  sm: 1rem
  md: 2rem
  lg: 4rem
  xl: 8rem
---

## Brand & Style
This design system is built for a high-stakes educational environment where speed and intelligence are paramount. The aesthetic follows an "Awwwards-winning" minimalist movement, characterized by an ultra-dark canvas and surgical precision in layout. 

The brand personality is **Empowering**, moving away from "friendly" student tropes toward a "high-performance" tool aesthetic. The visual style utilizes **glassmorphism** not as a decorative flourish, but as a functional method to create depth within a monochromatic palette. Motion is intentional and swift, mirroring the efficiency of the AI.

## Colors
The palette is strictly monochromatic to maintain a premium, high-contrast feel. The primary background is a "Deep Night" black, providing the ultimate canvas for "Off-White" content.

- **Surface Tiers:** Use subtle variations of the background hex for containers, or utilize the defined glass fill for interactive elements.
- **Accents:** Color is used sparingly, primarily through pure white elements or high-precision strokes.
- **Gradients:** Use linear gradients from `#040406` to a slightly lifted `#121214` to suggest depth on large surfaces.

## Typography
The typographic system creates a hierarchy through scale and weight. **Metropolis** is used for headings to provide a structured, architectural feel. **Geist** is used for body copy and technical data, offering a developer-centric precision that reinforces the AI-driven nature of the product.

- **Display text:** Should be reserved for high-impact landing areas or score summaries.
- **Label-caps:** Used for micro-copy, status tags, and metadata to maintain a clean, organized look.

## Layout & Spacing
The layout philosophy centers on **Generous Whitespace**. Sections are given significant vertical breathing room to allow the user to focus on one cognitive task at a time.

- **Grid:** A standard 12-column grid for desktop with 32px gutters. 
- **Margins:** 24px on mobile, scaling to 80px+ on desktop.
- **Rhythm:** Spacing between sections should ideally be `spacing-xl` (8rem) to maintain the minimalist "editorial" feel typical of award-winning sites.

## Elevation & Depth
In this design system, depth is achieved through **Backdrop Blurs** and **Tonal Layering** rather than traditional drop shadows.

- **The Glass Layer:** Interactive cards use a 12px backdrop blur with a 1px solid stroke (`glass_stroke`) to differentiate from the background.
- **Stacking:** Elements closer to the user are lighter in tone. A level-1 container is slightly more opaque than a level-2 container.
- **Shadows:** If used, they must be "Ambient" — extremely diffused, with 0% offset and low opacity (e.g., `blur: 40px, opacity: 0.4`).

## Shapes
The shape language is **Soft (0.25rem - 0.75rem)**. This avoids the playfulness of fully rounded "pill" shapes while softening the harshness of the high-contrast palette. 

- **Interactive Elements:** Use the base `0.25rem` for buttons and inputs.
- **Cards:** Use `0.75rem` for larger containers to create a distinct frame for content.

## Components
- **Buttons:** Primary buttons are solid `Off-White` with `Deep Black` text. Hover states involve a subtle inverse or a glow effect. Secondary buttons are "Ghost" style with thin 1px borders.
- **Interactive Cards:** Utilize the glassmorphic style. On hover, the `glass_stroke` opacity should increase from 0.1 to 0.3.
- **Inputs:** Minimalist underlines or subtle glass-filled boxes. Focus states are indicated by a 1px solid white border.
- **Progress Indicators:** High-precision thin lines. Use a monochromatic gradient (White to Grey) to show completion.
- **AI Feedback Chips:** Small, `label-caps` typography, housed in a glass container with a subtle "pulse" animation to indicate real-time computation.