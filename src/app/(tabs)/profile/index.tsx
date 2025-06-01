import { View, Text, Image, FlatList, Pressable, Switch } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import users from '@/assets/data/users';
import books from '@/assets/data/books';
import requests from '@/assets/data/requests';
import { useState } from 'react';

const ProfileScreen = () => {
  const currentUserId = 1; // Will be replaced with context later
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Get current user data
  const currentUser = users.find(user => user.id === currentUserId);
  
  // Get user's books
  const userBooks = books.filter(book => book.ownerId === currentUserId);
  
  // Get Approved requests
  const ApprovedRequests = requests.filter(request => 
    request.status === 'Approved' && 
    (request.requesterId === currentUserId || books.find(b => b.id === request.bookId)?.ownerId === currentUserId)
  );

  // Mock logout function
  const logout = () => {
    console.log('User logged out');
    // Implement actual logout logic later
  };

  // Book Card Component
  const BookCard = ({ book }: { book: typeof books[0] }) => {
    const bookRequests = requests.filter(req => req.bookId === book.id);
    const status = bookRequests.some(req => req.status === 'Approved') ? 'Approved' :
                  bookRequests.some(req => req.status === 'Approved') ? 'Requested' : 'Available';
    
    return (
      <View className="flex-row border border-gray-200 rounded-lg p-3 mb-3 bg-white">
        <Image 
          source={book.images[0] ? { uri: book.images[0] } : require('@/assets/images/no-image.png')}
          className="w-16 h-24 rounded-md"
        />
        <View className="ml-3 flex-1">
          <Text className="font-semibold text-gray-900">{book.title}</Text>
          <Text className="text-sm text-gray-600 mb-1">by {book.author}</Text>
          
          <View className="flex-row items-center mb-2">
            <View className={`px-2 py-1 rounded-full ${
              book.intent === 'Giveaway' ? 'bg-purple-100' : 'bg-amber-100'
            }`}>
              <Text className={`text-sm ${
                book.intent === 'Giveaway' ? 'text-purple-800' : 'text-amber-800'
              }`}>
                {book.intent}
              </Text>
            </View>
            
            <View className={`px-2 py-1 rounded-full ml-2 ${
              status === 'Available' ? 'bg-green-100' :
              status === 'Requested' ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Text className={`text-sm ${
                status === 'Available' ? 'text-green-800' :
                status === 'Requested' ? 'text-blue-800' : 'text-gray-800'
              }`}>
                {status}
              </Text>
            </View>
          </View>
          
          <View className="flex-row justify-end">
            <Pressable className="p-2 mr-2">
              <FontAwesome name="edit" size={16} color="#3b82f6" />
            </Pressable>
            <Pressable className="p-2">
              <FontAwesome name="trash" size={16} color="#ef4444" />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* User Profile Card */}
      <View className="bg-white p-6 rounded-b-xl shadow-sm">
        <View className="items-center mb-4">
          <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center mb-3">
            {currentUser?.avatar ? (
              <Image 
                source={{ uri: currentUser.avatar }} 
                className="w-full h-full rounded-full"
              />
            ) : (
              <FontAwesome name="user" size={36} color="#6b7280" />
            )}
          </View>
          <Text className="text-xl font-bold text-gray-900">{currentUser?.name}</Text>
          <Text className="text-gray-600">{currentUser?.email}</Text>
        </View>
        
        <Pressable onPress={() => router.push('/(tabs)/profile/EditProfile')} className="bg-[dodgerblue] py-2 rounded-lg items-center">
          <Text className="text-white font-medium">Edit Profile</Text>
        </Pressable>
      </View>

      {/* My Books Section */}
      <View className="p-4 mt-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-bold text-gray-900">My Books</Text>
          <Link href="/AddBook" asChild>
            <Pressable className="flex-row items-center">
              <Ionicons name="add" size={20} color="#3b82f6" />
              <Text className="text-[dodgerblue] ml-1">Add Book</Text>
            </Pressable>
          </Link>
        </View>
        
        {userBooks.length > 0 ? (
          <FlatList
            data={userBooks}
            renderItem={({ item }) => <BookCard book={item} />}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        ) : (
          <View className="items-center py-6">
            <FontAwesome name="book" size={40} color="#d1d5db" />
            <Text className="text-gray-500 mt-2">No books added yet</Text>
            <Link href="/AddBook" asChild>
              <Pressable className="mt-2">
                <Text className="text-[dodgerblue]">Add your first book</Text>
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
              const book = books.find(b => b.id === request.bookId);
              const otherUser = users.find(u => 
                u.id === (request.requesterId === currentUserId ? 
                  book?.ownerId : request.requesterId)
              );
              
              const action = request.requesterId === currentUserId ? 
                'received' : 'gave away';
              
              return (
                <View key={request.id} className="flex-row items-center py-2 border-b border-gray-100 last:border-0">
                  <MaterialIcons 
                    name={action === 'received' ? 'call-received' : 'call-made'} 
                    size={18} 
                    color={action === 'received' ? '#10b981' : '#3b82f6'} 
                  />
                  <Text className="ml-2 text-gray-700">
                    You {action} <Text className="font-medium">'{book?.title}'</Text> {action === 'received' ? 'from' : 'to'} {otherUser?.name}
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
        <View className="bg-white rounded-lg p-4">
          <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <Text className="text-gray-700">Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
            />
          </View>
          
          <Pressable className="flex-row justify-between items-center py-3 border-b border-gray-100" onPress={() => router.push('/(tabs)/profile/EditProfile')}>
            <Text className="text-gray-700">Edit Profile</Text>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </Pressable>
          
          <Pressable 
            onPress={logout}
            className="flex-row justify-between items-center py-3"
          >
            <Text className="text-red-500">Logout</Text>
            <Ionicons name="log-out" size={18} color="#ef4444" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;