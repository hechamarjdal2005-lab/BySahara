# Product Card Customization Guide

## Overview
The product card display is now fully customizable. You can choose which information appears on each product card without modifying any component code.

## Location
`src/config/productCardConfig.ts`

## Available Fields

### 1. **cooperativeName** (Cooperative Badge)
- **Default:** `true` (shown)
- Shows the cooperative name at the top center of the card
- Example: "Atlas Women Cooperative"

### 2. **origin** (Location Badge)
- **Default:** `true` (shown)
- Shows the geographic origin with 📍 emoji
- Example: "📍 Guelmim"

### 3. **unit** (Volume/Weight Badge)
- **Default:** `true` (shown)
- Shows the product's volume (for liquids) or weight (for solids)
- Example: "500g jar", "250ml bottle", "1kg bag"
- **Best for:** Highlighting quantity/size information

### 4. **rating** (Star Rating Badge)
- **Default:** `true` (shown)
- Shows the product's star rating in the bottom-right corner
- Example: ⭐ 4.5

### 5. **reviewCount** (Number of Reviews)
- **Default:** `false` (hidden)
- Shows how many reviews the product has
- Example: "(12 reviews)"
- **Note:** Only shows if rating is also enabled

### 6. **isNew** (New Badge)
- **Default:** `true` (shown)
- Shows "New" badge for newly added products
- Only appears if product is marked as `isNew`

### 7. **isFeatured** (Featured Badge)
- **Default:** `true` (shown)
- Shows "Featured" badge for highlighted products
- Only appears if product is marked as `isFeatured` (and not New)

### 8. **stock** (Inventory Count)
- **Default:** `false` (hidden)
- Shows available quantity or "Out of stock" message
- Example: "In stock: 12"
- **Best for:** Inventory management display

### 9. **price** 
- **Not configurable** - Always shown on every card

## How to Customize

### Hide a Field
Change the value from `true` to `false`:

```typescript
export const productCardConfig = {
  cooperativeName: false,    // Hide cooperative name
  origin: true,
  unit: true,
  rating: true,
  // ...
};
```

### Show a Field
Change the value from `false` to `true`:

```typescript
export const productCardConfig = {
  cooperativeName: true,
  origin: true,
  unit: true,
  rating: true,
  stock: true,    // Now show stock levels
  // ...
};
```

## Example Configurations

### Minimal Card (Product + Price Only)
```typescript
export const productCardConfig = {
  cooperativeName: false,
  origin: false,
  unit: false,
  rating: false,
  reviewCount: false,
  isNew: false,
  isFeatured: false,
  stock: false,
};
```

### Complete Card (All Information)
```typescript
export const productCardConfig = {
  cooperativeName: true,
  origin: true,
  unit: true,
  rating: true,
  reviewCount: true,
  isNew: true,
  isFeatured: true,
  stock: true,
};
```

### Shop-Focused (Emphasis on Size/Weight)
```typescript
export const productCardConfig = {
  cooperativeName: true,
  origin: false,
  unit: true,        // Highlighted
  rating: true,
  reviewCount: false,
  isNew: true,
  isFeatured: true,
  stock: true,       // Show availability
};
```

### Support-Focused (Cooperative Emphasis)
```typescript
export const productCardConfig = {
  cooperativeName: true,    // Highlighted
  origin: true,             // Show where from
  unit: true,
  rating: true,
  reviewCount: true,
  isNew: true,
  isFeatured: true,
  stock: false,
};
```

## Changes Take Effect Immediately
Once you save changes to `productCardConfig.ts`:
1. The development server will hot-reload
2. All product cards across the site will update automatically
3. No need to restart or rebuild

## Reverting Changes
If you want to restore the default configuration, replace the entire file with the default settings shown in the file header.

## Questions?
The config file includes helpful comments and a quick customization guide at the bottom. Review those for additional context on each field.
