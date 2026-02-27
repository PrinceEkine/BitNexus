
export type SubscriptionPlan = 'beta' | 'mega' | 'mega_pro';
export type PaymentMethod = 'cash' | 'opay' | 'paga' | 'flutterwave' | 'bank_transfer' | 'paystack';
export type AppLanguage = 'en' | 'yo' | 'ha' | 'ig';

export interface User {
  id: string;
  email: string;
  name: string;
  companyName: string;
  role: 'admin' | 'user' | 'staff';
  trialStartDate: string;
  subscriptionExpiry?: string;
  isSubscribed: boolean;
  isVerified: boolean;
  parentId?: string; // Links staff to business owner in the 'profiles' table
  plan?: SubscriptionPlan;
}

export interface Settings {
  companyName: string;
  currency: string;
  categories: string[];
  lowStockEmailAlerts: boolean;
  notificationEmail: string;
  isPromoActive: boolean;
  promoDiscount: number;
  theme: 'light' | 'dark';
  taxRate: number;
  language: AppLanguage;
  isDynamicPricingActive: boolean;
  paystackPublicKey?: string;
  marketplaces: {
    jumia: boolean;
    konga: boolean;
    whatsapp: boolean;
  };
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'low_stock' | 'sale' | 'system' | 'return';
  date: string;
  read: boolean;
  user_id: string; // Matches DB
}

export interface Product {
  id: string;
  user_id: string; // uuid
  name: string; // text
  sku: string; // text
  category: string; // text
  price: number; // numeric
  cost_price: number; // numeric
  quantity: number; // int4
  min_threshold: number; // int4
  supplier_id: string | null; // uuid
  last_updated: string; // timestamptz
  created_at: string; // timestamptz
  batch_number: string; // text
  expiry_date: string | null; // date
  location: string; // text
  sustainability_score: number; // int4
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  costPrice: number;
}

export interface Sale {
  id: string;
  user_id: string; // Matches DB
  items: SaleItem[]; // JSONB in DB
  total_price: number; // Matches DB
  total_cost: number; // Matches DB
  tax_amount: number; // Matches DB
  date: string;
  customer_name?: string; // Matches DB
  location: string;
  payment_method: PaymentMethod; // Matches DB
  is_checked: boolean;
  is_archived: boolean;
}

export interface ProductReturn {
  id: string;
  user_id: string; // Matches DB
  sale_id?: string; // Matches DB
  product_id: string; // Matches DB
  product_name: string; // Matches DB
  quantity: number;
  reason: string;
  date: string;
  refunded: boolean;
  location: string;
}

export interface Supplier {
  id: string;
  user_id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  category: string;
}

export interface StocktakeItem {
  productId: string;
  systemQty: number;
  physicalQty: number;
}

export interface AppState {
  loading: boolean;
  initialLoadComplete: boolean;
  currentUser: User | null;
  products: Product[];
  sales: Sale[];
  returns: ProductReturn[];
  suppliers: Supplier[];
  notifications: AppNotification[];
  users: User[];
  settings: Settings;
  error: string | null;
  isLoggedIn: boolean;
  isOnline: boolean;
  tickets: ServiceTicket[];
  technicians: Technician[];
  pricingRules: PricingRule[];
  login: (email: string, pass: string) => Promise<any>;
  register: (data: any) => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updatePassword: (newPassword: string) => Promise<any>;
  logout: () => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'last_updated' | 'created_at' | 'user_id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  recordSale: (items: SaleItem[], customerName?: string, location?: string, paymentMethod?: PaymentMethod) => Promise<boolean>;
  reconcileInventory: (items: StocktakeItem[]) => Promise<void>;
  recordReturn: (data: Omit<ProductReturn, 'id' | 'date' | 'user_id'>) => Promise<void>;
  addSupplier: (supplier: Omit<Supplier, 'id' | 'user_id'>) => Promise<void>;
  addStaffMember: (staffData: any) => Promise<void>;
  removeStaffMember: (id: string) => Promise<void>;
  activateSubscription: (plan: SubscriptionPlan, cycle: 'monthly' | 'annual') => Promise<void>;
  createTicket: (ticket: Omit<ServiceTicket, 'id' | 'created_at' | 'status'>) => Promise<any>;
  updateTicket: (id: string, updates: Partial<ServiceTicket>) => Promise<void>;
  updateTechnician: (id: string, updates: Partial<Technician>) => Promise<void>;
  updatePricingRule: (id: string, updates: Partial<PricingRule>) => Promise<void>;
}

export enum View {
  Landing = 'landing',
  Dashboard = 'dashboard',
  Inventory = 'inventory',
  Sales = 'sales',
  Returns = 'returns',
  Suppliers = 'suppliers',
  AIInsights = 'ai-insights',
  Sustainability = 'sustainability',
  Stocktake = 'stocktake',
  Reports = 'reports',
  Settings = 'settings',
  UserManagement = 'user-management',
  LaunchCenter = 'launch-center',
  AboutUs = 'about-us',
  HelpCenter = 'help-center',
  TermsOfService = 'terms-of-service',
  PrivacyPolicy = 'privacy-policy',
  Governance = 'governance',
  // New BitNexus Views
  ServiceBooking = 'service-booking',
  CustomerDashboard = 'customer-dashboard',
  AdminTickets = 'admin-tickets',
  TechnicianManagement = 'technician-management',
  PricingControl = 'pricing-control'
}

export interface ServiceTicket {
  id: string;
  user_id: string;
  customer_id: string;
  customer_name: string;
  category: string;
  description: string;
  media_url?: string;
  preferred_date: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  technician_id?: string;
  address: string;
  live_video_enabled: boolean;
  is_emergency: boolean;
  created_at: string;
  updated_at?: string;
  invoice_url?: string;
  warranty_expiry?: string;
  total_cost?: number;
}

export interface Technician {
  id: string;
  user_id: string;
  name: string;
  rating: number;
  completed_jobs: number;
  earnings: number;
  zone: string;
  status: 'available' | 'busy' | 'offline';
}

export interface PricingRule {
  id: string;
  category: string;
  base_fee: number;
  emergency_multiplier: number;
  parts_markup_percent: number;
}
