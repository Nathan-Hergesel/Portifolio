# Design System

## Direction

An industrial creative-studio portfolio: tactile off-white surfaces, near-black typography, #36619b blue as a committed field color and a lighter blue signal. The page should feel fabricated and precisely registered, not templated.

## Scene

A potential client explores the portfolio on a bright desktop monitor during the workday, looking for both creative range and evidence that the project will be handled safely.

## Typography

- Display: Barlow Condensed, 600 to 900
- Body and interface: Public Sans, 400 to 700
- Display headings use compact leading and deliberate wrapping.
- Body copy is capped near 65 characters per line.

## Color

- Canvas: warm off-white
- Ink: near-black with a subtle cool cast
- Primary: #36619b blue with a subtle light-to-deep gradient on large fields
- Signal: sparse light blue
- Feedback: explicit success and error colors with WCAG AA contrast

All implementation colors use OKLCH tokens.

## Layout

- Mobile-first composition
- Twelve-column desktop grid
- Asymmetrical hero with portrait on the left and statement on the right
- Full-width section fields instead of repeated container cards
- Project index uses varied image proportions and strong dividers

## Motion

- Orchestrated page-load reveal for the hero
- Scroll-triggered clipping and translation for section content
- Continuous ticker rails and restrained portrait parallax
- Exponential easing, no bounce or elastic movement
- Equivalent stable presentation under `prefers-reduced-motion`

## Components

- Technical section code and registration marks
- Three equal-weight hero actions
- Image-led project index with native dialog details
- Indexed service and process rows
- Visible-label contact form with explicit success and error states
- Mobile navigation with keyboard-safe focus behavior

## Accessibility

- WCAG AA contrast targets
- Visible `:focus-visible` treatment
- Minimum 44px interactive targets
- Skip link and semantic landmarks
- Keyboard-operable navigation and project dialog
- Reduced-motion mode
