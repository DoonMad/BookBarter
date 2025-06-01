import { View, Text, TextInput, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <Text className="text-2xl font-bold text-gray-900 mb-8 text-center">Sign In</Text>
      
      {/* Email Field */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Email</Text>
        <View className={`border rounded-lg p-3 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="john.smith@example.com"
            className="text-base"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {errors.email && <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>}
      </View>

      {/* Password Field */}
      <View className="mb-6">
        <Text className="text-gray-700 mb-1">Password</Text>
        <View className={`border rounded-lg p-3 flex-row items-center ${errors.password ? 'border-red-500' : 'border-gray-300'}`}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            className="flex-1 text-base"
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons 
              name={showPassword ? 'eye-off' : 'eye'} 
              size={20} 
              color="#6b7280" 
            />
          </Pressable>
        </View>
        {errors.password && <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>}
      </View>

      {/* Sign In Button */}
      <Pressable
        onPress={() => validate() && console.log('Sign in')}
        className="bg-[dodgerblue] py-3 rounded-lg items-center mb-4"
      >
        <Text className="text-white font-bold text-lg">Sign In</Text>
      </Pressable>

      {/* Sign Up Link */}
      <View className="flex-row justify-center">
        <Text className="text-gray-600">Don't have an account? </Text>
        <Link href="/SignUp" asChild>
          <Pressable>
            <Text className="text-[dodgerblue] font-medium">Sign Up</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
};

export default SignIn;