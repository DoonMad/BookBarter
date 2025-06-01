import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Image, Alert } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { RadioButton } from 'react-native-paper';
import { router } from 'expo-router';

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [condition, setCondition] = useState<'Like New' | 'Good' | 'Fair' | 'Poor'>('Good');
  const [intent, setIntent] = useState<'Giveaway' | 'Exchange'>('Giveaway');
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!author.trim()) newErrors.author = 'Author is required';
    if (images.length < 2) newErrors.images = 'Please add at least 2 images (front and back)';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    
    const newBook = {
      title,
      author,
      images,
      condition,
      ownerId: 1, // Will be replaced with actual user ID
      intent,
      description: description || undefined,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : undefined,
    };
    
    console.log('Submitting book:', newBook);
    console.log("here")
    // Here you would typically send this to your backend
    Alert.alert('Success', 'Book added successfully!');
    router.push('/(tabs)/explore')
  };

  const pickImage = async (isCamera: boolean) => {
    let result;
    
    if (isCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need camera access to take photos');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 2],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 5 - images.length, // Max 5 images total
        quality: 1,
      });
    }

    if (!result.canceled) {
      const newImages = isCamera 
        ? [result.assets[0].uri] 
        : result.assets.map(asset => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <ScrollView className="flex-1 p-4 bg-gray-50">
      {/* Book Images Section */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2 text-gray-800">Book Images</Text>
        <Text className="text-sm text-gray-500 mb-3">
          Add at least 2 images (front and back cover){' '}
          {images.length < 2 && (
            <Text className="text-red-500">* Required</Text>
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
                className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
              >
                <Ionicons name="close" size={16} color="white" />
              </Pressable>
              <Text className="text-xs text-center mt-1">
                {index === 0 ? 'Front' : index === 1 ? 'Back' : `Extra ${index - 1}`}
              </Text>
            </View>
          ))}
          
          {images.length < 5 && (
            <>
              <Pressable
                onPress={() => pickImage(true)}
                className="w-20 h-28 border-2 border-dashed border-gray-300 rounded-md items-center justify-center"
              >
                <FontAwesome name="camera" size={24} color="#6b7280" />
                <Text className="text-xs mt-1 text-gray-500">Camera</Text>
              </Pressable>
              
              <Pressable
                onPress={() => pickImage(false)}
                className="w-20 h-28 border-2 border-dashed border-gray-300 rounded-md items-center justify-center"
              >
                <FontAwesome name="photo" size={24} color="#6b7280" />
                <Text className="text-xs mt-1 text-gray-500">Gallery</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>

      {/* Book Details Section */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-4 text-gray-800">Book Details</Text>
        
        <View className="mb-4">
          <Text className="font-medium text-gray-700 mb-1">Title *</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Enter book title"
            className={`border rounded-md p-3 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.title && (
            <Text className="text-red-500 text-sm mt-1">{errors.title}</Text>
          )}
        </View>
        
        <View className="mb-4">
          <Text className="font-medium text-gray-700 mb-1">Author *</Text>
          <TextInput
            value={author}
            onChangeText={setAuthor}
            placeholder="Enter author name"
            className={`border rounded-md p-3 ${errors.author ? 'border-red-500' : 'border-gray-300'}`}
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
            multiline
            numberOfLines={4}
            className="border border-gray-300 rounded-md p-3 h-24 textAlignVertical='top'"
          />
        </View>
        
        <View className="mb-4">
          <Text className="font-medium text-gray-700 mb-1">Tags</Text>
          <TextInput
            value={tags}
            onChangeText={setTags}
            placeholder="Enter tags separated by commas (fiction, fantasy, etc.)"
            className="border border-gray-300 rounded-md p-3"
          />
        </View>
      </View>

      {/* Condition Section */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-3 text-gray-800">Condition</Text>
        <RadioButton.Group onValueChange={value => setCondition(value as any)} value={condition}>
          <View className="flex-row items-center mb-2">
            <RadioButton value="Like New" color="#3b82f6" />
            <Text className="ml-2">Like New</Text>
          </View>
          <View className="flex-row items-center mb-2">
            <RadioButton value="Good" color="#3b82f6" />
            <Text className="ml-2">Good</Text>
          </View>
          <View className="flex-row items-center mb-2">
            <RadioButton value="Fair" color="#3b82f6" />
            <Text className="ml-2">Fair</Text>
          </View>
          <View className="flex-row items-center">
            <RadioButton value="Poor" color="#3b82f6" />
            <Text className="ml-2">Poor</Text>
          </View>
        </RadioButton.Group>
      </View>

      {/* Intent Section */}
      <View className="mb-8">
        <Text className="text-lg font-bold mb-3 text-gray-800">Intent</Text>
        <View className="flex-row">
          <Pressable
            onPress={() => setIntent('Giveaway')}
            className={`flex-1 items-center py-3 rounded-l-md ${intent === 'Giveaway' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100 border border-gray-300'}`}
          >
            <MaterialIcons 
              name="card-giftcard" 
              size={24} 
              color={intent === 'Giveaway' ? '#3b82f6' : '#6b7280'} 
            />
            <Text className={`mt-1 ${intent === 'Giveaway' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
              Giveaway
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setIntent('Exchange')}
            className={`flex-1 items-center py-3 rounded-r-md ${intent === 'Exchange' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100 border border-gray-300'}`}
          >
            <MaterialIcons 
              name="swap-horiz" 
              size={24} 
              color={intent === 'Exchange' ? '#3b82f6' : '#6b7280'} 
            />
            <Text className={`mt-1 ${intent === 'Exchange' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
              Exchange
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Location Section */}
      <View className="mb-8">
        <Text className="text-lg font-bold mb-3 text-gray-800">Location</Text>
        <View className="flex-row items-center p-3 bg-blue-50 rounded-md">
          <Ionicons name="location" size={20} color="#3b82f6" />
          <Text className="ml-2 text-blue-600">Using your current location</Text>
        </View>
        <Text className="text-sm text-gray-500 mt-2">
          We'll automatically use your current location for this listing.
        </Text>
      </View>

      {/* Submit Button */}
      <Pressable
        onPress={handleSubmit}
        className="py-4 bg-blue-600 rounded-md items-center justify-center mb-8"
      >
        <Text className="text-white font-bold text-lg">Add Book</Text>
      </Pressable>
    </ScrollView>
  );
};

export default AddBook;