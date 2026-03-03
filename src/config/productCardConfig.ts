/**
 * Product Card Configuration
 * 
 * Customize which fields are displayed on product cards.
 * Simply set each field to `true` to display it or `false` to hide it.
 * 
 * Available fields:
 * - cooperativeName: Shows the cooperative that produces the product
 * - origin: Shows the geographic origin of the product
 * - unit: Shows the volume (L, ml) or weight (kg, g) of the product
 * - rating: Shows the star rating of the product
 * - isNew & isFeatured: Shows "New" or "Featured" badges
 * - stock: Shows available quantity
 */

export const productCardConfig = {
  // Product Information
  cooperativeName: true,      // Show cooperative name at top of card
  origin: true,               // Show origin location (e.g., "📍 Guelmim")
  unit: true,                 // Show unit/size badge (e.g., "500g jar", "250ml bottle")
  
  // Ratings and Reviews
  rating: true,               // Show star rating in bottom corner
  reviewCount: false,         // Show number of reviews (optional)
  
  // Status Badges
  isNew: true,                // Show "New" badge
  isFeatured: true,           // Show "Featured" badge
  
  // Inventory
  stock: false,               // Show stock count (e.g., "In stock: 12")
  
  // Price (always shown, cannot be hidden)
  // price: true,             // Always displayed - not configurable
};

/**
 * QUICK CUSTOMIZATION GUIDE:
 * 
 * To hide cooperative name on cards:
 *   cooperativeName: false
 * 
 * To show stock levels:
 *   stock: true
 * 
 * To hide rating badges:
 *   rating: false
 * 
 * To show review counts:
 *   reviewCount: true
 * 
 * To hide origin information:
 *   origin: false
 * 
 * To hide unit/size badges:
 *   unit: false
 * 
 * Simply change true/false values above and the cards will update automatically!
 */
