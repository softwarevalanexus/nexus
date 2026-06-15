import educationImg from "@/assets/previews/education-1.jpg";
import medicalImg from "@/assets/previews/medical-1.jpg";
import hotelImg from "@/assets/previews/hotel-1.jpg";
import ecommerceImg from "@/assets/previews/ecommerce-1.jpg";
import servicesImg from "@/assets/previews/services-1.jpg";
import manufacturingImg from "@/assets/previews/manufacturing-1.jpg";

export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  users: number;
  thumbnail: string;
  features: string[];
  modules: string[];
  tags: string[];
  status: "trending" | "new" | "popular" | "featured";
  subscription: { monthly: number; yearly: number };
}

const previewImages: Record<string, string> = {
  education: educationImg,
  medical: medicalImg,
  hotel: hotelImg,
  ecommerce: ecommerceImg,
  services: servicesImg,
  manufacturing: manufacturingImg,
};

function make(
  id: number,
  name: string,
  category: string,
  categorySlug: string,
  desc: string,
  price: number,
  features: string[],
  modules: string[],
): Product {
  const img = previewImages[categorySlug] ?? educationImg;
  return {
    id: `prod-${id}`,
    name,
    category,
    categorySlug,
    shortDescription: desc,
    description: `${name} is a comprehensive ${category.toLowerCase()} solution designed for modern businesses. ${desc} Built with scalability, security, and performance in mind, it handles thousands of concurrent users with ease.`,
    price,
    originalPrice: Math.round(price * 1.4),
    rating: 4 + (id % 10) / 10,
    reviews: 50 + ((id * 23) % 500),
    users: 500 + ((id * 137) % 10000),
    thumbnail: img,
    features,
    modules,
    tags: [category, "SaaS", "Premium"],
    status: (["trending", "new", "popular", "featured"] as const)[id % 4],
    subscription: { monthly: Math.round(price / 10), yearly: Math.round(price / 10) * 10 },
  };
}

export const products: Product[] = [
  make(1, "EduFlow Pro", "Education", "education", "Complete LMS with live classes, AI grading, and student analytics.", 299, ["Live Video Classes", "AI Auto-Grading", "Student Analytics", "Certificate Generator", "Mobile App"], ["Course Builder", "Exam System", "Library", "Attendance", "Reports"]),
  make(2, "MediCore 360", "Hospital & Medical", "medical", "Full hospital management with EMR, scheduling, and pharmacy.", 499, ["Electronic Medical Records", "Appointment Scheduling", "Pharmacy Management", "Lab Integration", "Billing"], ["Patient Portal", "Doctor Panel", "Pharmacy", "Lab Module", "Billing"]),
  make(3, "HotelNest", "Hotel & Restaurant", "hotel", "Property management with booking engine and POS.", 349, ["Booking Engine", "POS System", "Housekeeping", "Revenue Management", "Guest App"], ["Reservations", "Front Desk", "Restaurant POS", "Inventory", "Reports"]),
  make(4, "ShopEngine", "Ecommerce", "ecommerce", "Multi-vendor marketplace with advanced analytics.", 399, ["Multi-Vendor Support", "Payment Gateway", "Inventory Management", "SEO Tools", "Mobile App"], ["Product Catalog", "Orders", "Payments", "Shipping", "Analytics"]),
  make(5, "ServiceHub", "Service Providers", "services", "Field service management with scheduling and invoicing.", 249, ["Job Scheduling", "GPS Tracking", "Invoice Generation", "Client Portal", "Mobile App"], ["Dispatch", "Time Tracking", "Invoicing", "CRM", "Reports"]),
  make(6, "FactoryOS", "Manufacturing", "manufacturing", "Production planning and quality control platform.", 599, ["Production Planning", "Quality Control", "Supply Chain", "IoT Integration", "Analytics"], ["BOM Management", "Work Orders", "QC Module", "Inventory", "MRP"]),
  make(7, "LearnPad", "Education", "education", "Interactive e-learning with gamification and assessments.", 199, ["Gamification", "Interactive Content", "Progress Tracking", "Quiz Builder", "Certificates"], ["Course Engine", "Quizzes", "Leaderboard", "Analytics", "Certificates"]),
  make(8, "ClinicPro", "Hospital & Medical", "medical", "Clinic management with telemedicine and e-prescriptions.", 279, ["Telemedicine", "E-Prescriptions", "Queue Management", "Insurance Claims", "Reports"], ["Appointments", "Teleconsult", "Pharmacy", "Billing", "Reports"]),
  make(9, "DineFlow", "Hotel & Restaurant", "hotel", "Restaurant chain management with delivery integration.", 299, ["Multi-Location", "Delivery Integration", "Menu Builder", "Table Management", "Loyalty"], ["POS", "Kitchen Display", "Delivery", "Inventory", "Loyalty"]),
  make(10, "CartMax", "Ecommerce", "ecommerce", "Headless commerce platform with AI recommendations.", 449, ["Headless Commerce", "AI Recommendations", "A/B Testing", "Multi-Currency", "API First"], ["Storefront", "Cart", "Payments", "Analytics", "API"]),
  make(11, "BookMyPro", "Service Providers", "services", "Appointment booking for salons, spas, and professionals.", 149, ["Online Booking", "Reminders", "Payments", "Staff Management", "Reviews"], ["Calendar", "Bookings", "Payments", "Staff", "Marketing"]),
  make(12, "AssemblyLine", "Manufacturing", "manufacturing", "Lean manufacturing with real-time floor monitoring.", 699, ["Real-Time Monitoring", "Lean Tools", "Predictive Maintenance", "Worker Safety", "ERP Integration"], ["Floor Monitor", "Maintenance", "Safety", "Quality", "ERP Link"]),
  make(13, "SchoolSync", "Education", "education", "School ERP with parent portal, transport, and fees.", 249, ["Parent Portal", "Transport Tracking", "Fee Management", "Timetable", "Communication"], ["Students", "Teachers", "Fees", "Transport", "Exams"]),
  make(14, "PharmaSuite", "Hospital & Medical", "medical", "Pharmacy chain management with drug interaction alerts.", 329, ["Multi-Store", "Drug Alerts", "Insurance Billing", "Expiry Tracking", "POS"], ["Inventory", "Sales", "Prescriptions", "Insurance", "Reports"]),
  make(15, "StayEase", "Hotel & Restaurant", "hotel", "Vacation rental management with channel manager.", 279, ["Channel Manager", "Dynamic Pricing", "Guest Communication", "Cleaning Scheduler", "Owner Portal"], ["Listings", "Bookings", "Pricing", "Maintenance", "Finance"]),
  make(16, "MarketForge", "Ecommerce", "ecommerce", "B2B wholesale marketplace platform.", 549, ["Bulk Pricing", "Quote System", "Credit Terms", "Catalog Management", "EDI"], ["Products", "Orders", "Quotes", "Accounts", "Shipping"]),
  make(17, "FieldForce", "Service Providers", "services", "Workforce management for utilities and telecom.", 399, ["Route Optimization", "Work Orders", "Asset Tracking", "Compliance", "Mobile-First"], ["Dispatch", "Assets", "Compliance", "Reports", "Mobile"]),
  make(18, "CraftPlan", "Manufacturing", "manufacturing", "Craft and batch manufacturing with recipe management.", 349, ["Recipe Management", "Batch Tracking", "Compliance", "Cost Analysis", "Labeling"], ["Recipes", "Batches", "Quality", "Costing", "Labels"]),
  make(19, "TutorMatch", "Education", "education", "Tutoring marketplace connecting students with experts.", 179, ["Matching Algorithm", "Video Calls", "Payments", "Reviews", "Scheduling"], ["Search", "Booking", "Sessions", "Payments", "Reviews"]),
  make(20, "CareConnect", "Hospital & Medical", "medical", "Home healthcare management with patient monitoring.", 379, ["Remote Monitoring", "Visit Scheduling", "Vital Tracking", "Family Access", "Compliance"], ["Patients", "Visits", "Monitoring", "Billing", "Reports"]),
  make(21, "QuickBite", "Hotel & Restaurant", "hotel", "Cloud kitchen management with multi-brand support.", 229, ["Multi-Brand", "Order Aggregation", "Kitchen Display", "Analytics", "Menu Engine"], ["Orders", "Kitchen", "Menu", "Delivery", "Analytics"]),
  make(22, "DropShipX", "Ecommerce", "ecommerce", "Automated dropshipping with supplier integration.", 299, ["Auto-Fulfillment", "Supplier Sync", "Price Automation", "Order Routing", "Analytics"], ["Products", "Suppliers", "Orders", "Pricing", "Reports"]),
  make(23, "CleanSquad", "Service Providers", "services", "Cleaning service management with quality scoring.", 199, ["Job Scheduling", "Quality Audits", "Client Portal", "Inventory", "Billing"], ["Schedule", "Teams", "Quality", "Clients", "Finance"]),
  make(24, "SteelWorks", "Manufacturing", "manufacturing", "Heavy industry ERP with safety compliance.", 799, ["Safety Compliance", "Heavy Asset Tracking", "Shift Management", "Environmental", "Reporting"], ["Assets", "Safety", "Shifts", "Environment", "Finance"]),
];

export interface Category {
  name: string;
  slug: string;
  count: number;
}

export const categories: Category[] = [
  { name: "Education", slug: "education", count: products.filter(p => p.categorySlug === "education").length },
  { name: "Hospital & Medical", slug: "medical", count: products.filter(p => p.categorySlug === "medical").length },
  { name: "Hotel & Restaurant", slug: "hotel", count: products.filter(p => p.categorySlug === "hotel").length },
  { name: "Ecommerce & Shops", slug: "ecommerce", count: products.filter(p => p.categorySlug === "ecommerce").length },
  { name: "Service Providers", slug: "services", count: products.filter(p => p.categorySlug === "services").length },
  { name: "Manufacturing", slug: "manufacturing", count: products.filter(p => p.categorySlug === "manufacturing").length },
];

export const sections: { title: string; filter: (p: Product) => boolean }[] = [
  { title: "Trending Now", filter: () => true },
  { title: "Education Software", filter: (p) => p.categorySlug === "education" },
  { title: "Hospital & Medical", filter: (p) => p.categorySlug === "medical" },
  { title: "Hotel & Restaurant", filter: (p) => p.categorySlug === "hotel" },
  { title: "Ecommerce & Shops", filter: (p) => p.categorySlug === "ecommerce" },
  { title: "Service Providers", filter: (p) => p.categorySlug === "services" },
  { title: "Manufacturing", filter: (p) => p.categorySlug === "manufacturing" },
  { title: "New Releases", filter: (p) => p.status === "new" },
  { title: "Most Used Apps", filter: (p) => p.users > 3000 },
];
