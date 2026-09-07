export type Role = 'SUPER_ADMIN' | 'FLORIST_STAFF' | 'CUSTOMER_MEMBER';

export type ThemeKey = 'tema-a' | 'tema-b' | 'tema-c';

export type OrderFulfillment = 'COURIER_EXPEDITION' | 'COD_MEETUP_POINT';

export type OrderStepStatus =
  | 'PAYMENT_CONFIRMED'
  | 'CRAFTING_BOUQUET'
  | 'QUALITY_CHECK_PASSED'
  | 'IN_DELIVERY'
  | 'COMPLETED'
  | 'CANCELLED';

export interface UserProfile {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: Role;
  avatarEmoji: string;
  flowerPoints: number;
}

export interface CodPoint {
  id: string;
  name: string;
  fullAddress: string;
  googleMapsUrl: string;
  embedQuery?: string;
  distanceKm: number;
  deliveryNotes?: string;
  isActive: boolean;
}

export interface BomItem {
  id: string;
  rawMaterialName: string;
  category: 'KAWAT_BULU' | 'CELLOPHANE' | 'PITA' | 'ACCESSORY';
  unit: string;
  unitPrice: number;
  quantityNeeded: number;
  subtotalCost: number;
}

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  discountPrice?: number;
  rawCostHpp: number;
  stock: number;
  poLeadDays: number;
  clickCount: number;
  isReadyStock: boolean;
  isActive: boolean;
}

export interface OrderItemPayload {
  productId: string;
  quantity: number;
  unitPrice: number;
  itemHpp: number;
  notes?: string;
}

export interface CreateOrderPayload {
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  fulfillmentType: OrderFulfillment;
  codPointId?: string;
  shippingAddress?: string;
  items: OrderItemPayload[];
}

export interface LiveChatMessage {
  id: string;
  sessionId: string;
  sender: 'CUSTOMER' | 'BOT' | 'FLORIST_ADMIN';
  text: string;
  sentAt: string;
}

export type WarrantyStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED_REPLACE'
  | 'REJECTED'
  | 'RESOLVED';

export type IssueCategory =
  | 'TRANSIT_DAMAGE_CRUSHED'
  | 'WRONG_PRODUCT_VARIANT'
  | 'WRONG_GREETING_CARD'
  | 'PACKAGE_LOST_EXPEDITION';

export interface WarrantyClaimPayload {
  orderId: string;
  customerPhone: string;
  issueCategory: IssueCategory;
  description: string;
  videoProofUrl?: string;
  photoProofUrl?: string;
}

export interface FeatureToggleItem {
  key: string;
  name: string;
  description: string;
  isEnabled: boolean;
}

export interface CustomerFaqItem {
  id: string;
  category: 'INVOICE_LOST' | 'FLOWER_CARE' | 'PO_SCHEDULE' | 'COD_RULES';
  question: string;
  answer: string;
  sortOrder: number;
}

export interface ThemeDefinition {
  id: string;
  name: string;
  badge: string;
  colors: {
    primary: string;
    primaryLight: string;
    bgPage: string;
    bgCard: string;
    textMain: string;
    textMuted: string;
    border: string;
    accent: string;
  };
  typography: {
    fontHeading: string;
    fontBody: string;
  };
  radii: {
    card: string;
    button: string;
  };
}

