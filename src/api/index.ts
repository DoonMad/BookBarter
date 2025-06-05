// I made this file to create custom hooks to fetch or send data to the server.
import { useAuth } from "../contexts/AuthProvider";
import { supabase } from "../lib/supabase";
import type { Database } from "../lib/supabase.types"
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// const [books, setBooks] = useState<any[]>([]);

// Without using react query....
// useEffect(() => {
//   const fetchBooks = async () => {
//     const { data: booksData, error } = await supabase.from('books').select('*').neq('owner_id', session?.user.id);
//     if (error) console.error('Error fetching books:', error);
//     else setBooks(booksData);
//   };
//   fetchBooks();
// }, []);

export type User = Database["public"]["Tables"]["users"]["Row"];
export type Book = Database["public"]["Tables"]["books"]["Row"];
export type Request = Database["public"]["Tables"]["requests"]["Row"];
export type InsertUser = Database["public"]["Tables"]["users"]["Insert"];
export type InsertBook = Database["public"]["Tables"]["books"]["Insert"];
export type InsertRequest = Database["public"]["Tables"]["requests"]["Insert"];


export const useBookList = () => {
  const {session, sessionLoading} = useAuth();

  return useQuery({
    queryKey: ['books'],
    queryFn: async (): Promise<Book[]> => {
      const { data: booksData, error } = await supabase.from('books').select('*').neq('owner_id', session?.user.id);
      if(error){
        throw new Error(error.message);
      }
      return booksData ?? [];
    }
  })
}

export const useBookListFromOwnerId = (ownerId?: string) => {
  return useQuery({
    queryKey: ['books', ownerId],
    queryFn: async (): Promise<Book[]> => {
      const { data: booksData, error } = await supabase.from('books').select('*').eq('owner_id', ownerId);
      if(error){
        throw new Error(error.message);
      }
      return booksData ?? [];
    },
    enabled: !!ownerId,
  })
}

export const useBookById = (id?: string) => {
  
  return useQuery({
    queryKey: ['book', id],
    queryFn: async (): Promise<Book> => {
      const { data, error } = await supabase.from('books').select('*').eq('id', id).single();
      if(error){
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!id,
  })
}

export const useBooksByIds = (bookIds?: string[]) => {
  
  return useQuery({
    queryKey: ['booksByIds', bookIds],
    queryFn: async (): Promise<Book[]> => {
      if (bookIds?.length === 0) return [];

      const { data, error } = await supabase
        .from('books')
        .select('*')
        .in('id', bookIds || ['']);

      if (error) throw new Error(error.message);
      return data ?? [];
    },
    enabled: !!bookIds && bookIds.length > 0,
  })
}

export const useUsersByIds = (userIds?: string[]) => {
  
  return useQuery({
    queryKey: ['usersByIds', userIds],
    queryFn: async (): Promise<User[]> => {
      if (userIds?.length === 0) return [];

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .in('id', userIds || ['']);

      if (error) throw new Error(error.message);
      return data ?? [];
    },
    enabled: !!userIds && userIds.length > 0,
  })
}

export const useUserbyId = (id?: string) => {
  
  return useQuery({
    queryKey: ['book', id],
    queryFn: async (): Promise<User> => {
      const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
      if(error){
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!id,
  })
}

export const useIncomingRequestList = (userId?: string) => {
  return useQuery({
    queryKey: ['incomingRequests', userId],
    queryFn: async (): Promise<Request[]> => {
      const { data, error } = await supabase
        .from('requests')
        .select('*, books!inner(*)') // inner join with books table
        .eq('books.owner_id', userId)
        .order('created_at', { ascending: false });
      if(error){
        throw new Error(error.message);
      }
      return data ?? [];
    },
    enabled: !!userId,
  })
}

export const useOutgoingRequestList = (userId?: string) => {
  return useQuery({
    queryKey: ['outgoingRequests', userId],
    queryFn: async (): Promise<Request[]> => {
      const { data, error } = await supabase.from('requests').select('*').eq('requester_id', userId).order('created_at', { ascending: false });
      if(error){
        throw new Error(error.message);
      }
      return data ?? [];
    },
    enabled: !!userId,
  })
}

export const useApprovedRequestList = (currentUserId?: string) => {
  return useQuery({
    queryKey: ['approvedRequests', currentUserId],
    enabled: !!currentUserId,
    queryFn: async (): Promise<Request[]> => {
      const { data, error } = await supabase
        .from('requests')
        .select('*, books!inner(owner_id)') // join with books to get owner_id
        .eq('status', 'Approved')
        .or(`requester_id.eq.${currentUserId},books.owner_id.eq.${currentUserId}`); // filter by current user as requester OR owner

      if (error) {
        throw new Error(error.message);
      }

      return data ?? [];
    },
  });
};

export const useAllRequests = () => {
  return useQuery({
    queryKey: ['allRequests'],
    queryFn: async (): Promise<Request[]> => {
      const { data, error } = await supabase.from('requests').select('*');

      if (error) {
        throw new Error(error.message);
      }

      return data ?? [];
    },
  });
};

export const useFindExistingRequest = () => {
  const queryFn = async (bookId: string, requesterId: string, intent: string): Promise<Request | null> => {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('book_id', bookId)
      .eq('requester_id', requesterId)
      .eq('type', intent)
      .maybeSingle(); // Using maybeSingle instead of single
    
    if (error) throw new Error(error.message);
    return data;
  };

  return {
    checkRequest: queryFn // Expose as a regular async function
  };
};

export const useInsertBook = () => {
  const client = useQueryClient();
  return useMutation({
    async mutationFn(data: InsertBook) {
      const {error, data: newBook} = await supabase.from('books').insert(data);
      console.log('I am sending the book.')
      if(error) {
        throw new Error(error.message);
      }
      return newBook;
    },
    async onSuccess() {
      await client.invalidateQueries({queryKey: ['books']})
    }
  })
}

export const useInsertRequest = () => {
  const client = useQueryClient();
  return useMutation({
    async mutationFn(data: InsertRequest) {
      const {error, data: newReq} = await supabase.from('requests').insert(data);
      console.log('I am sending the req.')
      if(error) {
        throw new Error(error.message);
      }
      return newReq;
    },
    async onSuccess() {
      await client.invalidateQueries({queryKey: ['requests']})
    }
  })
}