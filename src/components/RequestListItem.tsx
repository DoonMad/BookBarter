import { Image, Pressable, View } from 'react-native';
import { Text } from './Themed';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Request, useBookById, useUserbyId } from '../api';

type RequestListItemProps = {
  request: Request;
  type: 'incoming' | 'outgoing';
  currentUserId: string;
};

const RequestListItem = ({ request, type, currentUserId }: RequestListItemProps) => {
  const {data: book} = useBookById(request.book_id);
  const {data: requester} = useUserbyId(request.requester_id);
  const {data: owner} = useUserbyId(book?.owner_id);

  if (!book || !requester || !owner) return null;

  // Determine which user to display based on request type
  const displayUser = type === 'incoming' ? requester : owner;

  const getStatusColor = () => {
    switch (request.status) {
      case 'Pending': return 'bg-amber-500';
      case 'Approved': return 'bg-emerald-500';
      case 'Declined': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Pressable 
      onPress={() => router.push(`/explore/${book.id}`)}
      className="flex-row p-4 border-b border-gray-300 bg-white active:bg-gray-100 rounded-lg shadow-black shadow-md"
      style={{}}
    >
      <Image 
        source={book.images[0] ? { uri: book.images[0] } : require('@/assets/images/no-image.png')}
        className="w-16 h-20 rounded-md bg-gray-100"
      />

      <View className="flex-1 ml-4">
        <Text className="text-lg font-semibold text-gray-900" style={{color: '#111827'}}>{book.title}</Text>
        <Text className="text-sm text-gray-600" style={{color: '#4b5563'}}>by {book.author}</Text>

        <View className="flex-row items-center mt-1">
          <Ionicons name="person" size={14} color="#6b7280" />
          <Text className="ml-1 text-sm text-gray-700" style={{color: '#374151'}}>
            {type === 'incoming' ? 'From' : 'To'}: {displayUser.name}
          </Text>
        </View>

        <View className="flex-row items-center mt-2">
          <View className={`px-2 py-1 rounded-full ${getStatusColor()}`} style={{backgroundColor: '#f59e0b'}}> 
            {/* hardcoded color, will change later */}
            <Text className="text-xs font-medium text-white">{request.status}</Text>
          </View>
          <Text className="ml-2 text-sm text-gray-600" style={{color: '#4b5563'}}>{request.type} Request</Text>
        </View>

        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-xs text-gray-500" style={{color: '#6b7280'}}>
            {new Date(request.updated_at).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
          
          {type === 'incoming' && (
            <View className="flex-row">
              <Pressable 
                onPress={(e) => {
                  e.stopPropagation();
                  console.log('Approve request', request.id);
                }}
                className="p-1.5 ml-2 rounded-full bg-gray-100 active:bg-gray-200"
              >
                <Ionicons name="checkmark" size={18} color="#10b981" />
              </Pressable>
              <Pressable 
                onPress={(e) => {
                  e.stopPropagation();
                  console.log('Decline request', request.id);
                }}
                className="p-1.5 ml-2 rounded-full bg-gray-100 active:bg-gray-200"
              >
                <Ionicons name="close" size={18} color="#ef4444" />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default RequestListItem;