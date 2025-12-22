import catalogueData from '../data/catalouge.json';
import type { ApiItem, CartItem, ImageMeta, Order, Product, User } from './types';

// Get catalogue from JSON
const getCatalogue = (): ApiItem[] => {
  return (catalogueData as { catalogue: ApiItem[] }).catalogue;
};

// Map API item to Product (same as React Native app)
function mapApiItemToProduct(item: ApiItem): Product {
  const features = item?.features?.map(feature => feature.name.trim()) || [];
  return {
    id: item.id.toString(),
    name: item.name,
    itemCode: item.itemCode,
    description: item.description || item.tagline,
    tagline: item.tagline,
    imageUrl: multiImageMapper(item?.images)[0] || '',
    images: multiImageMapper(item?.images),
    features: features,
    category: item.category?.title || '',
    productFamily: item.productFamily?.name || '',
    stlFile: item.stlFile,
    customization: {
      sizes: item.sizingScheme?.sizeLabels?.map((s) => s.label) || [],
      colors: ['White', 'Black'],
    },
    technicalAttributes: item.technicalAttributes || {},
    medicalIndications: item.medicalIndications || [],
    anatomicalTags: item.anatomicalTags || [],
    notes: item.sizingScheme?.notes || null,
  };
}

function multiImageMapper(images: ImageMeta[] | null): string[] {
  if (!images) return [];

  const urls = images.map(imageMeta => {
    const preferredUrl = imageMeta.image.sizes?.thumbnail?.url || imageMeta.image.url;
    return preferredUrl;
  });

  return urls.filter((url): url is string => url !== null && url !== undefined);
}

// Get all products mapped
export const getAllProducts = (): Product[] => {
  return getCatalogue().map(mapApiItemToProduct);
};

// Product families extracted from catalogue
export const productFamilies = [...new Set(getCatalogue().map(item => item.productFamily?.name).filter(Boolean))];

// Get categories for a specific product family
export function getCategoriesForFamily(productFamily: string): string[] {
  const familyItems = getCatalogue().filter(item => item.productFamily?.name === productFamily);
  let uniqueCategories = [...new Set(familyItems.map(item => item.category?.title).filter(Boolean))];
  
  // Remove Ankle from Turtle Ortho if present
  if (productFamily === 'Turtle Ortho') {
    uniqueCategories = uniqueCategories.filter(cat => cat !== 'Ankle');
  }

  const result = ['All', ...uniqueCategories];
  
  // Add Forearm back to Exo Range if missing
  if (productFamily === 'Exo Range' && !result.includes('Forearm')) {
    // Insert Forearm after Wrist or after All
    const wristIndex = result.indexOf('Wrist');
    if (wristIndex !== -1) {
      result.splice(wristIndex + 1, 0, 'Forearm');
    } else {
      result.splice(1, 0, 'Forearm');
    }
  }
  
  // Remove Metacarpals from Exo Range if present
  if (productFamily === 'Exo Range') {
    const metaIndex = result.indexOf('Metacarpals');
    if (metaIndex !== -1) {
      result.splice(metaIndex, 1);
    }
  }
  
  return result;
}

// All categories (for general use)
export const categories = ['All', ...new Set(getCatalogue().map(item => item.category?.title).filter(Boolean))];

// Mock user
export const mockUser: User = {
  id: 'user-1',
  email: 'doctor@livprint.com',
  full_name: 'Dr. Sarah Johnson',
  designation: 'Orthopedic Specialist',
};

// Store functions
export function getProducts(
  page = 1,
  limit = 10,
  category = 'All',
  productFamily = 'Exo Range'
) {
  const allItems = getCatalogue();
  let filtered = [];

  if (category === 'All') {
    // "All" shows everything in the catalogue
    filtered = allItems;
  } else {
    // Specific categories filter by both category and product family
    filtered = allItems.filter((item) => item.productFamily?.name === productFamily);

    // Filter out Ankle from Turtle Ortho (as per previous instruction)
    if (productFamily === 'Turtle Ortho') {
      filtered = filtered.filter(item => item.category?.title !== 'Ankle');
    }

    filtered = filtered.filter((item) => item.category?.title === category);
  }

  const mappedProducts = filtered.map(mapApiItemToProduct);
  const totalDocs = mappedProducts.length;
  const totalPages = Math.ceil(totalDocs / limit);
  const start = (page - 1) * limit;
  const docs = mappedProducts.slice(start, start + limit);

  return {
    docs,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    limit,
    nextPage: page < totalPages ? page + 1 : null,
    page,
    pagingCounter: start + 1,
    prevPage: page > 1 ? page - 1 : null,
    totalDocs,
    totalPages,
  };
}

export function getProductById(id: string): Product | undefined {
  const item = getCatalogue().find((p) => p.id.toString() === id);
  return item ? mapApiItemToProduct(item) : undefined;
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return getCatalogue()
    .filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.itemCode.toLowerCase().includes(lowerQuery) ||
        item.category?.title?.toLowerCase().includes(lowerQuery)
    )
    .map(mapApiItemToProduct);
}

// Cart functionality
let mockCartItems: CartItem[] = [];

export function getCartItems(): CartItem[] {
  return mockCartItems;
}

export function addToCart(item: Omit<CartItem, 'id' | 'created_at' | 'updated_at'>): CartItem {
  const existingIndex = mockCartItems.findIndex(
    (i) =>
      i.product_id === item.product_id &&
      i.selected_size === item.selected_size &&
      i.selected_color === item.selected_color &&
      i.body_side === item.body_side
  );

  if (existingIndex >= 0) {
    mockCartItems[existingIndex].quantity += item.quantity;
    mockCartItems[existingIndex].updated_at = new Date().toISOString();
    return mockCartItems[existingIndex];
  }

  const newItem: CartItem = {
    ...item,
    id: Date.now(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockCartItems.push(newItem);
  return newItem;
}

export function updateCartItemQuantity(cartItemId: number, quantity: number): void {
  const item = mockCartItems.find((i) => i.id === cartItemId);
  if (item) {
    item.quantity = quantity;
    item.updated_at = new Date().toISOString();
  }
}

export function removeFromCart(cartItemId: number): void {
  mockCartItems = mockCartItems.filter((i) => i.id !== cartItemId);
}

export function clearCart(): void {
  mockCartItems = [];
}

// Orders functionality
const mockOrders: Order[] = [
  {
    id: 'order-001-abc',
    user_id: 'user-1',
    order_status: 'pending',
    ordered_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(),
    items: [],
  },
  {
    id: 'order-002-def',
    user_id: 'user-1',
    order_status: 'completed',
    ordered_at: new Date(Date.now() - 604800000).toISOString(),
    created_at: new Date(Date.now() - 604800000).toISOString(),
    items: [],
  },
];

export function getOrders(): Order[] {
  return mockOrders;
}

export function checkout(): string {
  const orderId = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const newOrder: Order = {
    id: orderId,
    user_id: 'user-1',
    order_status: 'pending',
    ordered_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    items: mockCartItems.map((item, index) => ({
      id: index + 1,
      order_id: orderId,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      selected_size: item.selected_size,
      selected_color: item.selected_color,
      image_url: item.image_url,
      features: item.features,
      notes: item.notes,
      sizing_notes: item.sizing_notes,
      body_side: item.body_side,
      created_at: new Date().toISOString(),
    })),
  };
  mockOrders.unshift(newOrder);
  clearCart();
  return orderId;
}

export function cancelOrder(orderId: string): void {
  const order = mockOrders.find((o) => o.id === orderId);
  if (order) {
    order.order_status = 'cancelled';
  }
}
