import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const index = () => {
  return (
    <View>
      <Link href={'/(auth)/SignUp'}>SignUp</Link>
      <Link href={'/(tabs)/explore'}>Explore</Link>
      {/* <Link href={'/(auth)/SignUp'}>SignUp</Link> */}
    </View>
  )
}

export default index