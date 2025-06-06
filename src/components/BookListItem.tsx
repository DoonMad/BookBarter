// components/BookListItem.tsx
import { Image, StyleSheet, Pressable } from 'react-native';
import { Text, View} from './Themed'
// import { Book } from '@/types';
import { router } from 'expo-router';
// import { Book } from '@/assets/data/books';
import type { Book } from '@/src/api/index';


type BookListItemProps = {
  book: Book;
};

const BookListItem = ({ book }: BookListItemProps) => {

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/explore/${book.id}`)}
    >
      <Image
        source={
            book.images[0]
            ? { uri: book.images[0] }
            : require('../../assets/images/no-image.png')
        }
        style={styles.image}
        />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          by {book.author}
        </Text>
        <Text
          style={[
            styles.intent,
            { color: book.intent === 'Giveaway' ? '#4CAF50' : '#2196F3' },
          ]}
        >
          {book.intent}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    // margin: 4,
    flex: 1,
    maxWidth: '50%',
    elevation: 4, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: '100%',
    aspectRatio: 2 / 3, // Standard book cover ratio
    resizeMode: 'contain',
    backgroundColor: 'gray'
  },
  infoContainer: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  intent: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default BookListItem;
