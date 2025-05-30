import { StyleSheet, Text, View, Image } from 'react-native';
import books, { Book } from '@/assets/data/books';
import BookListItem from '@/src/components/BookListItem';

const book = books[0]

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <BookListItem book= {books[1]} />
      <BookListItem book= {books[0]} />
    </View>
  );
}

const styles = StyleSheet.create({
  image:{
    width: 100,
    aspectRatio: 1
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F1F1',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
