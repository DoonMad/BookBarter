import { FlatList, Text } from 'react-native';
// import books from '@/assets/data/books';
import BookListItem from '@/src/components/BookListItem';
import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/contexts/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator } from 'react-native-paper';
import { useBookList } from '@/src/api';

export default function TabOneScreen() {
  const {session, sessionLoading} = useAuth()

  const {data: books, error, isLoading} = useBookList();

  if(isLoading){
    return <ActivityIndicator />
  }

  if(error){
    return <Text>Failed to Get any data</Text>
  }

  return (
      <FlatList
        data={books}
        renderItem={({item}) => <BookListItem book= {item} />}
        numColumns={2}
        contentContainerStyle={{gap: 8, padding: 8}}
        columnWrapperStyle={{gap: 8}}
      />
  );
}
