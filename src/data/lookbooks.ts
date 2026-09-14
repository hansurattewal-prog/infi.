import { LookbookTheme } from '../types';

export const LOOKBOOK_COLLECTIONS: LookbookTheme[] = [
  {
    id: 'midnight-gala',
    title: 'The Midnight Gala Edit',
    tagline: 'Deep Obsidian Velvet & Architectural Luminescence',
    description: 'An exploration of shadow and sculptural silhouettes designed for grand ballrooms, autumn galas, and high-jewelry evening occasions.',
    occasion: 'Black Tie & Gala',
    coverImage: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=85',
    editorialQuote: '“True formalwear does not compete with the wearer; it anchors her commanding presence in timeless dark harmony.”',
    curator: 'Hélène Vance, Infi Senior Creative Couturier',
    galleryImages: [
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=800&q=80',
    ],
    dressIds: ['infi-02', 'infi-06', 'infi-01'],
  },
  {
    id: 'riviera-champagne',
    title: 'Riviera & Champagne Soirée',
    tagline: 'Liquid Mulberry Silks & Bias-Cut Drapery',
    description: 'Effortless fluid luxury inspired by twilight along the Côte d’Azur. Silks that ripple like molten gold across candlelit terraces.',
    occasion: 'Cocktail & Destination',
    coverImage: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1200&q=85',
    editorialQuote: '“When silk is cut on the true bias, it becomes second skin—responsive to every breath and movement.”',
    curator: 'Armaan Mehta, Head of Textile Innovation',
    galleryImages: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
    ],
    dressIds: ['infi-03', 'infi-05', 'infi-01'],
  },
  {
    id: 'modern-haute-bride',
    title: 'Modern Haute Bride & Rehearsal',
    tagline: 'French Corded Chantilly & Pure Alabaster Georgette',
    description: 'Curated for the modern bride seeking distinctive tailoring for grand rehearsal dinners, red carpets, and bespoke wedding galas.',
    occasion: 'Bridal & Gala',
    coverImage: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1200&q=85',
    editorialQuote: '“Elegance is refusal. No unnecessary crinoline—only pristine lace placement and immaculate anatomical drape.”',
    curator: 'Clara Delacroix, Bespoke Bridal Director',
    galleryImages: [
      'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
    ],
    dressIds: ['infi-04', 'infi-01', 'infi-03'],
  },
];

export const LOOKBOOKS = LOOKBOOK_COLLECTIONS;
