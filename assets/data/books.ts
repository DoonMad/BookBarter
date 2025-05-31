export type Book = {
  id: number;
  title: string;
  author: string;
  images: string[];
  condition: 'Like New' | 'Good' | 'Fair' | 'Poor';
  ownerId: number; // Refers to User.id
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
    ownerId: 1,
    intent: 'Exchange',
    description: 'A guide to building good habits and breaking bad ones.',
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
    ownerId: 2,
    intent: 'Giveaway',
    description: 'A novel about a shepherd’s quest for his destiny.',
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
    ownerId: 3,
    intent: 'Exchange',
    description: 'Guide to writing cleaner, more maintainable code.',
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
    ownerId: 4,
    intent: 'Giveaway',
    description: 'History of humankind from ancient to modern times.',
    tags: ['History', 'Anthropology', 'Non-Fiction'],
  },
  {
    id: 5,
    title: 'Harry Potter',
    author: 'J. K. Rowling',
    images: [
      '',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2',
    ],
    condition: 'Like New',
    ownerId: 5,
    intent: 'Giveaway',
    description: 'Magical adventures of a young wizard.',
    tags: ['Fantasy', 'Adventure'],
  },
  {
    id: 6,
    title: 'The Subtle Art of Not Giving a F*ck',
    author: 'Mark Manson',
    images: [
      'https://images-na.ssl-images-amazon.com/images/I/71QKQ9mwV7L.jpg',
    ],
    condition: 'Good',
    ownerId: 6,
    intent: 'Exchange',
    description: 'A counterintuitive approach to living a good life.',
    tags: ['Self-Help', 'Psychology'],
  },
  {
    id: 7,
    title: 'Deep Work',
    author: 'Cal Newport',
    images: [
      'https://images-na.ssl-images-amazon.com/images/I/81BPKT8ZzsL.jpg',
    ],
    condition: 'Like New',
    ownerId: 7,
    intent: 'Giveaway',
    description: 'Rules for focused success in a distracted world.',
    tags: ['Productivity', 'Work'],
  },
];

export default books;
