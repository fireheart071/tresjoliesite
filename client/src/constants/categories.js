export const ALL_CATEGORIES = [
  { 
    name: 'Clothing', 
    path: '/clothing', 
    description: 'Timeless pieces for your everyday and special wardrobe.',
    cta: 'Browse Clothing'
  },
  { 
    name: 'Jewelry', 
    path: '/jewelry', 
    description: 'Handpicked accessories and statements to complete your look.',
    cta: 'Explore Jewelry'
  },
  { 
    name: 'Hats', 
    path: '/hats', 
    description: 'Elegant headwear for any occasion, from casual to formal.',
    cta: 'View Hats'
  },
  { 
    name: 'Fascinators', 
    path: '/fascinators', 
    description: 'Exquisite, bespoke pieces for weddings and royal events.',
    cta: 'Browse Fascinators'
  },
  { 
    name: 'Turbans', 
    path: '/turbans', 
    description: 'Stylish and comfortable turbans with a modern twist.',
    cta: 'Shop Turbans'
  },
  { 
    name: 'Gele', 
    path: '/gele', 
    description: 'Traditional and contemporary Gele for the ultimate statement.',
    cta: 'Select Gele'
  },
  { 
    name: 'Florals', 
    path: '/florals', 
    description: 'Beautifully crafted floral accessories for a touch of nature.',
    cta: 'Explore Florals'
  },
];

export const MAIN_CATEGORIES = ALL_CATEGORIES.slice(0, 2);
export const EXTRA_CATEGORIES = ALL_CATEGORIES.slice(2);
