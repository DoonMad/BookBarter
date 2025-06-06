import { Image, FlatList, Pressable, Switch, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { Book, Request, useAllRequests, useBooksByIds, useUsersByIds } from '@/src/api';
import { useCallback, useMemo, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/contexts/AuthProvider';
import { useApprovedRequestList, useBookListFromOwnerId, useUserbyId } from '@/src/api';
import { Alert } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { View, Text } from '@/src/components/Themed';

const ProfileScreen = () => {
  // State hooks at the top (React Hook rules)
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Auth and data hooks
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const currentUserId = session?.user.id;
  
  // Data fetching
  const { data: currentUser, isLoading: isLoadingUser } = useUserbyId(currentUserId);
  const { data: userBooks = [], refetch: refetchUserBooks } = useBookListFromOwnerId(currentUserId);
  const { data: ApprovedRequests = [], refetch: refetchApprovedRequests } = useApprovedRequestList(currentUserId);
  const { data: allRequests = [], refetch: refetchAllRequests } = useAllRequests();

  // Memoized derived data
  const bookIds = useMemo(() => ApprovedRequests?.map(r => r.book_id) ?? [], [ApprovedRequests]);
  const { data: books = [] } = useBooksByIds(bookIds);
  
  const userIds = useMemo(() => {
    return ApprovedRequests?.map(req => {
      const book = books.find(b => b.id === req.book_id);
      return req.requester_id === currentUserId ? book?.owner_id : req.requester_id;
    }).filter(Boolean) ?? [];
  }, [ApprovedRequests, books, currentUserId]);

  const { data: users = [] } = useUsersByIds(userIds.filter((id): id is string => typeof id === 'string'));

  // Handlers
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // Clear query cache on logout
      queryClient.clear();
    } catch (error) {
      Alert.alert('Logout Error', 'Failed to logout. Please try again.');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchUserBooks(),
        refetchApprovedRequests(),
        refetchAllRequests()
      ]);
    } catch (error) {
      Alert.alert('Refresh Error', 'Failed to refresh data.');
    } finally {
      setRefreshing(false);
    }
  }, [refetchUserBooks, refetchApprovedRequests, refetchAllRequests]);

  // Book Card Component
  const BookCard = ({ book, requests }: { book: Book; requests: Request[] }) => {
    const bookRequests = requests.filter(req => req.book_id === book.id);

    const deleteBook = async (bookId: string) => {
      try {
        const { error } = await supabase
          .from('books')
          .delete()
          .eq('id', bookId);

        if (error) {
          throw error;
        }

        // Invalidate and refetch queries to update UI
        queryClient.invalidateQueries({ queryKey: ['books'] });
        Alert.alert('Success', 'Book deleted successfully');
      } catch (error) {
        Alert.alert('Error', 'Failed to delete book. Please try again.');
      }
    };

    const status = bookRequests.some(req => req.status === 'Approved')
      ? 'Approved'
      : bookRequests.length > 0
      ? 'Requested'
      : 'Available';

    return (
      <Pressable 
        className="flex-row border border-gray-200 rounded-lg p-3 mb-3"
        onPress={() => router.push(`/(tabs)/explore/${book.id}`)}
      >
        <Image 
          source={book.images[0] ? { uri: book.images[0] } : require('@/assets/images/no-image.png')}
          className="w-16 h-24 rounded-md"
        />
        <View className="ml-3 flex-1">
          <Text className="font-semibold text-gray-900" numberOfLines={1}>{book.title}</Text>
          <Text className="text-sm text-gray-600 mb-1" numberOfLines={1}>by {book.author}</Text>

          <View className="flex-row items-center mb-2 flex-wrap">
            <View className={`px-2 py-1 rounded-full ${
              book.intent === 'Giveaway' ? 'bg-purple-100' : 'bg-amber-100'
            }`} style={{ backgroundColor: book.intent === 'Giveaway' ? '#E9D5FF' : '#FDE68A' }}>
              <Text className={`text-xs ${
                book.intent === 'Giveaway' ? 'text-purple-800' : 'text-amber-800'
              }`} style={{ color: book.intent === 'Giveaway' ? '#6b21a8' : '#92400e' }}>
                {book.intent}
              </Text>
            </View>

            <View className={`px-2 py-1 rounded-full ml-2 ${
              status === 'Available' ? 'bg-green-100' :
              status === 'Requested' ? 'bg-blue-100' : 'bg-gray-100'
            }`} style={{
              backgroundColor:
              status === 'Available'
                ? '#D1FAE5' // bg-green-100
                : status === 'Requested'
                ? '#DBEAFE' // bg-blue-100
                : '#F3F4F6', // bg-gray-100
            }}>
              <Text className={`text-xs ${
                status === 'Available' ? 'text-green-800' :
                status === 'Requested' ? 'text-blue-800' : 'text-gray-800'
              }`} style={{
                color:
                status === 'Available'
                  ? '#065F46' // text-green-800
                  : status === 'Requested'
                  ? '#1E40AF' // text-blue-800
                  : '#4B5563', // text-gray-800
              }}>
                {status}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-end">
            <Pressable 
              className="p-2 mr-2"
              // onPress={() => router.push(`/(tabs)/profile/edit-book/${book.id}`)}
              onPress={() => console.log('edit book')}
            >
              <FontAwesome name="edit" size={16} color="#3b82f6" />
            </Pressable>
            <Pressable 
              className="p-2"
              onPress={() => {
                Alert.alert(
                  'Delete Book',
                  'Are you sure you want to delete this book? This action cannot be undone.',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    { 
                      text: 'Delete', 
                      onPress: () => deleteBook(book.id),
                      style: 'destructive'
                    },
                  ]
                );
              }}
            >
              <FontAwesome name="trash" size={16} color="#ef4444" />
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  };

  if (isLoadingUser) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-gray-700 p-2"
      refreshControl={
        <RefreshControl 
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#3b82f6"
        />
      }
    >
      {/* User Profile Card */}
      <View className="bg-white p-6 rounded-b-xl shadow-sm">
        <View className="items-center mb-4">
          <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center mb-3 overflow-hidden">
            {currentUser?.avatar ? (
              <Image 
                source={{ uri: currentUser.avatar }} 
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <FontAwesome name="user" size={36} color="#6b7280" />
            )}
          </View>
          <Text className="text-xl font-bold text-gray-900">{currentUser?.name}</Text>
          <Text className="text-gray-600">{currentUser?.email}</Text>
        </View>
        
        <Pressable 
          onPress={() => router.push('/(tabs)/profile/EditProfile')} 
          className="bg-blue-600 py-3 rounded-lg items-center"
        >
          <Text className="text-white font-medium">Edit Profile</Text>
        </Pressable>
      </View>

      {/* My Books Section */}
      <View className="p-4 mt-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-bold text-gray-900">My Books</Text>
          <Link href="/AddBook" asChild>
            <Pressable className="flex-row items-center bg-blue-50 px-3 py-1 rounded-full">
              <Ionicons name="add" size={18} color="#3b82f6" />
              <Text className="text-blue-600 ml-1 text-sm" style={{color: '#2563eb'}}>Add Book</Text>
            </Pressable>
          </Link>
        </View>
        
        {userBooks.length > 0 ? (
          <FlatList
            data={userBooks}
            renderItem={({ item }) => (
              <BookCard book={item} requests={allRequests} />
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ListFooterComponent={<View className="h-4" />}
          />
        ) : (
          <View className="items-center py-8 bg-white rounded-lg">
            <FontAwesome name="book" size={40} color="#d1d5db" />
            <Text className="text-gray-500 mt-3">No books added yet</Text>
            <Link href="/AddBook" asChild>
              <Pressable className="mt-3 bg-blue-50 px-4 py-2 rounded-full">
                <Text className="text-blue-600 font-medium">Add your first book</Text>
              </Pressable>
            </Link>
          </View>
        )}
      </View>

      {/* Book History Section */}
      {ApprovedRequests.length > 0 && (
        <View className="p-4 mt-2">
          <Text className="text-lg font-bold text-gray-900 mb-3">Book History</Text>
          <View className="bg-white rounded-lg p-4">
            {ApprovedRequests.map((request) => {
              const book = books.find(b => b.id === request.book_id);
              const isRequester = request.requester_id === currentUserId;
              const otherUserId = isRequester ? book?.owner_id : request.requester_id;
              const otherUser = users.find(u => u.id === otherUserId);
              const action = isRequester ? 'received' : 'gave away';

              return (
                <View 
                  key={request.id} 
                  className="flex-row items-center py-3 border-b border-gray-100 last:border-0"
                >
                  <MaterialIcons 
                    name={action === 'received' ? 'call-received' : 'call-made'} 
                    size={18} 
                    color={action === 'received' ? '#10b981' : '#3b82f6'} 
                  />
                  <Text className="ml-2 text-gray-700 flex-1" numberOfLines={2}>
                    You {action} <Text className="font-medium">'{book?.title}'</Text> {action === 'received' ? 'from' : 'to'} {otherUser?.name || 'unknown user'}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Settings Section */}
      <View className="p-4 mt-4 mb-8">
        <Text className="text-lg font-bold text-gray-900 mb-3">Settings</Text>
        <View className="bg-white rounded-lg overflow-hidden">
          <Pressable 
            className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100"
            onPress={() => setIsDarkMode(!isDarkMode)}
          >
            <Text className="text-gray-700">Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
              thumbColor={isDarkMode ? '#ffffff' : '#ffffff'}
            />
          </Pressable>
          
          <Pressable 
            className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100" 
            onPress={() => router.push('/(tabs)/profile/EditProfile')}
          >
            <Text className="text-gray-700">Edit Profile</Text>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </Pressable>
          
          <Pressable 
            className="flex-row justify-between items-center px-4 py-3"
            onPress={logout}
          >
            <Text className="text-red-500">Logout</Text>
            <Ionicons name="log-out" size={18} color="#ef4444" />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;