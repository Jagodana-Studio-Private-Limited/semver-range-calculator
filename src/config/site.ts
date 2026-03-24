export const siteConfig = {
  // ====== CUSTOMIZE THESE FOR EACH TOOL ======
  name: "Semver Range Calculator",
  title: "Semver Range Calculator - Visualize & Understand npm Semver Ranges",
  description:
    "Instantly visualize which versions match any semver range. Enter ^1.2.3, ~2.0.0, >=1.0.0 <2.0.0 and see a color-coded version grid with human-readable explanations. 100% client-side.",
  url: "https://semver-range-calculator.tools.jagodana.com",
  ogImage: "/opengraph-image",

  // Header
  headerIcon: "GitBranch",
  brandAccentColor: "#6366f1", // hex accent for OG image gradient (must match --brand-accent in globals.css)

  // SEO
  keywords: [
    "semver range calculator",
    "semantic versioning",
    "npm semver",
    "semver range visualizer",
    "caret range",
    "tilde range",
    "version range checker",
    "semver tester",
    "package version range",
    "semver compatible versions",
    "npm version range",
    "semver ^",
    "semver ~",
    "semantic version calculator",
    "version compatibility checker",
  ],
  applicationCategory: "DeveloperApplication",

  // Theme
  themeColor: "#8b5cf6",

  // Branding
  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  // Social Profiles (for Organization schema sameAs)
  socialProfiles: [
    "https://twitter.com/jagodana",
  ],

  // Links
  links: {
    github: "https://github.com/Jagodana-Studio-Private-Limited/semver-range-calculator",
    website: "https://jagodana.com",
  },

  // Footer
  footer: {
    about:
      "Semver Range Calculator helps developers instantly understand and visualize semantic version ranges. Enter any semver range and see which versions match in a color-coded grid with human-readable explanations.",
    featuresTitle: "Features",
    features: [
      "Visual version grid with color-coded matches",
      "Human-readable range explanations",
      "Version tester — check any specific version",
      "Preset examples for all common range types",
      "Min/max satisfying version display",
      "100% client-side, no data sent to server",
    ],
  },

  // Hero Section
  hero: {
    badge: "Free Semver Tool",
    titleLine1: "Visualize Semver Ranges",
    titleGradient: "Instantly",
    subtitle:
      "Enter any semver range like ^1.2.3, ~2.0.0, or >=1.0.0 <2.0.0 and instantly see which versions match. Human-readable explanations, version grid, and a built-in version tester.",
  },

  // Feature Cards (shown on homepage)
  featureCards: [
    {
      icon: "🎨",
      title: "Visual Version Grid",
      description:
        "See a color-coded grid of versions from 0.0.1 to 5.x — green for matches, gray for non-matches. Instantly understand the scope of any range.",
    },
    {
      icon: "💬",
      title: "Plain-English Explanations",
      description:
        "Caret (^), tilde (~), hyphen ranges, x-ranges — each explained in plain English so you always know exactly what versions your range allows.",
    },
    {
      icon: "🧪",
      title: "Version Tester",
      description:
        "Enter any specific version to instantly check if it satisfies your range. Great for debugging dependency issues in package.json.",
    },
  ],

  // Related Tools (cross-linking to sibling Jagodana tools for internal SEO)
  relatedTools: [
    {
      name: "Regex Playground",
      url: "https://regex-playground.jagodana.com",
      icon: "🧪",
      description: "Build, test & debug regular expressions in real-time.",
    },
    {
      name: "Favicon Generator",
      url: "https://favicon-generator.jagodana.com",
      icon: "🎨",
      description: "Generate all favicon sizes + manifest from any image.",
    },
    {
      name: "Sitemap Checker",
      url: "https://sitemap-checker.jagodana.com",
      icon: "🔍",
      description: "Discover and validate sitemaps on any website.",
    },
    {
      name: "Screenshot Beautifier",
      url: "https://screenshot-beautifier.jagodana.com",
      icon: "📸",
      description: "Transform screenshots into beautiful images.",
    },
    {
      name: "Color Palette Explorer",
      url: "https://color-palette-explorer.jagodana.com",
      icon: "🎭",
      description: "Extract color palettes from any image.",
    },
    {
      name: "Logo Maker",
      url: "https://logo-maker.jagodana.com",
      icon: "✏️",
      description: "Create a professional logo in 60 seconds.",
    },
  ],

  // HowTo Steps (drives HowTo JSON-LD schema for rich results)
  howToSteps: [
    {
      name: "Enter a semver range",
      text: "Type any semver range into the input field — such as ^1.2.3, ~2.0.0, >=1.0.0 <2.0.0, 1.x, or 2.0.0 - 3.0.0.",
      url: "",
    },
    {
      name: "Read the visual grid",
      text: "Browse the color-coded version grid to see which versions match (green) and which don't (gray). The min and max satisfying versions are highlighted.",
      url: "",
    },
    {
      name: "Test a specific version",
      text: "Use the version tester to check if a specific version like 1.4.2 satisfies your range. Useful for debugging package.json dependency conflicts.",
      url: "",
    },
  ],
  howToTotalTime: "PT1M",

  // FAQ (drives both the FAQ UI section and FAQPage JSON-LD schema)
  faq: [
    {
      question: "What does the caret (^) mean in a semver range?",
      answer:
        "The caret (^) allows changes that do not modify the left-most non-zero digit. For example, ^1.2.3 allows >=1.2.3 <2.0.0 — it allows minor and patch upgrades but not a new major version. For ^0.2.3, it allows >=0.2.3 <0.3.0 since 0 is the left-most non-zero digit.",
    },
    {
      question: "What does the tilde (~) mean in a semver range?",
      answer:
        "The tilde (~) allows patch-level changes if a minor version is specified. ~1.2.3 means >=1.2.3 <1.3.0 — only patch upgrades are allowed. If only a major is specified, like ~1, it allows >=1.0.0 <2.0.0.",
    },
    {
      question: "What is a hyphen range in semver?",
      answer:
        "A hyphen range like 1.2.3 - 2.3.4 specifies an inclusive range. It means >=1.2.3 <=2.3.4. Both ends are inclusive. Partial ranges like 1.2 - 2.3.4 are interpreted as >=1.2.0 <=2.3.4.",
    },
    {
      question: "What are X-ranges in semver?",
      answer:
        "X-ranges use X, x, or * as wildcards for any part of the version. For example, 1.x means >=1.0.0 <2.0.0, and 1.2.x means >=1.2.0 <1.3.0. A bare * means any version (>=0.0.0).",
    },
    {
      question: "Can I use OR (||) in a semver range?",
      answer:
        "Yes! You can combine ranges with || (logical OR). For example, ^1.0.0 || ^2.0.0 means a version satisfying either ^1.0.0 or ^2.0.0 is valid. This is common in peer dependency specifications to support multiple major versions.",
    },
    {
      question: "Is this tool 100% free and client-side?",
      answer:
        "Yes. The Semver Range Calculator runs entirely in your browser using the official 'semver' npm package. No version data or ranges are sent to any server. It's completely free with no sign-up required.",
    },
  ],

  // ====== PAGES (for sitemap + per-page SEO) ======
  pages: {
    "/": {
      title:
        "Semver Range Calculator - Visualize & Understand npm Semver Ranges",
      description:
        "Instantly visualize which versions match any semver range. Enter ^1.2.3, ~2.0.0, >=1.0.0 <2.0.0 and see a color-coded version grid with human-readable explanations. 100% client-side.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
