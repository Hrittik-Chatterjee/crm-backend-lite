// Predefined list of business packages
export const PACKAGES = [
  "Basic",
  "Standard",
  "Premium",
  "Enterprise",
  "Custom",
] as const;

// Predefined list of business types
export const BUSINESS_TYPES = [
  "Restaurant",
  "Hotel",
  "Cafe",
  "Bar",
  "Resort",
  "Spa",
  "Gym",
  "Salon",
  "Retail Store",
  "E-commerce",
  "Technology",
  "Healthcare",
  "Education",
  "Real Estate",
  "Construction",
  "Manufacturing",
  "Consulting",
  "Marketing Agency",
  "Law Firm",
  "Accounting Firm",
  "Travel Agency",
  "Event Planning",
  "Photography",
  "Automotive",
  "Entertainment",
  "Other",
] as const;

export type Package = (typeof PACKAGES)[number];
export type BusinessType = (typeof BUSINESS_TYPES)[number];
