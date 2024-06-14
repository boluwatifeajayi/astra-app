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
    const token = await AsyncStorage.getItem('tutorToken');
    if (!token) {
      // Handle token not found, maybe redirect to login
      return;
    }

    try {
      // Fetch user profile
      const response = await axios.get(`${server}/tutors/me`, {
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
      <View className="flex-1 justify-center items-center bg-blue-50">
        <ActivityIndicator size="large" color="dodgerblue" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-blue-50 pt-24">
      <View className="justify-center items-center  mb-52 px-8">
        <Ionicons name="person-circle-outline" size={100} color="dodgerblue" className="flex justify-center items-center mb-8" />

        <View className="w-full mb-4">
          <Text className="font-bold mb-1">First Name:</Text>
          <TextInput
            className="bg-gray-200 rounded-xl w-full py-4 px-4 font-semibold"
            placeholder="First Name"
            placeholderTextColor="#999"
            value={user.firstName}
            editable={false}
          />
        </View>

        <View className="w-full mb-4">
          <Text className="font-bold mb-1">Last Name:</Text>
          <TextInput
            className="bg-gray-200 rounded-xl w-full py-4 px-4 font-semibold"
            placeholder="Last Name"
            placeholderTextColor="#999"
            value={user.lastName}
            editable={false}
          />
        </View>

        <View className="w-full mb-4">
          <Text className="font-bold mb-1">Email:</Text>
          <TextInput
            className="bg-gray-200 rounded-xl w-full py-4 px-4 font-semibold"
            placeholder="Email"
            placeholderTextColor="#999"
            value={user.email}
            editable={false}
          />
        </View>

        <View className="w-full mb-4">
          <Text className="font-bold mb-1">Available Time:</Text>
          <TextInput
            className="bg-gray-200 rounded-xl w-full py-4 px-4 font-semibold"
            placeholder="Available Time"
            placeholderTextColor="#999"
            value={user.availableTime}
            editable={false}
            multiline={true}
          />
        </View>

        <View className="w-full mb-4">
          <Text className="font-bold mb-1">Qualifications:</Text>
          <TextInput
            className="bg-gray-200 rounded-xl w-full py-4 px-4 font-semibold"
            placeholder="Qualifications"
            placeholderTextColor="#999"
            value={user.qualifications}
            editable={false}
          />
        </View>

        <View className="w-full mb-4">
          <Text className="font-bold mb-2">Courses:</Text>
          <View className="flex-row flex-wrap">
            {user.courses.map((course: string, index: number) => (
              <View key={index} className="bg-blue-200 rounded-full px-3 py-1 m-1">
                <Text className="text-blue-800">{course}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="w-full mb-8">
          <Text className="font-bold mb-2">Teaching Methods:</Text>
          <View className="flex-row flex-wrap">
            {user.teachingMethods.map((method: string, index: number) => (
              <View key={index} className="bg-green-200 rounded-full px-3 py-1 m-1">
                <Text className="text-green-800">{method}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="w-full mb-8">
          <Text className="font-bold mb-2">Reviews:</Text>
          {user.reviews.map((review: any, index: number) => (
            <View key={index} className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-semibold">{review.studentFirstName} {review.studentLastName}</Text>
                <Text className="text-yellow-500">{"⭐".repeat(review.rating)}</Text>
              </View>
              <Text>{review.comment}</Text>
              <Text className="text-gray-500 text-sm mt-2">{new Date(review.createdDate).toLocaleDateString()}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={() => router.push("/")} className="bg-white border w-full border-red-500 rounded-xl py-4 mb-8">
          <Text className="text-red-500 text-center font-pbold">Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;