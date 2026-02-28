import { Code2, Zap, Eye, LucideIcon } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  colorScheme: {
    iconBg: string;
    iconColor: string;
    borderHover: string;
  };
}

export const FEATURES: Feature[] = [
  {
    icon: Code2,
    title: "Natural Syntax",
    description:
      "Write code that reads like English. No curly braces, no semicolons—just clear, declarative statements that anyone can understand.",
    colorScheme: {
      iconBg: "bg-violet-100 dark:bg-violet-900/30",
      iconColor: "text-violet-600 dark:text-violet-400",
      borderHover: "hover:border-violet-300 dark:hover:border-violet-700",
    },
  },
  {
    icon: Zap,
    title: "Reactive by Default",
    description:
      "Built-in reactivity system automatically updates your UI when state changes. No manual DOM manipulation needed.",
    colorScheme: {
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      borderHover: "hover:border-blue-300 dark:hover:border-blue-700",
    },
  },
  {
    icon: Eye,
    title: "Live Preview",
    description:
      "See your changes instantly in the interactive playground. Edit code and watch your app come to life in real-time.",
    colorScheme: {
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      borderHover: "hover:border-green-300 dark:hover:border-green-700",
    },
  },
];
