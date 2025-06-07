import { FlatList, Pressable, SafeAreaView, useColorScheme } from 'react-native';
import { View, Text } from '../components/Themed';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Redirect, Stack } from 'expo-router';
import { useRequest } from '../contexts/RequestProvider';
import RequestListItem from '../components/RequestListItem';
import { useIncomingRequestList, useOutgoingRequestList } from '../api';
import { useAuth } from '../contexts/AuthProvider';
import { Ionicons } from '@expo/vector-icons';

const Tab = createMaterialTopTabNavigator();

export default function ModalScreen() {
  const { requests } = useRequest();
  const {session, sessionLoading} = useAuth(); // Temporary - replace with actual auth later
  if(!session){
    return <Redirect href={'/'} />
  }
  const currentUserId = session?.user.id;

  // Filter requests based on current user
  const {data: outgoingRequests} = useOutgoingRequestList(currentUserId)
  const {data: incomingRequests} = useIncomingRequestList(currentUserId)

  return (
    <SafeAreaView className="flex-1 bg-gray-700">
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
          // tabBarStyle: { backgroundColor: useColorScheme() },
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
              contentContainerStyle={{ paddingBottom: 20, gap: 10, padding: 10 }}
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
              contentContainerStyle={{ paddingBottom: 20, gap: 10, padding: 10 }}
              ListEmptyComponent={
                <View className="items-center justify-center mt-10">
                  <Text className="text-gray-500">No incoming requests</Text>
                </View>
              }
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
        <Pressable 
          className='bg-[dodgerblue] w-[60px] h-[60px] rounded-md absolute bottom-20 right-10 justify-center'
          onPress={() => {
            console.log('pressed')
          }}
        >
          <Ionicons name='filter' size={40} color='white' />
        </Pressable>
    </SafeAreaView>
  );
}