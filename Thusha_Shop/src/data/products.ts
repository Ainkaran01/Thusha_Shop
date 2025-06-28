import { Product, Review } from "@/types";

export const reviews: Review[] = [
  {
    id: 1,
    productId: 1,
    rating: 5,
    comment: "These are the best sunglasses I've ever owned! Great quality and stylish.",
    userName: "Alice Johnson",
    date: "2024-01-15",
    title: "Excellent Quality",
    verified: true,
    helpful: 12
  },
  {
    id: 2,
    productId: 1,
    rating: 4,
    comment: "Good sunglasses for the price. They fit well and look great.",
    userName: "Bob Smith",
    date: "2024-02-01",
    title: "Good Value",
    verified: true,
    helpful: 8
  },
  {
    id: 3,
    productId: 2,
    rating: 3,
    comment: "The frames are okay, but the lenses scratch easily.",
    userName: "Charlie Brown",
    date: "2024-02-15",
    title: "Average Quality",
    verified: false,
    helpful: 3
  },
  {
    id: 4,
    productId: 2,
    rating: 5,
    comment: "I love these frames! They're so comfortable and stylish.",
    userName: "Diana Miller",
    date: "2024-03-01",
    title: "Love These Frames",
    verified: true,
    helpful: 15
  },
  {
    id: 5,
    productId: 3,
    rating: 4,
    comment: "Great value for the price. The frames are sturdy and look good.",
    userName: "Ethan Davis",
    date: "2024-03-15",
    title: "Great Value",
    verified: true,
    helpful: 6
  },
  {
    id: 6,
    productId: 3,
    rating: 2,
    comment: "The frames broke after only a few months of use. Not durable.",
    userName: "Fiona Wilson",
    date: "2024-04-01",
    title: "Not Durable",
    verified: true,
    helpful: 4
  },
  {
    id: 7,
    productId: 4,
    rating: 5,
    comment: "These are the most stylish frames I've ever owned! I get compliments all the time.",
    userName: "George Taylor",
    date: "2024-04-15",
    title: "Very Stylish",
    verified: true,
    helpful: 20
  },
  {
    id: 8,
    productId: 4,
    rating: 4,
    comment: "Good quality frames for the price. They fit well and look great.",
    userName: "Hannah White",
    date: "2024-05-01",
    title: "Good Quality",
    verified: false,
    helpful: 7
  }
];

export const products: Product[] = [
  {
    id: 1,
    name: "Gray Transparent Full Rim Round",
    description: "Timeless aviator sunglasses with premium UV protection",
    price:5399.99,
    images: ["images/r1.png"],
    category: "sunglasses",
    inStock: true,
    ratings: 4.5,
    reviewCount: 128,
    frameType: "aviator",
    frameMaterial: "metal",
    color: "gold",
    size: "58-14-140",
    weight: "25g",
    features: ["UV400 Protection", "Polarized Lenses", "Adjustable Nose Pads"],
    recommendedFaceShapes: ["oval", "square", "heart"],
    recommendedVisionProblems: ["nearsighted", "farsighted"]
  },
  {
    id: 2,
    name: "Dark Gunmetal Half Rim Rectangle",
    description: "Contemporary square frames perfect for professional settings",
    price: 3999.99,
    images: ["images/f1.jpg"],
    category: "eyeglasses",
    inStock: true,
    ratings: 4.7,
    reviewCount: 89,
    frameType: "square",
    frameMaterial: "acetate",
    color: "black",
    size: "52-18-145",
    weight: "18g",
    features: ["Lightweight Design", "Spring Hinges", "Anti-Slip Nose Pads"],
    recommendedFaceShapes: ["round", "oval"],
    recommendedVisionProblems: ["nearsighted", "astigmatism"]
  },
  {
    id: 5,
    name: "Black Rimless Aviator",
    description: "Complete cleaning kit with microfiber cloths, cleaning solution, and carrying case",
    price: 4500.00,
    images: ["images/f2.jpg"],
    category: "accessories",
    inStock: true,
    ratings: 4.6,
    reviewCount: 234,
    frameType: "accessory",
    frameMaterial: "various",
    color: "blue",
    size: "Standard",
    weight: "150g",
    features: ["Microfiber Cloths", "Cleaning Solution", "Portable Case", "Lint-Free"],
    recommendedFaceShapes: ["oval", "round", "square", "heart", "diamond", "triangle", "oblong"],
    recommendedVisionProblems: ["nearsighted", "farsighted", "astigmatism", "presbyopia"]
  },
  {
    id: 6,
    name: "Gray Transparent Full Rim Square",
    description: "Professional-grade anti-fog spray for all types of lenses",
    price: 4500.00,
    images: ["images/f3.jpg"],
    category: "accessories",
    inStock: true,
    ratings: 4.4,
    reviewCount: 167,
    frameType: "accessory",
    frameMaterial: "spray",
    color: "clear",
    size: "50ml",
    weight: "75g",
    features: ["Long-Lasting Protection", "Safe for All Coatings", "Easy Application", "Travel Size"],
    recommendedFaceShapes: ["oval", "round", "square", "heart", "diamond", "triangle", "oblong"],
    recommendedVisionProblems: ["nearsighted", "farsighted", "astigmatism", "presbyopia"]
  },
  {
    id: 7,
    name: "UV Protection Lens Cleaner",
    description: "Specialized cleaner that maintains UV coating while removing smudges and dirt",
    price: 15.99,
    images: ["/placeholder.svg", "/placeholder.svg"],
    category: "accessories",
    inStock: true,
    ratings: 4.7,
    reviewCount: 145,
    frameType: "accessory",
    frameMaterial: "solution",
    color: "blue",
    size: "100ml",
    weight: "120g",
    features: ["UV Coating Safe", "Streak-Free Formula", "Antibacterial", "Eco-Friendly"],
    recommendedFaceShapes: ["oval", "round", "square", "heart", "diamond", "triangle", "oblong"],
    recommendedVisionProblems: ["nearsighted", "farsighted", "astigmatism", "presbyopia"]
  },
  {
    id: 8,
    name: "Adjustable Eyeglass Chain",
    description: "Stylish and functional chain to keep your glasses secure and accessible",
    price: 24.99,
    images: ["/placeholder.svg", "/placeholder.svg"],
    category: "accessories",
    inStock: true,
    ratings: 4.2,
    reviewCount: 89,
    frameType: "accessory",
    frameMaterial: "metal",
    color: "silver",
    size: "Adjustable",
    weight: "15g",
    features: ["Adjustable Length", "Secure Grips", "Stylish Design", "Lightweight"],
    recommendedFaceShapes: ["oval", "round", "square", "heart", "diamond", "triangle", "oblong"],
    recommendedVisionProblems: ["nearsighted", "farsighted", "astigmatism", "presbyopia"]
  },
  {
    id: 9,
    name: "Blue Light Blocking Screen Wipes",
    description: "Pre-moistened wipes designed for screens and blue light blocking lenses",
    price: 8.99,
    images: ["/placeholder.svg", "/placeholder.svg"],
    category: "accessories",
    inStock: true,
    ratings: 4.3,
    reviewCount: 201,
    frameType: "accessory",
    frameMaterial: "wipes",
    color: "white",
    size: "30 pack",
    weight: "100g",
    features: ["Pre-Moistened", "Safe for Blue Light Coatings", "Individually Wrapped", "Streak-Free"],
    recommendedFaceShapes: ["oval", "round", "square", "heart", "diamond", "triangle", "oblong"],
    recommendedVisionProblems: ["nearsighted", "farsighted", "astigmatism", "presbyopia"]
  },
  {
    id: 10,
    name: "Magnetic Eyeglass Holder",
    description: "Convenient magnetic holder for your desk, car, or any metal surface",
    price: 16.99,
    images: ["/placeholder.svg", "/placeholder.svg"],
    category: "accessories",
    inStock: true,
    ratings: 4.5,
    reviewCount: 112,
    frameType: "accessory",
    frameMaterial: "magnetic",
    color: "black",
    size: "5cm x 3cm",
    weight: "50g",
    features: ["Strong Magnets", "Scratch-Resistant Padding", "Compact Design", "Universal Fit"],
    recommendedFaceShapes: ["oval", "round", "square", "heart", "diamond", "triangle", "oblong"],
    recommendedVisionProblems: ["nearsighted", "farsighted", "astigmatism", "presbyopia"]
  },
  {
    id: 11,
    name: "Lens Repair Kit",
    description: "Emergency repair kit with screws, nose pads, and mini screwdriver",
    price: 13.99,
    images: ["/placeholder.svg", "/placeholder.svg"],
    category: "accessories",
    inStock: true,
    ratings: 4.1,
    reviewCount: 78,
    frameType: "accessory",
    frameMaterial: "various",
    color: "silver",
    size: "Compact",
    weight: "80g",
    features: ["Mini Screwdriver", "Assorted Screws", "Replacement Nose Pads", "Portable Case"],
    recommendedFaceShapes: ["oval", "round", "square", "heart", "diamond", "triangle", "oblong"],
    recommendedVisionProblems: ["nearsighted", "farsighted", "astigmatism", "presbyopia"]
  },
  {
    id: 12,
    name: "Microfiber Cleaning Cloths (5-Pack)",
    description: "High-quality microfiber cloths perfect for lens cleaning",
    price: 11.99,
    images: ["/placeholder.svg", "/placeholder.svg"],
    category: "accessories",
    inStock: true,
    ratings: 4.8,
    reviewCount: 345,
    frameType: "accessory",
    frameMaterial: "microfiber",
    color: "assorted",
    size: "15cm x 15cm",
    weight: "25g",
    features: ["Lint-Free", "Washable", "Scratch-Safe", "Multiple Colors"],
    recommendedFaceShapes: ["oval", "round", "square", "heart", "diamond", "triangle", "oblong"],
    recommendedVisionProblems: ["nearsighted", "farsighted", "astigmatism", "presbyopia"]
  },
  {
    id: 3,
    name: "Round Vintage",
    description: "Vintage-inspired round frames with a modern twist",
    price: 99.99,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    category: "eyeglasses",
    inStock: true,
    ratings: 4.3,
    reviewCount: 156,
    frameType: "round",
    frameMaterial: "metal",
    color: "bronze",
    size: "48-20-140",
    weight: "22g",
    features: ["Retro Design", "Durable Metal Frame", "Comfortable Fit"],
    recommendedFaceShapes: ["square", "heart", "diamond"],
    recommendedVisionProblems: ["farsighted", "presbyopia"]
  },
  {
    id: 4,
    name: "Cat-Eye Chic",
    description: "Elegant cat-eye frames for a sophisticated look",
    price: 149.99,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    category: "eyeglasses",
    inStock: false,
    ratings: 4.8,
    reviewCount: 92,
    frameType: "cat-eye",
    frameMaterial: "acetate",
    color: "tortoiseshell",
    size: "52-16-140",
    weight: "20g",
    features: ["Premium Acetate", "Hand-Polished", "Adjustable Temples"],
    recommendedFaceShapes: ["round", "heart", "diamond"],
    recommendedVisionProblems: ["nearsighted", "farsighted", "astigmatism"]
  }
];

export const faceShapeGuide = {
  oval: {
    description: "Oval faces are considered the ideal face shape with balanced proportions.",
    characteristics: ["Slightly wider at the cheekbones", "Forehead slightly wider than chin", "Balanced proportions"],
    recommendedFrames: ["Most frame styles work", "Angular frames add definition", "Cat-eye shapes"],
    avoidFrames: ["Oversized frames", "Very narrow frames"],
    image: "https://www.detect-face-shape.com/static/images/shapes/oval.svg"
  },
  round: {
    description: "Round faces have soft curves with similar width and length.",
    characteristics: ["Equal width and length", "Soft, curved lines", "Full cheeks"],
    recommendedFrames: ["Angular frames", "Square shapes", "Rectangle frames"],
    avoidFrames: ["Round frames", "Small frames", "Oversized round styles"],
    image: "https://www.detect-face-shape.com/static/images/shapes/round.svg"
  },
  square: {
    description: "Square faces feature strong, angular jawlines and broad foreheads.",
    characteristics: ["Strong jawline", "Broad forehead", "Angular features"],
    recommendedFrames: ["Round frames", "Oval shapes", "Cat-eye styles"],
    avoidFrames: ["Square frames", "Angular styles", "Geometric shapes"],
    image: "https://www.detect-face-shape.com/static/images/shapes/square.svg"
  },
  heart: {
    description: "Heart-shaped faces are wider at the forehead and narrow at the chin.",
    characteristics: ["Wide forehead", "Narrow chin", "High cheekbones"],
    recommendedFrames: ["Bottom-heavy frames", "Cat-eye shapes", "Round frames"],
    avoidFrames: ["Top-heavy frames", "Very wide frames"],
    image: "https://www.detect-face-shape.com/static/images/shapes/heart-shaped.svg"
  },
  diamond: {
    description: "Diamond faces are widest at the cheekbones with narrow forehead and chin.",
    characteristics: ["Narrow forehead and chin", "Wide cheekbones", "Angular features"],
    recommendedFrames: ["Cat-eye frames", "Oval shapes", "Rimless styles"],
    avoidFrames: ["Narrow frames", "Small styles"],
    image: "https://www.detect-face-shape.com/static/images/shapes/diamond.svg"
  },
  triangle: {
    description: "Triangle faces are wider at the jaw and narrow at the forehead.",
    characteristics: ["Narrow forehead", "Wide jawline", "Broader lower face"],
    recommendedFrames: ["Top-heavy frames", "Cat-eye styles", "Aviator shapes"],
    avoidFrames: ["Bottom-heavy frames", "Wide frames at bottom"],
    image: "https://www.detect-face-shape.com/static/images/shapes/triangle.svg"
  },
  oblong: {
    description: "Oblong faces are longer than they are wide with balanced proportions.",
    characteristics: ["Face longer than wide", "Balanced width", "Long face shape"],
    recommendedFrames: ["Wide frames", "Deep frames", "Oversized styles"],
    avoidFrames: ["Narrow frames", "Small frames", "Very thin styles"],
    image: "https://www.detect-face-shape.com/static/images/shapes/oblong.svg"
  }
};

export const orders = [
  {
    id: "ord-12345",
    userId: "user-1",
    items: [
      {
        productId: 1,
        quantity: 1,
        price: 89.99
      }
    ],
    totalAmount: 89.99,
    status: "shipped",
    shippingAddress: {
      fullName: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      phone: "(555) 123-4567"
    },
    paymentMethod: "Credit Card",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-16",
    estimatedDelivery: "2024-01-20",
    trackingNumber: "TRK123456789"
  },
  {
    id: "ord-67890",
    userId: "user-1",
    items: [
      {
        productId: 2,
        quantity: 1,
        price: 129.99
      }
    ],
    totalAmount: 129.99,
    status: "delivered",
    shippingAddress: {
      fullName: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      phone: "(555) 123-4567"
    },
    paymentMethod: "Credit Card",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-12",
    estimatedDelivery: "2024-01-15",
    trackingNumber: "TRK987654321"
  }
];
