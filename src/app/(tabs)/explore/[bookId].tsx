import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams, Stack } from 'expo-router'

const BookDetailsScreen = () => {
    const {bookId} = useLocalSearchParams();
    return (
        <View>
            <Stack.Screen options={{title: `Book ${bookId}`}} />
            <Text className='text-red-700'>BookDetailsScreen for {bookId}</Text>
        </View>
    )
}

export default BookDetailsScreen