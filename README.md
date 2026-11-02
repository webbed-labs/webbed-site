# WEBBED Website Project

WEBBED is a premium, high-end digital showcase website. The platform is designed and built to present custom software systems, elite product engineering, and cutting-edge intelligence solutions. It represents a luxury-grade software agency that merges professional craftsmanship with deep artificial intelligence integration.

This document provides a complete guide to everything in the project, including the technologies, the component architecture, the project structure, and instructions to run and build the application.

---

## Technical Stack

The project is built with modern web technologies that focus on speed, design excellence, and smooth interactive animations:

1. **Framework**: Next.js (Version 16.2.5) using the App Router.
2. **Runtime & Library**: React (Version 19.2.4) and React DOM (Version 19.2.4) for high-performance component rendering.
3. **Language**: TypeScript (Version 5) for robust static typing.
4. **Styling**: Tailwind CSS (Version 4) coupled with PostCSS for modular styling.
5. **Animation Libraries**:
   - **Framer Motion** (Version 12.38.0) for spring animations, scroll-triggered movements, and page transition effects.
   - **GSAP** (Version 3.15.0) and **@gsap/react** (Version 2.1.2) for professional timeline animations.
6. **Custom Typography**:
   - **Satoshi**: A premium variable sans-serif font designed for readability and clean paragraphs.
   - **Martian Grotesk**: A modern, bold sans-serif font used for expressive headers and bold branding elements.

---

## Core Components and Visual Architecture

The application is structured into modular React components. Each component is styled to create a seamless, cinematic, and responsive experience.

### 1. Navigation System (Navbar)
* **Location**: `src/components/Navbar.tsx`
* **Features**:
  - High-performance sticky header that adjusts dynamically on scroll.
  - Houses the brand logo (`/logo.png`) scaled up to be more visible and prominent.
  - Navigation links point directly to core sections and pages: **About**, **Product** (Labs), **Solutions**, and **Education** (Schools).
  - Fully animated mobile menu with a sleek hamburger button transition.
  - Clean glassmorphism backdrop effects to maintain structural transparency.

### 2. Main Hero Section (Hero)
* **Location**: `src/components/Hero.tsx`
* **Features**:
  - Autoplay cinematic video background (`/video/hero.mp4`) that loops smoothly.
  - Dark overlay shadows and blurring effects to keep text readable.
  - Clean branding heading displaying the prominent scaled-up brand `/logo.png` image with high-contrast accessibility inside semantic `<h1>` tags.
  - Prominent glassmorphic buttons for user interaction.

### 3. Glassmorphic Feature Block (Blast Section)
* **Location**: `src/components/BlastSection.tsx`
* **Features**:
  - A two-column grid showcasing a vertical glassmorphic aspect card with the glass-shattering sphere graphic (`/blast_img.jpg`) on the left.
  - Beautifully styled, right-aligned copywriting with dynamic purple-pink and orange-yellow text gradients on the right.
  - Framer Motion animation effects triggered on scroll.

### 4. Storytelling Carousel (About Section)
* **Location**: `src/components/about/`
* **Components**:
  - `AboutTimelineSection.tsx`: Manages the overall state, active index transitions, and auto-cycling.
  - `AboutChapterTimeline.tsx`: Renders a custom timeline bar showing the active chapter progress.
  - `AboutSceneSlide.tsx`: Coordinates layouts for text and imagery side-by-side.
  - `AboutSceneBackground.tsx`: Renders customized radial gradient background glows for each slide.
  - `AboutSceneImagePanel.tsx`: Houses the high-resolution images (`/about/`) inside glassmorphic frames.
  - `aboutScenes.tsx`: Contains the central configuration data for the four chapters:
    1. **Intro**: Shows the core statement (making software the world is not prepared for yet).
    2. **Visionary**: Highlights future-ready product design.
    3. **Passion**: Emphasizes strict craft and attention to micro-details.
    4. **Impact**: Represents building scalable products for legacy.

### 5. Services Showcase (Services Showcase)
* **Location**: `src/components/ServicesShowcase.tsx`
* **Features**:
  - A clean, light-themed section displaying three custom-crafted cards mapping out the agency's primary focuses.
  - Hover effects using Framer Motion spring physics that lift the cards and expand their scale.
  - Background imagery inside each card (`schools-bg.png`, `services-bg.jpg`, and `labs-bg.jpg`) with group-hover zoom scaling.

### 6. Interactive 3D Orbit (Why Choose Us Section)
* **Location**: `src/components/WhyUsSection.tsx`
* **Features**:
  - Moved to the dedicated **Solutions** page (`/solutions`).
  - Highlights six core principles: Hybrid Expertise, Professional-Grade Quality, Custom-Built Solutions, AI at the Core, Flexible Tech Stack, and Agile Delivery.
  - Displays a large, animated, conic-gradient sphere in the center reacting dynamically in real-time to the coordinates of the user's cursor.
  - Smooth animation springs make labels orbit elastic-like around the sphere.

### 7. Cinematic Footer
* **Location**: `src/components/CinematicFooter.tsx`
* **Features**:
  - A giant "WEBBED" wordmark with bouncing and sliding physics that activates when scrolled into view, fading into the dark background at its base.
  - Houses the brand logo (`/logo.png`) scaled up to be more visible and prominent, removing the text next to it.
  - Sleek layout housing menu links, privacy policy links, and premium social media icon buttons.

---

## Page Routing & Structure

Next.js App Router defines the following core pages:

* **Home Page (`/`)**: Hosts the Hero section, Blast section, About timeline, and Services showcase.
* **About Page (`/about`)**: Houses detailed agency background and history, styled with the global `Navbar` and `CinematicFooter`.
* **Labs Page (`/labs`)**: Displays speculative concepts, experimental prototyping, and active AI research divisions.
* **Solutions Page (`/solutions`)**: Focuses on corporate intelligence integrations and houses the migrated **Why Choose Us** interactive orbit.
* **Schools Page (`/schools`)**: Showcases tailored educational AI products, adaptive tutoring, and automated curriculum tools.

---

## Directory Structure

Here is an outline of the files in the project workspace:

```text
site/
├── public/                     # Static media files served to the browser
│   ├── about/                  # Images for the storytelling section
│   │   ├── impact.jpg
│   │   ├── passion.jpg
│   │   ├── vision.jpg
│   │   └── we make.jpg
│   ├── video/
│   │   └── hero.mp4            # Cinematic hero video
│   ├── blast_img.jpg           # Glass-shattering sphere image
│   ├── schools-bg.png          # Webbed Schools card background
│   ├── services-bg.jpg         # Webbed Services card background
│   ├── labs-bg.jpg             # Webbed Labs card background
│   ├── logo.png                # Brand identity logo
│   └── (other SVGs)
├── src/
│   ├── app/                    # Next.js App Router root
│   │   ├── about/
│   │   │   └── page.tsx        # Dedicated About page (with header/footer)
│   │   ├── labs/
│   │   │   └── page.tsx        # Labs (Product) page
│   │   ├── solutions/
│   │   │   └── page.tsx        # Solutions page (contains Why Us section)
│   │   ├── schools/
│   │   │   └── page.tsx        # Schools (Education) page
│   │   ├── fonts/              # Custom woff2 typography files
│   │   │   ├── satoshi/
│   │   │   └── martian-grotesk/
│   │   ├── fonts.ts            # Font configuration script
│   │   ├── globals.css         # Global style sheets and type scales
│   │   ├── layout.tsx          # Master HTML wrapper layout
│   │   └── page.tsx            # Main home page component
│   └── components/             # React visual units
│       ├── about/              # Modular carousel parts
│       ├── BlastSection.tsx    # Glassmorphic blast section component
│       ├── CinematicFooter.tsx
│       ├── Hero.tsx
│       ├── Navbar.tsx
│       ├── ServicesShowcase.tsx
│       └── WhyUsSection.tsx    # Orbited labels component
├── package.json                # Project dependencies and execution scripts
├── tsconfig.json               # TypeScript compiler rules
├── next.config.ts              # Next.js configurations
└── tailwind.config.ts          # Tailwind CSS style system parameters
```

---

## Getting Started

### 1. Installation
To set up all the necessary node packages and environment files, run:
```bash
npm install
```

### 2. Development Server
To launch the hot-reloading development server locally, execute:
```bash
npm run dev
```
Once started, you can navigate to `http://localhost:3000` in your web browser.

### 3. Production Build
To compile the TypeScript code and optimize the application into a production bundle, run:
```bash
npm run build
```

### 4. Running Production Mode
To launch the optimized production build locally, run:
```bash
npm run start
```

### 5. Linting
To check the code for syntax or styling inconsistencies according to the ESLint rules, execute:
```bash
npm run lint
```

---

## Design Choices and Custom Styling

* **Color Space and Lighting**: The application uses dark-themed aesthetic layers with sudden highlights. Bright colors are generated through glowing radial shadows, spotlight filters, and gradient borders that contrast with deep black backgrounds.
* **Layout Shifts**: Type sizes use mathematical CSS clamp formulas. This makes sure that typography resizes fluidly without causing abrupt layout shifts or page jank.
* **Micro-Animations**: Mouse hovers trigger spring physics (instead of static linear transitions). This provides physical feedback to interactions, making the website feel organic, premium, and alive.
* **Accessibility**: Every interactive menu link, action button, and graphic panel includes semantic HTML5 tags or explicit ARIA roles to ensure full accessibility for screen readers.
