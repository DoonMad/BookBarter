import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Image, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthProvider';
import { supabase } from '@/src/lib/supabase';
import { decode } from 'base64-arraybuffer';
import { randomUUID } from 'expo-crypto';
import { useQueryClient } from '@tanstack/react-query';
import * as FileSystem from 'expo-file-system';
import { useUserbyId } from '@/src/api';

const EditProfileScreen = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const {data: user} = useUserbyId(session?.user.id)
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState<{name?: string; email?: string}>({});

  // Initialize form with current user data
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatar(user.avatar || null);
    }
  }, [user]);

  const validate = () => {
    const newErrors: typeof errors = {};
    
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Invalid email format';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required', 
          'We need access to your photos to upload a profile picture.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
      console.error('Image picker error:', error);
    }
  };

  const uploadAvatar = async (uri: string) => {
    if (!uri.startsWith('file://')) return null;
    
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64'
      });
      
      const filePath = `${session?.user.id}/${randomUUID()}.jpg`;
      const contentType = 'image/jpeg';
      
      const { data, error } = await supabase
        .storage
        .from('avatars')
        .upload(filePath, decode(base64), { contentType });
      
      if (error) throw error;
      
      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleUpdateProfile = async () => {
    if (!validate()) return;
    if (!session?.user.id) return;

    setIsUpdating(true);
    
    try {
      let avatarUrl = user?.avatar || null;
      
      // Upload new avatar if changed
      if (avatar && avatar !== user?.avatar && avatar.startsWith('file://')) {
        avatarUrl = await uploadAvatar(avatar);
      }

      // Update profile in Supabase
      const updates = {
        id: session.user.id,
        name,
        email,
        avatar: avatarUrl,
        // updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('users')
        .upsert(updates);

      if (error) throw error;

      // Update email in auth if changed
      if (email !== user?.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email,
        });

        if (emailError) {
          throw new Error("Auth error: "+emailError.message);
        }
        
        // If email changed, we need to inform the user to verify the new email
        Alert.alert(
          'Email Changed', 
          'Please check your new email for a verification link. You may need to sign in again.'
        );
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['user', session.user.id] });

      Alert.alert('Success', 'Profile updated successfully!');
      router.back();
    } catch (error) {
      let errorMessage = 'Failed to update profile. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert('Update Failed', errorMessage);
      console.error('Profile update error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View className="bg-white p-4 border-b border-gray-200 flex-row items-center">
        <Pressable 
          onPress={() => router.back()}
          className="p-2"
        >
          <Ionicons name="arrow-back" size={24} color="#3b82f6" />
        </Pressable>
        <Text className="text-xl font-bold ml-4 text-gray-800">Edit Profile</Text>
      </View>

      {/* Profile Picture */}
      <View className="items-center mt-6 mb-8">
        <View className="relative">
          <View className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
            {avatar ? (
              <Image 
                source={{ uri: avatar.startsWith('file://') ? avatar : avatar }} 
                className="w-full h-full"
              />
            ) : (
              <View className="flex-1 justify-center items-center">
                <FontAwesome name="user" size={48} color="#6b7280" />
              </View>
            )}
          </View>
          
          <Pressable
            onPress={pickImage}
            className="absolute bottom-0 right-0 bg-blue-500 rounded-full w-10 h-10 items-center justify-center"
          >
            <FontAwesome name="camera" size={16} color="white" />
          </Pressable>
        </View>
        
        <Pressable
          onPress={pickImage}
          className="mt-4"
        >
          <Text className="text-blue-600 font-medium">Change Photo</Text>
        </Pressable>
      </View>

      {/* Form */}
      <View className="px-4">
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-1">Full Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#9ca3af"
            className={`border rounded-lg p-3 ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}
          />
          {errors.name && (
            <Text className="text-red-500 text-sm mt-1">{errors.name}</Text>
          )}
        </View>
        
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            autoCapitalize="none"
            className={`border rounded-lg p-3 ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}
          />
          {errors.email && (
            <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
          )}
        </View>

        <Pressable
          onPress={handleUpdateProfile}
          disabled={isUpdating}
          className={`py-3 rounded-lg items-center justify-center mt-4 ${
            isUpdating ? 'bg-blue-400' : 'bg-blue-600'
          }`}
        >
          {isUpdating ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Save Changes</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default EditProfileScreen;