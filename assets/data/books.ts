export type Book = {
  id: number;
  title: string;
  author: string;
  image: string;
  condition: 'Like New' | 'Good' | 'Fair' | 'Poor';
  location: string;
  owner: {
    name: string;
    email: string;
  };
  intent: 'Giveaway' | 'Exchange'; // Later: 'Sell for coins'
};

const books: Book[] = [
  {
    id: 1,
    title: 'Atomic Habits',
    author: 'James Clear',
    image: 'https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg',
    condition: 'Like New',
    location: 'Nagpur, MH',
    owner: {
      name: 'Aman Verma',
      email: 'aman@example.com',
    },
    intent: 'Exchange',
  },
  {
    id: 2,
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    image: 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg',
    condition: 'Good',
    location: 'Pune, MH',
    owner: {
      name: 'Riya Sharma',
      email: 'riya@example.com',
    },
    intent: 'Giveaway',
  },
  {
    id: 3,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    image: 'https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX374_BO1,204,203,200_.jpg',
    condition: 'Fair',
    location: 'Delhi, DL',
    owner: {
      name: 'Sarthak Joshi',
      email: 'sarthak@example.com',
    },
    intent: 'Exchange',
  },
  {
    id: 4,
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    image: 'https://images-na.ssl-images-amazon.com/images/I/713jIoMO3UL.jpg',
    condition: 'Poor',
    location: 'Nagpur, MH',
    owner: {
      name: 'Sneha Patil',
      email: 'sneha@example.com',
    },
    intent: 'Giveaway',
  },
  {
    id: 5,
    title: 'Harry Potter',
    author: 'J. K. Rowling',
    image: '',
    condition: 'Like New',
    location: 'Aurangabad, MH',
    owner: {
      name: 'Apoorva Mundada',
      email: 'apoorva@example.com',
    },
    intent: 'Giveaway',
  },
];

export default books;
