export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  location: string;
  avatar?: string; // Optional profile picture
};

const users: User[] = [
  {
    id: 1,
    name: 'Aman Verma',
    email: 'aman@example.com',
    phone: '9876543210',
    location: 'Nagpur, MH',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
  },
  {
    id: 2,
    name: 'Riya Sharma',
    email: 'riya@example.com',
    location: 'Pune, MH',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    id: 3,
    name: 'Sarthak Joshi',
    email: 'sarthak@example.com',
    phone: '9123456789',
    location: 'Delhi, DL',
    avatar: 'https://randomuser.me/api/portraits/men/64.jpg',
  },
  {
    id: 4,
    name: 'Sneha Patil',
    email: 'sneha@example.com',
    location: 'Nagpur, MH',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 5,
    name: 'Apoorva Mundada',
    email: 'apoorva@example.com',
    location: 'Aurangabad, MH',
    avatar: 'https://randomuser.me/api/portraits/women/20.jpg',
  },
  {
    id: 6,
    name: 'Yash Mehta',
    email: 'yash@example.com',
    phone: '9991122334',
    location: 'Mumbai, MH',
    avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
  },
  {
    id: 7,
    name: 'Neha Gupta',
    email: 'neha@example.com',
    location: 'Indore, MP',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
  },
];

export default users;
