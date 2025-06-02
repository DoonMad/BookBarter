// I made this file to create custom hooks to fetch or send data to the server.
import { useAuth } from "../contexts/AuthProvider";
import { supabase } from "../lib/supabase";
import type { Database } from "../lib/supabase.types"
import { useQuery } from "@tanstack/react-query";

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