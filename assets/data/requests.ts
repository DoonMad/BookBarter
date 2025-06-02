export type Request = {
  id: string;
  bookId: string;
  requesterId: string | '';
  type: 'Giveaway' | 'Exchange';
  status: 'Pending' | 'Approved' | 'Declined';
  timestamp: string;
};

const requests: Request[] = [
  {
    id: '1',
    bookId: '2',
    requesterId: '1',
    type: 'Giveaway',
    status: 'Pending',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    bookId: '6',
    requesterId: '4',
    type: 'Exchange',
    status: 'Pending',
    timestamp: new Date().toISOString(),
  },
];

export default requests;
