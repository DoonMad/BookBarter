import { Dimensions, FlatList, Image, Pressable, ScrollView, View, Text } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { Share } from 'react-native';
import books from '@/assets/data/books';

const { width: screenWidth } = Dimensions.get('window');

const ImageCarousel = ({ images }: { images: string[] }) => {
  return (
    <View className="w-full" style={{ height: screenWidth * 1.2 }}>
      <FlatList
        horizontal
        pagingEnabled
        data={images.length > 0 ? images : [null]}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ width: screenWidth }}>
            <Image 
              source={item ? { uri: item } : require('@/assets/images/no-image.png')}
              style={{
                width: screenWidth,
                height: '100%',
                resizeMode: 'contain',
              }}
            />
          </View>
        )}
        ListEmptyComponent={
          <View className="w-full h-full bg-gray-200 items-center justify-center">
            <Image 
              source={require('@/assets/images/no-image.png')}
              style={{ width: screenWidth * 0.5, height: screenWidth * 0.5 }}
              resizeMode="contain"
            />
            <Text className="mt-4 text-gray-500 text-lg">No images available</Text>
          </View>
        }
        snapToAlignment="center"
        decelerationRate="fast"
      />
    </View>
  );
};

const BookDetailsScreen = () => {
  const { bookId } = useLocalSearchParams();
  const book = books.find((b) => b.id.toString() === bookId);

  if (!book) {
    return (
      <View className="p-4 items-center justify-center">
        <Text className="text-red-600">Book not found</Text>
      </View>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this book: ${book.title} by ${book.author}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen 
        options={{ 
          title: book.title.length > 20 ? `${book.title.substring(0, 20)}...` : book.title,
          headerRight: () => (
            <Pressable onPress={handleShare}>
              <Ionicons name="share-social" size={22} color="#3b82f6" />
            </Pressable>
          )
        }} 
      />

      <ScrollView className="flex-1">
        <ImageCarousel images={book.images || []} />

        <View className="p-5 bg-white">
          <Text className="text-3xl font-bold text-gray-900 mb-1">{book.title}</Text>
          <Text className="text-xl text-gray-600 mb-4">by {book.author}</Text>

          {/* Condition and Intent badges */}
          <View className="flex-row gap-2 mb-4">
            <View className="bg-green-100 px-3 py-1 rounded-full flex-row items-center">
              <Ionicons name="book" size={14} color="#166534" className="mr-1" />
              <Text className="text-green-800 text-sm font-medium">{book.condition}</Text>
            </View>
            <View className="bg-purple-100 px-3 py-1 rounded-full flex-row items-center">
              <MaterialIcons 
                name={book.intent === 'Giveaway' ? 'card-giftcard' : 'swap-horiz'} 
                size={16} 
                color="#6b21a8"
                className="mr-1"
              />
              <Text className="text-purple-800 text-sm font-medium">
                {book.intent === 'Giveaway' ? 'Giveaway' : 'For Exchange'}
              </Text>
            </View>
          </View>

          {/* Tags */}
          {(book.tags ?? []).length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-4">
              {(book.tags ?? []).map((tag, idx) => (
                <Text
                  key={idx}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </Text>
              ))}
            </View>
          )}

          {/* Description */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-2">Description</Text>
            <Text className="text-base text-gray-700 leading-relaxed">
              {book.description || 'No description provided for this book.'}
            </Text>
          </View>

          {/* Owner Information */}
          <View className="bg-gray-100 rounded-lg p-4 mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Owner Information</Text>
            
            <View className="space-y-3">
              <View className="flex-row items-center">
                <Ionicons name="person" size={20} color="#6b7280" />
                <Text className="ml-3 text-base text-gray-700">{book.owner?.name || 'Anonymous'}</Text>
              </View>
              
              {book.owner?.email && (
                <Pressable 
                  onPress={() => Linking.openURL(`mailto:${book.owner.email}`)}
                  className="flex-row items-center"
                >
                  <Ionicons name="mail" size={20} color="#6b7280" />
                  <Text className="ml-3 text-base text-blue-600 underline">{book.owner.email}</Text>
                </Pressable>
              )}
              
              {book.owner?.phone && (
                <Pressable 
                  onPress={() => Linking.openURL(`tel:${book.owner.phone}`)}
                  className="flex-row items-center"
                >
                  <Ionicons name="call" size={20} color="#6b7280" />
                  <Text className="ml-3 text-base text-blue-600 underline">{book.owner.phone}</Text>
                </Pressable>
              )}
              
              <View className="flex-row items-center">
                <Ionicons name="location" size={20} color="#6b7280" />
                <Text className="ml-3 text-base text-gray-700">{book.location}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="p-4 bg-white border-t border-gray-200">
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => console.log('Bookmark pressed')}
            className="p-3 rounded-xl items-center bg-gray-200"
          >
            <FontAwesome name="bookmark-o" size={20} color="#4b5563" />
          </Pressable>
          
          {book.intent === 'Giveaway' ? (
            <Pressable
              onPress={() => console.log('Giveaway request')}
              className="flex-1 py-3 rounded-xl items-center bg-indigo-600"
            >
              <Text className="text-white font-bold text-lg">Request Giveaway</Text>
            </Pressable>
          ) : (
            <View className="flex-1 flex-row gap-2">
              <Pressable
                onPress={() => console.log('Exchange request')}
                className="flex-1 py-3 rounded-xl items-center bg-indigo-600"
              >
                <Text className="text-white font-bold text-lg">Exchange</Text>
              </Pressable>
              <Pressable
                onPress={() => console.log('Giveaway request')}
                className="flex-1 py-3 rounded-xl items-center bg-purple-600"
              >
                <Text className="text-white font-bold text-lg">Request</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default BookDetailsScreen;