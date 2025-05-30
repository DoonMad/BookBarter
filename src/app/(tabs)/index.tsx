import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import books from '@/assets/data/books';
import BookListItem from '@/src/components/BookListItem';

export default function TabOneScreen() {
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
