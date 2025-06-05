import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { RadioButton } from 'react-native-paper';
import { router } from 'expo-router';
import { useInsertBook } from '../api';
import { useAuth } from '../contexts/AuthProvider';

import * as FileSystem from 'expo-file-system';
import { randomUUID } from 'expo-crypto';
import { supabase } from '../lib/supabase';
import { decode } from 'base64-arraybuffer';
import { SUPABASE_URL } from '@env';

const AddBook = () => {
  // Form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [condition, setCondition] = useState<'Like New' | 'Good' | 'Fair' | 'Poor'>('Good');
  const [intent, setIntent] = useState<'Giveaway' | 'Exchange'>('Giveaway');
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // API and auth
  const { mutate: insertBook, error: insertBookError } = useInsertBook();
  const { session } = useAuth();
  
  // UI state
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentUpload, setCurrentUpload] = useState(0);
  const [totalUploads, setTotalUploads] = useState(0);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!author.trim()) newErrors.author = 'Author is required';
    if (images.length < 2) newErrors.images = 'Please add at least 2 images (front and back)';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImage = async (image?: string) => {
    if (!image?.startsWith('file://')) {
      return null;
    }
    
    try {
      const base64 = await FileSystem.readAsStringAsync(image, {
        encoding: 'base64'
      });
      
      const filePath = `${session?.user.id}/${randomUUID()}.png`;
      const contentType = 'image/png';
      
      const { data, error } = await supabase
        .storage
        .from('book-images')
        .upload(filePath, decode(base64), { contentType });
      
      if (error) {
        console.error('Upload error:', error);
        throw error;
      }
      
      return `${SUPABASE_URL}/storage/v1/object/public/book-images/${data.path}`;
    } catch (error) {
      console.error('Failed to upload image:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    if (!session?.user.id) {
      Alert.alert('Authentication required', 'Please sign in to add a book');
      router.push('/');
      return;
    }
    
    setSubmitLoading(true);
    setTotalUploads(images.length);
    setCurrentUpload(0);
    setUploadProgress(0);

    try {
      // Upload images sequentially with progress tracking
      const uploadedImages: string[] = [];
      
      for (let i = 0; i < images.length; i++) {
        setCurrentUpload(i + 1);
        const uploadedPath = await uploadImage(images[i]);
        if (uploadedPath) {
          uploadedImages.push(uploadedPath);
        }
        setUploadProgress(((i + 1) / images.length) * 100);
      }

      const newBook = {
        title,
        author,
        images: uploadedImages,
        condition,
        owner_id: session.user.id,
        intent,
        description: description || undefined,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : undefined,
      };
      
      insertBook(newBook, {
        onSuccess: () => {
          setIsSuccess(true);
          setTimeout(() => {
            setIsSuccess(false);
            router.push('/(tabs)/explore');
          }, 2000);
        },
        onError: (error) => {
          Alert.alert(
            'Upload Failed', 
            error.message || 'Failed to add book. Please try again.'
          );
        }
      });
    } catch (error) {
      Alert.alert(
        'Upload Error', 
        'Something went wrong during upload. Please check your connection and try again.'
      );
      console.error('Submission error:', error);
    } finally {
      setSubmitLoading(false);
      setUploadProgress(0);
      setCurrentUpload(0);
      setTotalUploads(0);
    }
  };

  const pickImage = async (isCamera: boolean) => {
    if (submitLoading) return;
    
    let result;
    
    try {
      if (isCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission required', 
            'We need camera access to take photos. Please enable it in settings.'
          );
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [3, 4], // Better aspect ratio for book covers
          quality: 0.8, // Slightly compressed for faster uploads
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          selectionLimit: 5 - images.length,
          quality: 0.8,
        });
      }

      if (!result.canceled) {
        const newImages = isCamera 
          ? [result.assets[0].uri] 
          : result.assets.map(asset => asset.uri);
        setImages([...images, ...newImages]);
      }
    } catch (error) {
      Alert.alert(
        'Error', 
        'Failed to select images. Please try again.'
      );
      console.error('Image picker error:', error);
    }
  };

  const removeImage = (index: number) => {
    if (submitLoading) return;
    
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <ScrollView className="flex-1 p-4 bg-gray-50" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Success Modal */}
      {isSuccess && (
        <View className="absolute inset-0 z-50 bg-black/70 justify-center items-center">
          <View className="bg-white p-6 rounded-lg items-center w-4/5">
            <View className="bg-green-100 p-4 rounded-full mb-4">
              <Ionicons name="checkmark-circle" size={48} color="#10b981" />
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-2">Success!</Text>
            <Text className="text-gray-600 text-center mb-6">
              Your book has been added successfully.
            </Text>
            <Pressable
              onPress={() => {
                setIsSuccess(false);
                router.push('/(tabs)/explore');
              }}
              className="bg-green-600 px-6 py-3 rounded-md w-full items-center"
            >
              <Text className="text-white font-medium">Continue</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Loading Overlay */}
      {submitLoading && (
        <View className="absolute inset-0 z-40 bg-black/30 justify-center items-center">
          <View className="bg-white p-6 rounded-lg items-center w-4/5">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-lg font-medium text-gray-800 mt-4">
              Uploading your book...
            </Text>
            <Text className="text-gray-500 mt-2">
              {currentUpload} of {totalUploads} images uploaded
            </Text>
            <View className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <View 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              />
            </View>
          </View>
        </View>
      )}

      {/* Book Images Section */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2 text-gray-800">Book Images</Text>
        <Text className="text-sm text-gray-500 mb-3">
          Add at least 2 images (front and back cover)
          {images.length < 2 && (
            <Text className="text-red-500"> * Required</Text>
          )}
        </Text>
        
        {errors.images && (
          <Text className="text-red-500 text-sm mb-2">{errors.images}</Text>
        )}

        <View className="flex-row flex-wrap gap-3 mb-3">
          {images.map((uri, index) => (
            <View key={index} className="relative">
              <Image 
                source={{ uri }} 
                className="w-20 h-28 rounded-md"
              />
              <Pressable
                onPress={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center shadow-sm"
                disabled={submitLoading}
              >
                <Ionicons name="close" size={16} color="white" />
              </Pressable>
              <Text className="text-xs text-center mt-1 text-gray-600">
                {index === 0 ? 'Front' : index === 1 ? 'Back' : `Extra ${index - 1}`}
              </Text>
            </View>
          ))}
          
          {images.length < 5 && (
            <>
              <Pressable
                onPress={() => pickImage(true)}
                className={`w-20 h-28 border-2 border-dashed rounded-md items-center justify-center ${
                  submitLoading ? 'border-gray-200 bg-gray-100' : 'border-gray-300 bg-white'
                }`}
                disabled={submitLoading}
              >
                <FontAwesome 
                  name="camera" 
                  size={24} 
                  color={submitLoading ? '#d1d5db' : '#6b7280'} 
                />
                <Text className={`text-xs mt-1 ${
                  submitLoading ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Camera
                </Text>
              </Pressable>
              
              <Pressable
                onPress={() => pickImage(false)}
                className={`w-20 h-28 border-2 border-dashed rounded-md items-center justify-center ${
                  submitLoading ? 'border-gray-200 bg-gray-100' : 'border-gray-300 bg-white'
                }`}
                disabled={submitLoading}
              >
                <FontAwesome 
                  name="photo" 
                  size={24} 
                  color={submitLoading ? '#d1d5db' : '#6b7280'} 
                />
                <Text className={`text-xs mt-1 ${
                  submitLoading ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Gallery
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </View>

      {/* Book Details Section */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-4 text-gray-800">Book Details</Text>
        
        <View className="mb-4">
          <Text className="font-medium text-gray-700 mb-1">
            Title <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Enter book title"
            placeholderTextColor="#9ca3af"
            editable={!submitLoading}
            className={`border rounded-md p-3 ${
              errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
            } ${submitLoading ? 'bg-gray-100' : 'bg-white'}`}
          />
          {errors.title && (
            <Text className="text-red-500 text-sm mt-1">{errors.title}</Text>
          )}
        </View>
        
        <View className="mb-4">
          <Text className="font-medium text-gray-700 mb-1">
            Author <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={author}
            onChangeText={setAuthor}
            placeholder="Enter author name"
            placeholderTextColor="#9ca3af"
            editable={!submitLoading}
            className={`border rounded-md p-3 ${
              errors.author ? 'border-red-500 bg-red-50' : 'border-gray-300'
            } ${submitLoading ? 'bg-gray-100' : 'bg-white'}`}
          />
          {errors.author && (
            <Text className="text-red-500 text-sm mt-1">{errors.author}</Text>
          )}
        </View>
        
        <View className="mb-4">
          <Text className="font-medium text-gray-700 mb-1">Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Enter book description"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            editable={!submitLoading}
            className={`border rounded-md p-3 h-24 textAlignVertical='top' ${
              submitLoading ? 'bg-gray-100' : 'bg-white'
            } border-gray-300`}
          />
        </View>
        
        <View className="mb-4">
          <Text className="font-medium text-gray-700 mb-1">Tags</Text>
          <TextInput
            value={tags}
            onChangeText={setTags}
            placeholder="fiction, fantasy, mystery, etc."
            placeholderTextColor="#9ca3af"
            editable={!submitLoading}
            className={`border rounded-md p-3 ${
              submitLoading ? 'bg-gray-100' : 'bg-white'
            } border-gray-300`}
          />
          <Text className="text-xs text-gray-500 mt-1">
            Separate tags with commas
          </Text>
        </View>
      </View>

      {/* Condition Section */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-3 text-gray-800">Condition</Text>
        <RadioButton.Group 
          onValueChange={value => setCondition(value as any)} 
          value={condition}
        >
          <View className="flex-row items-center mb-2">
            <RadioButton 
              value="Like New" 
              color="#3b82f6" 
              disabled={submitLoading}
            />
            <Text className={`ml-2 ${submitLoading ? 'text-gray-400' : 'text-gray-700'}`}>
              Like New - No visible wear
            </Text>
          </View>
          <View className="flex-row items-center mb-2">
            <RadioButton 
              value="Good" 
              color="#3b82f6" 
              disabled={submitLoading}
            />
            <Text className={`ml-2 ${submitLoading ? 'text-gray-400' : 'text-gray-700'}`}>
              Good - Minor wear
            </Text>
          </View>
          <View className="flex-row items-center mb-2">
            <RadioButton 
              value="Fair" 
              color="#3b82f6" 
              disabled={submitLoading}
            />
            <Text className={`ml-2 ${submitLoading ? 'text-gray-400' : 'text-gray-700'}`}>
              Fair - Noticeable wear
            </Text>
          </View>
          <View className="flex-row items-center">
            <RadioButton 
              value="Poor" 
              color="#3b82f6" 
              disabled={submitLoading}
            />
            <Text className={`ml-2 ${submitLoading ? 'text-gray-400' : 'text-gray-700'}`}>
              Poor - Significant wear
            </Text>
          </View>
        </RadioButton.Group>
      </View>

      {/* Intent Section */}
      <View className="mb-8">
        <Text className="text-lg font-bold mb-3 text-gray-800">Intent</Text>
        <View className="flex-row">
          <Pressable
            onPress={() => !submitLoading && setIntent('Giveaway')}
            disabled={submitLoading}
            className={`flex-1 items-center py-3 rounded-l-md ${
              intent === 'Giveaway' 
                ? 'border-2 border-blue-500 bg-blue-50' 
                : 'border border-gray-300 bg-white'
            } ${submitLoading ? 'opacity-70' : ''}`}
          >
            <MaterialIcons 
              name="card-giftcard" 
              size={24} 
              color={intent === 'Giveaway' ? '#3b82f6' : '#6b7280'} 
            />
            <Text className={`mt-1 ${
              intent === 'Giveaway' ? 'text-blue-600 font-medium' : 'text-gray-600'
            }`}>
              Giveaway
            </Text>
          </Pressable>
          <Pressable
            onPress={() => !submitLoading && setIntent('Exchange')}
            disabled={submitLoading}
            className={`flex-1 items-center py-3 rounded-r-md ${
              intent === 'Exchange' 
                ? 'border-2 border-blue-500 bg-blue-50' 
                : 'border border-gray-300 bg-white'
            } ${submitLoading ? 'opacity-70' : ''}`}
          >
            <MaterialIcons 
              name="swap-horiz" 
              size={24} 
              color={intent === 'Exchange' ? '#3b82f6' : '#6b7280'} 
            />
            <Text className={`mt-1 ${
              intent === 'Exchange' ? 'text-blue-600 font-medium' : 'text-gray-600'
            }`}>
              Exchange
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Location Section */}
      <View className="mb-8">
        <Text className="text-lg font-bold mb-3 text-gray-800">Location</Text>
        <View className={`flex-row items-center p-3 rounded-md ${
          submitLoading ? 'bg-gray-100' : 'bg-blue-50'
        }`}>
          <Ionicons 
            name="location" 
            size={20} 
            color={submitLoading ? '#9ca3af' : '#3b82f6'} 
          />
          <Text className={`ml-2 ${submitLoading ? 'text-gray-500' : 'text-blue-600'}`}>
            Using your current location
          </Text>
        </View>
        <Text className={`text-sm mt-2 ${
          submitLoading ? 'text-gray-400' : 'text-gray-500'
        }`}>
          We'll automatically use your current location for this listing.
        </Text>
      </View>

      {/* Submit Button */}
      <Pressable
        onPress={handleSubmit}
        disabled={submitLoading}
        className={`py-4 rounded-md items-center justify-center mb-8 ${
          submitLoading ? 'bg-blue-400' : 'bg-blue-600'
        }`}
      >
        {submitLoading ? (
          <View className="flex-row items-center">
            <ActivityIndicator color="white" className="mr-2" />
            <Text className="text-white font-bold text-lg">Processing...</Text>
          </View>
        ) : (
          <Text className="text-white font-bold text-lg">Add Book</Text>
        )}
      </Pressable>
    </ScrollView>
  );
};

export default AddBook;