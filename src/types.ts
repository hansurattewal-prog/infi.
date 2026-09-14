export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface AccessoryItem {
  id: string;
  name: string;
  category: 'jewelry' | 'bag' | 'shoes' | 'wrap';
  priceINR: number;
  image: string;
  description: string;
}

export interface Dress {
  id: string;
  name: string;
  subtitle: string;
  priceINR: number;
  originalPriceINR?: number;
  category: 'Evening Gowns' | 'Cocktail & Reception' | 'Bridal & Gala' | 'Black Tie' | 'Silk Slip';
  occasion: 'Gala' | 'Cocktail' | 'Wedding Guest' | 'Black Tie' | 'Red Carpet' | 'Soirée';
  silhouette: 'A-Line' | 'Column / Sheath' | 'Mermaid' | 'Ball Gown' | 'Bias Cut' | 'Cowl Neck';
  fabric: string;
  lining: string;
  careInstructions: string;
  description: string;
  designerNote: string;
  colors: ProductColor[];
  sizes: string[];
  images: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  rating: number;
  reviewsCount: number;
  completeTheLook: AccessoryItem[];
}

export interface BodyMeasurements {
  unit: 'in' | 'cm';
  bust: number;
  waist: number;
  hips: number;
  hollowToHem: number;
  shoulderWidth?: number;
  neckCircumference?: number;
  sleeveLength?: number;
  armhole?: number;
  heelHeight?: number;
  fullHeight?: number;
}

export interface BespokeCustomization {
  silhouette: string;
  fabric: string;
  colorName: string;
  colorHex: string;
  neckline: string;
  sleeveStyle: string;
  embellishments: string[];
  slitHeight: string;
  trainLength: string;
  measurements: BodyMeasurements;
  specialRequests: string;
  isMadeToMeasure: boolean;
  baseDressId?: string;
  baseDressName?: string;
  estimatedWeeks: number;
  customPriceINR: number;
}

export interface CartItem {
  id: string;
  dressId: string;
  name: string;
  priceINR: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  isCustom?: boolean;
  bespokeDetails?: BespokeCustomization;
  accessoryItems?: AccessoryItem[];
}

export interface LookbookTheme {
  id: string;
  title: string;
  tagline: string;
  description: string;
  occasion: string;
  coverImage: string;
  editorialQuote: string;
  curator: string;
  galleryImages: string[];
  dressIds: string[];
}

export interface ReturnRequest {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerPhone: string;
  reason: string;
  preferredResolution: 'refund' | 'store_credit_bonus' | 'exchange';
  itemNames: string;
  conditionConfirmed: boolean;
  status: 'Approved' | 'In Review' | 'Label Generated';
  createdDate: string;
  labelCode: string;
}

export interface OrderConfirmationData {
  orderId: string;
  items: CartItem[];
  subtotalINR: number;
  discountINR: number;
  shippingINR: number;
  totalINR: number;
  shippingDetails: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    fulfillmentType: 'white_glove_courier' | 'atelier_pickup';
  };
  paymentMethod: 'upi' | 'card' | 'apple_pay' | 'paypal' | 'netbanking';
  paymentDetailsSummary: string;
  estimatedDelivery: string;
  createdDate: string;
}

export interface UserQuizPreferences {
  occasion?: string;
  silhouette?: string;
  mood?: string;
  fitPriority?: string;
  completedAt?: number;
}

export interface BrowsingHistoryItem {
  dressId: string;
  viewedAt: number;
  viewCount: number;
}

export interface PastPurchaseItem {
  orderId: string;
  dressIds: string[];
  totalINR: number;
  date: string;
  primaryOccasion?: string;
}

export interface UserBehaviorProfile {
  browsingHistory: BrowsingHistoryItem[];
  cartDressIds: string[];
  wishlistDressIds: string[];
  pastPurchases: PastPurchaseItem[];
  quizPreferences?: UserQuizPreferences;
}

export interface RecommendedDressItem {
  dress: Dress;
  matchScore: number;
  reason: string;
  curatorTag: string;
}

export interface RecommendedAccessoryItem {
  accessory: AccessoryItem;
  matchScore: number;
  reason: string;
  pairedCategory?: string;
}

export interface AIRecommendationsResponse {
  personaSummary: string;
  confidenceScore: number;
  primaryOccasion: string;
  preferredSilhouette: string;
  dresses: RecommendedDressItem[];
  accessories: RecommendedAccessoryItem[];
  stylistNote: string;
}

export interface TargetedEmailCampaign {
  campaignId: string;
  clientName: string;
  clientEmail: string;
  subjectLine: string;
  preheader: string;
  heroTagline: string;
  personalSalutation: string;
  couturierNote: string;
  recommendedDresses: Array<{
    dress: Dress;
    exclusiveNote: string;
    matchScore: number;
  }>;
  recommendedAccessories: Array<{
    accessory: AccessoryItem;
    pairReason: string;
  }>;
  privateInvitationCode: string;
  vipBenefit: string;
  generatedDate: string;
}
