import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

export default function FloatingAddButton() {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.fab} onPress={() => router.push('/AddBook')}>
      {/* <Ionicons name="add" size={32} color="white" /> */}
      <FontAwesome name='plus' size={32} color="white"/>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 25,
    alignSelf: 'center',
    backgroundColor: 'dodgerblue',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
});
