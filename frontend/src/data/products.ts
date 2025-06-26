import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Canon EOS R5',
    brand: 'Canon',
    price: 3899,
    originalPrice: 4299,
    rating: 4.8,
    reviewCount: 127,
    image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/171203/pexels-photo-171203.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Cameras',
    subcategory: 'Mirrorless',
    description: 'Professional full-frame mirrorless camera with 45MP resolution and 8K video recording capabilities.',
    features: [
      '45MP Full-Frame CMOS Sensor',
      '8K DCI and UHD Video Recording',
      'Dual Pixel CMOS AF II',
      '12 fps Mechanical Shutter',
      'In-Body Image Stabilization'
    ],
    specifications: {
      'Sensor Type': 'Full-Frame CMOS',
      'Resolution': '45MP',
      'Video': '8K DCI/UHD',
      'ISO Range': '100-51200',
      'Weight': '650g'
    },
    inStock: true,
    stockCount: 12,
    isNew: true,
    isBestseller: true,
    compatibleWith: ['Canon RF Lenses', 'Canon EF Lenses (with adapter)']
  },
  {
    id: '2',
    name: 'Sony Alpha a7 IV',
    brand: 'Sony',
    price: 2498,
    rating: 4.7,
    reviewCount: 89,
    image: 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Cameras',
    subcategory: 'Mirrorless',
    description: 'Versatile full-frame camera perfect for both photography and videography with exceptional low-light performance.',
    features: [
      '33MP Full-Frame Sensor',
      '4K 60p Video Recording',
      '759-Point Phase Detection AF',
      '10 fps Continuous Shooting',
      '5-Axis Image Stabilization'
    ],
    specifications: {
      'Sensor Type': 'Full-Frame CMOS',
      'Resolution': '33MP',
      'Video': '4K 60p',
      'ISO Range': '100-51200',
      'Weight': '658g'
    },
    inStock: true,
    stockCount: 8,
    isBestseller: true,
    compatibleWith: ['Sony FE Lenses', 'Sony E-Mount Lenses']
  },
  {
    id: '3',
    name: 'Canon RF 24-70mm f/2.8L IS USM',
    brand: 'Canon',
    price: 2299,
    rating: 4.9,
    reviewCount: 156,
    image: 'https://images.pexels.com/photos/225157/pexels-photo-225157.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/225157/pexels-photo-225157.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Lenses',
    subcategory: 'Standard Zoom',
    description: 'Professional standard zoom lens with exceptional optical performance and 5-stop image stabilization.',
    features: [
      'Constant f/2.8 Maximum Aperture',
      '5-Stop Image Stabilization',
      'Weather-Sealed Construction',
      'Ultra-Low Dispersion Elements',
      'Nano USM Autofocus Motor'
    ],
    specifications: {
      'Focal Length': '24-70mm',
      'Maximum Aperture': 'f/2.8',
      'Minimum Focus': '0.21m',
      'Filter Thread': '82mm',
      'Weight': '900g'
    },
    inStock: true,
    stockCount: 15,
    compatibleWith: ['Canon RF Mount Cameras']
  },
  {
    id: '4',
    name: 'Nikon Z9',
    brand: 'Nikon',
    price: 5499,
    rating: 4.8,
    reviewCount: 73,
    image: 'https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Cameras',
    subcategory: 'Mirrorless',
    description: 'Flagship mirrorless camera with uncompromising performance for professional photographers and videographers.',
    features: [
      '45.7MP Stacked CMOS Sensor',
      '8K UHD Video Recording',
      '120 fps Continuous Shooting',
      'Dual CFexpress Card Slots',
      'Advanced Subject Detection'
    ],
    specifications: {
      'Sensor Type': 'Full-Frame Stacked CMOS',
      'Resolution': '45.7MP',
      'Video': '8K UHD',
      'ISO Range': '64-25600',
      'Weight': '1340g'
    },
    inStock: true,
    stockCount: 5,
    isNew: true,
    compatibleWith: ['Nikon Z Mount Lenses', 'Nikon F Mount Lenses (with adapter)']
  },
  {
    id: '5',
    name: 'Sony FE 70-200mm f/2.8 GM OSS II',
    brand: 'Sony',
    price: 2798,
    rating: 4.9,
    reviewCount: 94,
    image: 'https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Lenses',
    subcategory: 'Telephoto Zoom',
    description: 'Professional telephoto zoom lens with outstanding optical performance and advanced image stabilization.',
    features: [
      'Constant f/2.8 Maximum Aperture',
      'Optical SteadyShot Image Stabilization',
      'XA and Super-ED Elements',
      'Fast and Quiet Autofocus',
      'Dust and Moisture Resistant'
    ],
    specifications: {
      'Focal Length': '70-200mm',
      'Maximum Aperture': 'f/2.8',
      'Minimum Focus': '0.4m',
      'Filter Thread': '77mm',
      'Weight': '1045g'
    },
    inStock: true,
    stockCount: 7,
    compatibleWith: ['Sony FE Mount Cameras']
  },
  {
    id: '6',
    name: 'Fujifilm X-T5',
    brand: 'Fujifilm',
    price: 1699,
    rating: 4.6,
    reviewCount: 112,
    image: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Cameras',
    subcategory: 'Mirrorless',
    description: 'High-resolution APS-C mirrorless camera with classic design and exceptional image quality.',
    features: [
      '40.2MP APS-C X-Trans Sensor',
      '6.2K Video Recording',
      '7-Stop Image Stabilization',
      'Classic Film Simulation Modes',
      'Weather-Sealed Body'
    ],
    specifications: {
      'Sensor Type': 'APS-C X-Trans CMOS 5 HR',
      'Resolution': '40.2MP',
      'Video': '6.2K',
      'ISO Range': '125-12800',
      'Weight': '557g'
    },
    inStock: true,
    stockCount: 20,
    compatibleWith: ['Fujifilm X Mount Lenses']
  }
];

export const categories = [
  'All Categories',
  'Cameras',
  'Lenses',
  'Accessories',
  'Lighting',
  'Tripods',
  'Storage'
];

export const brands = [
  'All Brands',
  'Canon',
  'Sony',
  'Nikon',
  'Fujifilm',
  'Panasonic',
  'Olympus'
];