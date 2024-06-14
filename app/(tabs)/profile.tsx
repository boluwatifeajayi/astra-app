import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { server } from '@/server';
import { router } from 'expo-router';

const ProfileScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      // Handle token not found, maybe redirect to login
      return;
    }

    try {
      // Fetch user profile
      const response = await axios.get(`${server}/students/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <View className="flex-1 justify-center items-center bg-orange-50">
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-orange-50 pt-24">
      <View className="items-center px-8">
        <Ionicons name="person-circle-outline" size={100} color="#FF6600" className="mb-8" />

        <View className="mb-4 w-full">
          <Text className="text-gray-700 mb-2 font-semibold">First Name</Text>
          <TextInput
            className="bg-gray-200 rounded-xl w-full py-4 px-4 mb-2 font-semibold"
            placeholder="First Name"
            placeholderTextColor="#999"
            value={user.firstName}
            editable={false}
          />
        </View>
        <View className="mb-4 w-full">
          <Text className="text-gray-700 mb-2 font-semibold">Last Name</Text>
          <TextInput
            className="bg-gray-200 rounded-xl w-full py-4 px-4 mb-2 font-semibold"
            placeholder="Last Name"
            placeholderTextColor="#999"
            value={user.lastName}
            editable={false}
          />
        </View>
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-semibold">Courses</Text>
          <View className="flex flex-row flex-wrap">
            {user.courses.map((course: string, index: number) => (
              <Text key={index} className="bg-white border border-gray-300 rounded-full py-2 px-4 mr-2 mb-2 font-semibold">{course}</Text>
            ))}
          </View>
        </View>
        <View className="mb-8">
          <Text className="text-gray-700 mb-2 font-semibold">Learning Styles</Text>
          <View className="flex flex-row flex-wrap">
            {user.learningStyle.map((style: string, index: number) => (
              <Text key={index} className="bg-white border border-gray-300 rounded-full py-2 px-4 mr-2 mb-2 font-semibold">{style}</Text>
            ))}
          </View>
        </View>
        <View className="mb-4 w-full">
          <Text className="text-gray-700 mb-2 font-semibold">Discipline</Text>
          <TextInput
            className="bg-gray-200 rounded-xl w-full py-4 px-4 mb-8 font-semibold"
            placeholder="Discipline"
            placeholderTextColor="#999"
            value={user.discipline}
            editable={false}
          />
        </View>

        <TouchableOpacity onPress={() => router.push("/")} className="bg-white border mb-60 border-red-500 rounded-xl w-full py-4">
          <Text className="text-red-500 text-center font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
