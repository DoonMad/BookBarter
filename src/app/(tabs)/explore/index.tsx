import { Alert, FlatList, RefreshControl } from 'react-native';
import BookListItem from '@/src/components/BookListItem';
import { useAuth } from '@/src/contexts/AuthProvider';
import { ActivityIndicator } from 'react-native-paper';
import { useBookList } from '@/src/api';
import { View, Text } from '@/src/components/Themed';
import { useCallback, useState } from 'react';

export default function TabOneScreen() {
  const { session, sessionLoading } = useAuth();
  const { data: books, error, isLoading, refetch: refetchBooks } = useBookList();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
      setRefreshing(true);
      try {
        await Promise.all([
          refetchBooks()
        ]);
      } catch (error) {
        Alert.alert('Refresh Error', 'Failed to refresh data.');
      } finally {
        setRefreshing(false);
      }
    }, [refetchBooks]);

  if (isLoading || sessionLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'error' }}>Failed to fetch books. Please try again.</Text>
      </View>
    );
  }

  if (!books?.length) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No books available yet. Be the first to add one!</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={books}
        renderItem={({ item }) => <BookListItem book={item} />}
        numColumns={2}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        columnWrapperStyle={{ gap: 10 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}