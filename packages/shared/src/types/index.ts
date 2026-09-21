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
  address?: string;
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
  clickCountGuest?: number;
  clickCountAuth?: number;
  viewCount?: number;
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

export interface WarrantyClaim {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  issueCategory: IssueCategory;
  description: string;
  solutionPreference: 'FREE_REPLACEMENT' | 'REFUND';
  status: WarrantyStatus;
  photoProofUrl?: string;
  videoProofUrl?: string;
  replacementAwb?: string;
  createdAt: string;
  adminNote?: string;
}

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

// ==============================================================================
// CAMPAIGN & LOYALTY GAMIFICATION ENGINE (PRD Seksi 18)
// ==============================================================================

export type CodSubsidyType = 'FREE_100' | 'DISCOUNT_50' | 'CUSTOM_PERCENT' | 'FLAT_AMOUNT';

export interface CampaignConfig {
  id: string;
  attendanceEnabled: boolean;
  dailyPointsReward: number;
  streakDaysTarget: number;
  streakRewardType: string;
  streakRewardValue: number;
  resetStreakOnMiss: boolean;
  stampCardEnabled: boolean;
  stampTargetCount: number;
  minSpendPerStamp: number;
  stampRewardType: string;
  stampRewardProductId?: string | null;
  stampExpiryDays: number;
  codPromoEnabled: boolean;
  codMaxRadiusKm: number;
  codSubsidyType: CodSubsidyType;
  codSubsidyValue: number;
  codMinSpend: number;
  codPromoBannerText: string;
  updatedAt?: string;
}

export interface UserAttendanceRecord {
  id: string;
  userPhone: string;
  checkInDate: string;
  pointsEarned: number;
  currentStreak: number;
  createdAt: string;
}

export interface UserStampCardState {
  id: string;
  userPhone: string;
  stampsCollected: number;
  targetStamps: number;
  cardStatus: 'ACTIVE' | 'COMPLETED' | 'REDEEMED' | 'EXPIRED';
  rewardClaimedAt?: string | null;
  lastStampedOrderId?: string | null;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ==============================================================================
// CUSTOMER BEHAVIOR TELEMETRY & CONVERSION OPTIMIZATION (PRD Seksi 19)
// ==============================================================================

export interface UserEventLogPayload {
  sessionId: string;
  userId?: string | null;
  eventName: string;
  stepNumber?: number | null;
  metadata?: Record<string, any> | null;
}

export interface SearchKeywordLogPayload {
  keyword: string;
  resultsCount: number;
  isZeroHit: boolean;
}

export interface CustomerOccasionItem {
  id?: string;
  userPhone: string;
  userName: string;
  recipientName: string;
  occasionTitle: string;
  eventDate: string;
  notes?: string | null;
  isReminded?: boolean;
  remindedAt?: string | null;
  createdAt?: string;
}

// ==============================================================================
// DYNAMIC CUSTOM STUDIO SUITE (PRD Seksi 26)
// ==============================================================================

export type CustomStudioCategory =
  | 'FLOWER_TYPE'
  | 'CHENILLE_COLOR'
  | 'WRAPPING_STYLE'
  | 'RIBBON_STYLE'
  | 'PACKAGING_BOX'
  | 'GREETING_SEAL'
  | 'ACCESSORY_ADDON';

export interface CustomStudioOption {
  id: string;
  category: CustomStudioCategory;
  name: string;
  description?: string | null;
  price_modifier: number;
  emoji_or_icon?: string | null;
  hex_color?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

// ==============================================================================
// CUSTOMER COMPLAINTS & QUALITY EVALUATION (PRD Seksi 30)
// ==============================================================================

export type ComplaintCategory =
  | 'KETERLAMBATAN_PENGIRIMAN'
  | 'KERUSAKAN_BUNGA'
  | 'KETIDAKSESUAIAN_PESANAN'
  | 'PELAYANAN_FLORIST'
  | 'LAINNYA';

export type ComplaintSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ComplaintStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';

export type ComplaintCompensation =
  | 'NONE'
  | 'VOUCHER_DISCOUNT'
  | 'REPLACEMENT_BOUQUET'
  | 'REFUND';

export interface CustomerComplaint {
  id: string;
  order_id?: string | null;
  customer_name: string;
  customer_phone: string;
  complaint_category: ComplaintCategory;
  description: string;
  evidence_photo_url?: string | null;
  severity: ComplaintSeverity;
  status: ComplaintStatus;
  resolution_notes?: string | null;
  compensation_type: ComplaintCompensation;
  compensation_amount: number;
  handled_by_admin_id?: string | null;
  created_at: string;
  resolved_at?: string | null;
}

export interface CreateComplaintPayload {
  order_id?: string | null;
  customer_name: string;
  customer_phone: string;
  complaint_category: ComplaintCategory;
  description: string;
  evidence_photo_url?: string | null;
}

export interface UpdateComplaintPayload {
  status?: ComplaintStatus;
  severity?: ComplaintSeverity;
  resolution_notes?: string | null;
  compensation_type?: ComplaintCompensation;
  compensation_amount?: number;
  handled_by_admin_id?: string | null;
}

export interface ComplaintMetrics {
  total_complaints: number;
  resolved_complaints: number;
  pending_complaints: number;
  complaint_rate_pct: number;
  mttr_hours: number;
  category_breakdown: Record<ComplaintCategory, number>;
}

// ==============================================================================
// GRANULAR DATABASE RESET SUITE (PRD Seksi 30)
// ==============================================================================

export interface GranularResetOptions {
  delete_transactions: boolean;
  delete_logistics: boolean;
  delete_complaints: boolean;
  delete_loyalty_data: boolean;
  delete_customer_accounts: boolean;
  reset_master_catalog: boolean;
  delete_complaint_asset_files: boolean;
  delete_warranty_asset_files: boolean;
  delete_custom_studio_asset_files: boolean;
}

export interface GranularResetRequest {
  verification_phrase: string;
  reset_options: GranularResetOptions;
}

export interface GranularResetResponse {
  success: boolean;
  message: string;
  data?: {
    tables_affected: Record<string, string>;
    storage_files_deleted: number;
    admin_account_preserved: string;
    executed_at: string;
  };
}
