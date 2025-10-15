import { Category } from '@/types';

export const categories: Category[] = [
  {
    name: "Knowledge",
    description: "Programming knowledge and algorithm related articles.",
    value: ["code", "algorithm"],
  },
  {
    name: "NAS & Smarthome DIY",
    description: "Articles about NAS and Smarthome DIY.",
    value: ["nas", "smarthome", "diy"],
  },
  {
    name: "Tutorial & Tips",
    description: "Programming tutorials and technology tips.",
    value: ["tutorial", "tip"],
  },
  {
    name: "Notion",
    description: "Articles about Notion and related utilities.",
    value: "notion",
  },
  {
    name: "Marketplace",
    description: "Articles about products and services I'm providing.",
    value: "market",
  },
  {
    name: "Others",
    description: "Non-technology related articles.",
    value: "other",
  },
] as const;

export default categories;
