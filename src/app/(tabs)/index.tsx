import { StyleSheet, Text, View } from 'react-native';
import books from '@/assets/data/books';

const book = books[0]

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text className='text-red-600 text-2xl'>{book.title}</Text>
      <Text> {book.author} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
