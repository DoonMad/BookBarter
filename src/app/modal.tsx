import { FlatList, View, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Stack } from 'expo-router';
import { useRequest } from '../contexts/RequestProvider';
import RequestListItem from '../components/RequestListItem';
import books from '@/assets/data/books';

const Tab = createMaterialTopTabNavigator();

export default function ModalScreen() {
  const { requests } = useRequest();
  const currentUserId = 1; // Temporary - replace with actual auth later

  // Filter requests based on current user
  const outgoingRequests = requests.filter(request => request.requesterId === currentUserId);
  const incomingRequests = requests.filter(request => {
    const book = books.find(b => b.id === request.bookId);
    return book?.ownerId === currentUserId;
  });

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          title: 'Requests',
          headerTitleStyle: { color: '#3b82f6' },
        }}
      />
      
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#3b82f6',
          tabBarInactiveTintColor: '#6b7280',
          tabBarStyle: { backgroundColor: 'white' },
          tabBarIndicatorStyle: { backgroundColor: '#3b82f6' },
          tabBarLabelStyle: { fontWeight: '600', fontSize: 14, textTransform: 'none' },
          tabBarPressColor: '#e5e7eb',
          tabBarGap: 20,
        }}
      >
        <Tab.Screen 
          name="Outgoing" 
          options={{ tabBarLabel: 'Outgoing Requests' }}
        >
          {() => (
            <FlatList
              data={outgoingRequests}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <RequestListItem 
                  request={item} 
                  type="outgoing" 
                  currentUserId={currentUserId}
                />
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={
                <View className="items-center justify-center mt-10">
                  <Text className="text-gray-500">No outgoing requests</Text>
                </View>
              }
            />
          )}
        </Tab.Screen>

        <Tab.Screen 
          name="Incoming" 
          options={{ tabBarLabel: 'Incoming Requests' }}
        >
          {() => (
            <FlatList
              data={incomingRequests}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <RequestListItem 
                  request={item} 
                  type="incoming" 
                  currentUserId={currentUserId}
                />
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={
                <View className="items-center justify-center mt-10">
                  <Text className="text-gray-500">No incoming requests</Text>
                </View>
              }
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}