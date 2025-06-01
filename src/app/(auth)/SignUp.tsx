import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { supabase } from '@/src/lib/supabase';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false)

  if(loading){
    return <ActivityIndicator/> 
  }

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function signUpWithEmail() {
    if (!validate()) return;
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    })
    if (error) alert(error.message)
    if (!session) alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">Create Account</Text>
      
      {/* Name Field */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Full Name</Text>
        <View className={`border rounded-lg p-2 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}>
          <TextInput
            value={formData.name}
            onChangeText={(text) => setFormData({...formData, name: text})}
            placeholder="John Smith"
            className="text-base"
          />
        </View>
        {errors.name && <Text className="text-red-500 text-sm mt-1">{errors.name}</Text>}
      </View>

      {/* Email Field */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Email</Text>
        <View className={`border rounded-lg p-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}>
          <TextInput
            value={formData.email}
            onChangeText={(text) => setFormData({...formData, email: text})}
            placeholder="john.smith@example.com"
            className="text-base"
            keyboardType="email-address"
          />
        </View>
        {errors.email && <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>}
      </View>

      {/* Password Field */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Password</Text>
        <View className={`border rounded-lg p-2 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}>
          <TextInput
            value={formData.password}
            onChangeText={(text) => setFormData({...formData, password: text})}
            placeholder="••••••••"
            secureTextEntry
            className="text-base"
          />
        </View>
        {errors.password && <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>}
      </View>

      {/* Phone Field */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Phone (Optional)</Text>
        <View className="border border-gray-300 rounded-lg p-2">
          <TextInput
            value={formData.phone}
            onChangeText={(text) => setFormData({...formData, phone: text})}
            placeholder="(+91) 9876543210"
            keyboardType="phone-pad"
            className="text-base"
          />
        </View>
      </View>

      {/* Location Field */}
      <View className="mb-6">
        <Text className="text-gray-700 mb-1">Location (Optional)</Text>
        <View className="border border-gray-300 rounded-lg p-2">
          <TextInput
            value={formData.location}
            onChangeText={(text) => setFormData({...formData, location: text})}
            placeholder="New Delhi, IN"
            className="text-base"
          />
        </View>
      </View>

      {/* Sign Up Button */}
      <Pressable
        onPress={() => signUpWithEmail()}
        className="bg-[dodgerblue] py-3 rounded-lg items-center mb-4"
      >
        <Text className="text-white font-bold text-lg">Sign Up</Text>
      </Pressable>

      {/* Sign In Link */}
      <View className="flex-row justify-center">
        <Text className="text-gray-600">Already have an account? </Text>
        <Link href="/SignIn" asChild>
          <Pressable>
            <Text className="text-[dodgerblue] font-medium">Sign In</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
};

export default SignUp;