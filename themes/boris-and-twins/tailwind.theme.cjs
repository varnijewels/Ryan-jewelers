/* Boris & Twins — "Golden Legacy" Tailwind theme extension.
 * In tailwind.config.ts: theme: { extend: require('./themes/Boris & Twins/tailwind.theme.cjs') }
 */
module.exports = {
  colors: {
    background: "hsl(var(--background) / <alpha-value>)",
    foreground: "hsl(var(--foreground) / <alpha-value>)",
    primary: {
      DEFAULT: "hsl(var(--primary) / <alpha-value>)",
      foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
    },
    secondary: {
      DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
      foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
    },
    accent: {
      DEFAULT: "hsl(var(--accent) / <alpha-value>)",
      foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
    },
    muted: {
      DEFAULT: "hsl(var(--muted) / <alpha-value>)",
      foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
    },
    card: {
      DEFAULT: "hsl(var(--card) / <alpha-value>)",
      foreground: "hsl(var(--card-foreground) / <alpha-value>)",
    },
    destructive: {
      DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
      foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
    },
    border: "hsl(var(--border) / <alpha-value>)",
    input: "hsl(var(--input) / <alpha-value>)",
    ring: "hsl(var(--ring) / <alpha-value>)",
    // Raw source tokens for section-fidelity work (bands, badges, stars).
    brand: {
      maroon: "#9E260E",
      "maroon-dark": "#7D1C08",
      ink: "#202020",
      cream: "#FBF2EE",
      gold: "#E2A53C",
      line: "#E9E9E9",
      "line-2": "#D9D9D9",
      darkblack: "#151515",
    },
  },
  fontFamily: {
    heading: ["Bodoni Moda", "Times New Roman", "serif"],
    body: ["Jost", "Chivo", "ui-sans-serif", "system-ui", "sans-serif"],
    sans: ["Jost", "Chivo", "ui-sans-serif", "system-ui", "sans-serif"],
  },
  borderRadius: {
    DEFAULT: "var(--radius)",
    lg: "calc(var(--radius) + 2px)",
    md: "var(--radius)",
    sm: "calc(var(--radius) - 1px)",
  },
  boxShadow: {
    DEFAULT: "var(--shadow-default)",
  },
  maxWidth: {
    container: "var(--container-width)",
  },
  transitionTimingFunction: {
    brand: "cubic-bezier(.22, .61, .36, 1)",
  },
};
