// Theme-aware utility classes for consistent light/dark mode styling

export const themeClasses = {
  // Backgrounds
  bgPrimary: "bg-white dark:bg-gh-dark",
  bgSecondary: "bg-gh-light-secondary dark:bg-gh-dark-secondary",
  bgTertiary: "bg-gray-50 dark:bg-gh-dark",
  bgHover: "hover:bg-gray-100 dark:hover:bg-gh-dark-secondary/50",

  // Borders
  border: "border-gh-light-border dark:border-gh-dark-border",
  borderHover: "hover:border-gray-400 dark:hover:border-gray-600",

  // Text
  textPrimary: "text-gh-light-text dark:text-gh-dark-text",
  textSecondary:
    "text-gh-light-text-secondary dark:text-gh-dark-text-secondary",
  textLink: "text-gh-blue dark:text-gh-blue-dark",

  // Buttons
  btnPrimary:
    "bg-gh-green dark:bg-gh-green-dark hover:bg-green-700 dark:hover:bg-green-600 text-white",
  btnSecondary:
    "bg-gh-light-secondary dark:bg-gh-dark-secondary border-gh-light-border dark:border-gh-dark-border hover:bg-gray-200 dark:hover:bg-gray-700",

  // Cards
  card: "bg-white dark:bg-gh-dark border-gh-light-border dark:border-gh-dark-border",
  cardHover: "hover:bg-gray-50 dark:hover:bg-gh-dark-secondary/30",

  // Inputs
  input:
    "bg-white dark:bg-gh-dark border-gh-light-border dark:border-gh-dark-border text-gh-light-text dark:text-gh-dark-text placeholder-gh-light-text-secondary dark:placeholder-gh-dark-text-secondary",

  // Badges
  badge:
    "bg-gray-100 dark:bg-gray-700 text-gh-light-text dark:text-gh-dark-text",
  badgeBorder: "border-gh-light-border dark:border-gh-dark-border",
};
