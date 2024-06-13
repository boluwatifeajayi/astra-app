import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const ProfileScreen = () => {
  return (
    <ScrollView className="flex-1 bg-blue-50 pt-24">
      <View className="justify-center items-center px-8">
        <Ionicons name="person-circle-outline" size={100} color="dodgerblue" className="flex justify-center items-center mb-8" />

        <TextInput
          className="bg-gray-200 rounded-xl w-full py-4 px-4 mb-4 font-semibold"
          placeholder="First Name"
          placeholderTextColor="#999"
        />
        <TextInput
          className="bg-gray-200 rounded-xl py-4 w-full px-4 mb-4 font-semibold"
          placeholder="Last Name"
          placeholderTextColor="#999"
        />
        <TextInput
          className="bg-gray-200 rounded-xl w-full py-4 px-4 mb-4 font-semibold"
          placeholder="Discipline"
          placeholderTextColor="#999"
        />
        <TextInput
          className="bg-gray-200 rounded-xl w-full py-4 px-4 mb-8 font-semibold"
          placeholder="Learning Style"
          placeholderTextColor="#999"
        />

        <TouchableOpacity className="bg-blue-500 w-full rounded-xl py-4 mb-4">
          <Text className="text-white text-center font-pbold">Update</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/")} className="bg-white border w-full border-red-500 rounded-xl py-4 mb-8">
          <Text className="text-red-500 text-center font-pbold">Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;