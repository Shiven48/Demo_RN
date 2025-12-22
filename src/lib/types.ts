// API Types matching the React Native app
export interface ApiPaginatedResponse<T> {
  docs: T[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number | null;
  page: number;
  pagingCounter: number;
  prevPage: number | null;
  totalDocs: number;
  totalPages: number;
}

export interface ApiItem {
  id: number;
  itemCode: string;
  name: string;
  tagline: string;
  description: string;
  category: ApiCategory;
  productFamily: ApiProductFamily;
  features: Feature[];
  medicalIndications: string[];
  sizingScheme: ApiSizingScheme | null;
  variantGroup: unknown | null;
  anatomicalTags: string[];
  images: ImageMeta[];
  thumbnailUrl?: string;
  technicalAttributes: ApiTechnicalAttributes;
  stlFile: string | null;
  updatedAt: string;
  createdAt: string;
}

export interface ApiCategory {
  id: number;
  title: string;
  slug: string;
  description: string;
  productFamily: ApiProductFamily;
  image: string;
  updatedAt: string;
  createdAt: string;
}

export interface ApiProductFamily {
  id: number;
  name: string;
  description: string;
  commonFeatures: string;
  updatedAt: string;
  createdAt: string;
}

export interface ApiSizingScheme {
  id: number;
  name: string;
  numberOfSizes: number;
  sizeLabels: ApiSizeLabel[];
  notes: string;
  updatedAt: string;
  createdAt: string;
}

export interface ApiSizeLabel {
  id: string;
  label: string;
}

export interface ApiTechnicalAttributes {
  immobilizationAngles?: string;
  thumbPosition?: string;
  lockingIncrements?: string;
  degreesOfFreedom?: string;
  coveredAreas?: string;
  specialComponents?: string;
  weightBearing?: string;
  sole?: string;
  leftRightCompatibility?: string;
  [key: string]: string | undefined;
}

export interface ImageMeta {
  id: string;
  image: ImageObject;
  width: number;
  height: number;
}

export interface ImageObject {
  id: number;
  title: string;
  alt: string;
  updatedAt: string;
  createdAt: string;
  url: string;
  thumbnailURL: string | null;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
  focalX: number;
  focalY: number;
  sizes: {
    thumbnail: ImageSize;
    card: ImageSize;
    tablet: ImageSize;
  };
}

export interface ImageSize {
  url: string | null;
  width: number | null;
  height: number | null;
  mimeType: string | null;
  filesize: number | null;
  filename: string | null;
}

export interface Feature {
  id: number;
  name: string;
  explanation: string;
  updatedAt: string;
  createdAt: string;
}

// Mapped Product type (simplified for UI)
export interface Product {
  id: string;
  name: string;
  itemCode: string;
  description: string;
  tagline: string;
  imageUrl: string;
  images: string[];
  features: string[];
  category: string;
  productFamily: string;
  stlFile: string | null;
  customization: ProductCustomization;
  technicalAttributes: ApiTechnicalAttributes;
  medicalIndications?: string[];
  anatomicalTags?: string[];
  notes: string | null;
}

export interface ProductCustomization {
  sizes: string[];
  colors: string[];
}

export interface CartItem {
  id: number;
  user_id: string;
  product_id: number;
  product_name: string;
  quantity: number;
  selected_size: string;
  selected_color: string;
  image_url: string;
  features: string[];
  notes?: string;
  sizing_notes?: string;
  body_side: string;
  item_code: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_status: string;
  ordered_at: string;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: string;
  product_id: number;
  product_name: string;
  quantity: number;
  selected_size: string;
  selected_color: string;
  image_url: string;
  features: string[];
  notes?: string;
  sizing_notes?: string;
  body_side: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  docs: T[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number | null;
  page: number;
  pagingCounter: number;
  prevPage: number | null;
  totalDocs: number;
  totalPages: number;
}

export type ModalType = 'success' | 'error' | 'warning';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  designation?: string;
}
