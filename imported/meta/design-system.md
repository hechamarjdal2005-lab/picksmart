---
name: PickSmart
colors:
  surface: '#1d100a'
  surface-dim: '#1d100a'
  surface-bright: '#46362e'
  surface-container-lowest: '#170b06'
  surface-container-low: '#261812'
  surface-container: '#2b1c16'
  surface-container-high: '#362720'
  surface-container-highest: '#41312a'
  on-surface: '#f8ddd2'
  on-surface-variant: '#e2bfb0'
  inverse-surface: '#f8ddd2'
  inverse-on-surface: '#3d2d26'
  outline: '#a98a7d'
  outline-variant: '#5a4136'
  surface-tint: '#ffb693'
  primary: '#ffb693'
  on-primary: '#561f00'
  primary-container: '#ff6b00'
  on-primary-container: '#572000'
  inverse-primary: '#a04100'
  secondary: '#a9c7ff'
  on-secondary: '#003063'
  secondary-container: '#3a90ff'
  on-secondary-container: '#002957'
  tertiary: '#9ccaff'
  on-tertiary: '#003257'
  tertiary-container: '#059eff'
  on-tertiary-container: '#003357'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbcc'
  primary-fixed-dim: '#ffb693'
  on-primary-fixed: '#351000'
  on-primary-fixed-variant: '#7a3000'
  secondary-fixed: '#d6e3ff'
  secondary-fixed-dim: '#a9c7ff'
  on-secondary-fixed: '#001b3d'
  on-secondary-fixed-variant: '#00468b'
  tertiary-fixed: '#d0e4ff'
  tertiary-fixed-dim: '#9ccaff'
  on-tertiary-fixed: '#001d35'
  on-tertiary-fixed-variant: '#00497b'
  background: '#1d100a'
  on-background: '#f8ddd2'
  surface-variant: '#41312a'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.7'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.7'
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style
The design system is crafted for a premium, high-authority affiliate review platform. It prioritizes clarity, trust, and a "high-tech" consumer electronics aesthetic. The style is **Modern Corporate with subtle Glassmorphism**, utilizing a deep, near-black foundation to allow product photography and orange accents to pop with high intentionality. 

The emotional response should be one of "Expertise" and "Precision." By using dark surfaces and crisp borders, the interface recedes to let the reviews and product data take center stage. Interaction patterns are designed to feel tactile and responsive, reinforcing the premium nature of the editorial content.

## Colors
The palette is built on a "Deep Space" grayscale to minimize eye strain and maximize the impact of functional colors. 

- **Primary (Orange):** Reserved for the highest priority actions (CTAs), price points, and active states. It signals "Purchase" and "Energy."
- **Secondary (Blue):** Used for informational links, verified trust badges, and secondary interactive elements. It signals "Trust" and "Reliability."
- **Neutral Scales:** The background tiers (#0A0A0F to #1A1A26) create a clear sense of depth and container nesting without relying on heavy drop shadows.

## Typography
This design system uses **Inter** exclusively to maintain a systematic, utilitarian feel. 

- **Headings:** Must use bold weights (600-700) with tight letter-spacing to create a "locked-in" professional look.
- **Body Text:** Set to a generous 1.7 line-height. This ensures long-form reviews remain readable and accessible against the dark background, preventing "halation" (where light text appears to bleed into dark backgrounds).
- **Labels:** Small caps or increased letter spacing should be used for metadata to distinguish it from editorial content.

## Layout & Spacing
The system utilizes a **12-column fluid grid** for desktop, transitioning to a **4-column grid** for mobile. 

- **Margins:** Desktop margins are set to a minimum of 48px, while mobile uses 20px.
- **Rhythm:** A strict 8px spacing scale is used for vertical rhythm. 
- **Containers:** Content is housed in "Surface" containers that use 24px padding (md) on desktop to provide breathing room around product images and text.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Subtle Outlines** rather than heavy shadows.

- **Level 0 (Base):** #0A0A0F - The main canvas.
- **Level 1 (Cards/Nav):** #12121A - Raised surfaces with a 1px #2A2A3A border.
- **Level 2 (Inputs/Hovers):** #1A1A26 - The highest interactive surface.
- **Special Elevation:** Product cards on hover employ a "Subtle Glow" effect—a 0px 0px 15px rgba(255, 107, 0, 0.15) outer shadow combined with a color-shift in the border to Accent Orange.

## Shapes
The shape language is "Soft-Modern." 

- **Standard Elements:** Buttons and input fields use `rounded-lg` (0.5rem) to maintain a crisp, professional edge.
- **Containers:** Main product cards and featured sections use `rounded-xl` (1rem) to feel more approachable and distinct from the UI framework.
- **Badges:** Use a smaller radius or full-pill shape to distinguish them from interactive buttons.

## Components

### Buttons
- **Primary CTA:** Solid #FF6B00 background, white text, bold weight. On hover, darken background by 10%.
- **Secondary:** Transparent background, 1px #2D8CFF border, #2D8CFF text. Hover adds a subtle blue tint background (10% opacity).

### Cards
- **Product Card:** Background #12121A, border 1px #2A2A3A. On hover, scale 1.02x, border color changes to #FF6B00, and a soft orange glow is applied.
- **Content Card:** Fixed background, no hover scale, used for editorial snippets.

### Badges & Labels
- **"Best Pick":** Solid Orange (#FF6B00) background, white text.
- **"Amazon Choice":** Solid Blue (#2D8CFF) background, white text.
- **"Deal":** Solid Red (#EF4444) background, white text.
- All badges use `label-md` typography.

### Input Fields
- Background: #1A1A26. Border: 1px #2A2A3A. 
- Focus state: Border transitions to #2D8CFF with a subtle blue outer glow.

### Navbar
- Height: 72px. Background: #0D0D14 with 80% opacity and 12px backdrop-blur. 
- Bottom border: 1px #2A2A3A.

### Pros & Cons List
- **Pros:** Text primary, prefixed with a Success Green (#22C55E) checkmark.
- **Cons:** Text primary, prefixed with a muted #9090A8 dash or cross.
