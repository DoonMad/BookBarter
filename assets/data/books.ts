export type Book = {
  id: number;
  title: string;
  author: string;
  images: string[]; // Replaces `image`
  condition: 'Like New' | 'Good' | 'Fair' | 'Poor';
  location: string;
  owner: {
    name: string;
    email: string;
    phone?: string; // Optional
  };
  intent: 'Giveaway' | 'Exchange';
  description?: string;
  tags?: string[];
};

const books: Book[] = [
  {
    id: 1,
    title: 'Atomic Habits',
    author: 'James Clear',
    images: [
      'https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg',
      'https://images.unsplash.com/photo-1588776814546-79b10f86e5f4',
    ],
    condition: 'Like New',
    location: 'Nagpur, MH',
    owner: {
      name: 'Aman Verma',
      email: 'aman@example.com',
      phone: '9876543210',
    },
    intent: 'Exchange',
    description: 'A guide to building good habits and breaking bad ones with small, consistent changes.',
    tags: ['Self-Help', 'Productivity'],
  },
  {
    id: 2,
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    images: [
      'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg',
      'https://images.meesho.com/images/products/159817845/mzwwj_512.webp',
    ],
    condition: 'Good',
    location: 'Pune, MH',
    owner: {
      name: 'Riya Sharma',
      email: 'riya@example.com',
    },
    intent: 'Giveaway',
    description: 'An allegorical novel about a young shepherd’s journey to find his destiny.',
    tags: ['Fiction', 'Philosophy', 'Spiritual'],
  },
  {
    id: 3,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    images: [
      'https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX374_BO1,204,203,200_.jpg',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
    ],
    condition: 'Fair',
    location: 'Delhi, DL',
    owner: {
      name: 'Sarthak Joshi',
      email: 'sarthak@example.com',
      phone: '9123456789',
    },
    intent: 'Exchange',
    description: 'A handbook of agile software craftsmanship and writing cleaner code.',
    tags: ['Programming', 'Software Engineering'],
  },
  {
    id: 4,
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    images: [
      'https://images-na.ssl-images-amazon.com/images/I/713jIoMO3UL.jpg',
      'https://images.unsplash.com/photo-1600195077072-245b07bda7dd',
    ],
    condition: 'Poor',
    location: 'Nagpur, MH',
    owner: {
      name: 'Sneha Patil',
      email: 'sneha@example.com',
    },
    intent: 'Giveaway',
    description: 'Explores the history of humankind from the Stone Age to the modern age.',
    tags: ['History', 'Anthropology', 'Non-Fiction'],
  },
  {
    id: 5,
    title: 'Harry Potter',
    author: 'J. K. Rowling',
    images: [
      '', // Empty image will fallback to placeholder
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2',
    ],
    condition: 'Like New',
    location: 'Aurangabad, MH',
    owner: {
      name: 'Apoorva Mundada',
      email: 'apoorva@example.com',
    },
    intent: 'Giveaway',
    description: 'A magical journey of a boy wizard and his adventures at Hogwarts.',
    tags: ['Fantasy', 'Adventure'],
  },
];

export default books;
