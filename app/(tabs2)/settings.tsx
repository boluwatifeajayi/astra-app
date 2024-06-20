import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { server } from '@/server';
import { router } from 'expo-router';

const ProfileScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editableUser, setEditableUser] = useState<any>(null);
  const [courses, setCourses] = useState<string[]>([]);
  const [teachingMethods, setTeachingMethods] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchData();
    fetchCourses();
    fetchTeachingMethods();
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
      setEditableUser({ ...response.data });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${server}/skills`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchTeachingMethods = async () => {
    try {
      const response = await axios.get(`${server}/learning-styles`);
      setTeachingMethods(response.data);
    } catch (error) {
      console.error('Error fetching teaching methods:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const token = await AsyncStorage.getItem('tutorToken');
    if (!token) {
      // Handle token not found, maybe redirect to login
      return;
    }

    try {
      // Update user profile
      const response = await axios.put(`${server}/tutors/update`, editableUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data);
      setHasChanges(false);
      Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
    } catch (error) {
      console.error('Error updating user profile:', error);
      Alert.alert('Update Failed', 'There was an error updating your profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field:any, value:any) => {
    setEditableUser({ ...editableUser, [field]: value });
    setHasChanges(true);
  };

  const toggleSelection = (field:any, item:any) => {
    const currentArray = editableUser[field];
    if (currentArray.includes(item)) {
      handleChange(field, currentArray.filter((i:any) => i !== item));
    } else {
      handleChange(field, [...currentArray, item]);
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
      <View className="justify-center items-center mb-52 px-8">
        <Ionicons name="person-circle-outline" size={100} color="dodgerblue" className="flex justify-center items-center mb-8" />

        <View className="w-full mb-4">
          <Text className="font-bold mb-1">First Name:</Text>
          <TextInput
            className="bg-gray-200 rounded-xl w-full py-4 px-4 font-semibold"
            placeholder="First Name"
            placeholderTextColor="#999"
            value={editableUser.firstName}
            onChangeText={(text) => handleChange('firstName', text)}
          />
        </View>

        <View className="w-full mb-4">
          <Text className="font-bold mb-1">Last Name:</Text>
          <TextInput
            className="bg-gray-200 rounded-xl w-full py-4 px-4 font-semibold"
            placeholder="Last Name"
            placeholderTextColor="#999"
            value={editableUser.lastName}
            onChangeText={(text) => handleChange('lastName', text)}
          />
        </View>

        <View className="w-full mb-4">
          <Text className="font-bold mb-1">Email:</Text>
          <TextInput
            className="bg-gray-200 rounded-xl w-full py-4 px-4 font-semibold"
            placeholder="Email"
            placeholderTextColor="#999"
            value={editableUser.email}
            editable={false}
          />
        </View>

        <View className="w-full mb-4">
          <Text className="font-bold mb-1">Available Time:</Text>
          <TextInput
            className="bg-gray-200 rounded-xl w-full py-4 px-4 font-semibold"
            placeholder="Available Time"
            placeholderTextColor="#999"
            value={editableUser.availableTime}
            onChangeText={(text) => handleChange('availableTime', text)}
            multiline={true}
          />
        </View>

        <View className="w-full mb-4">
          <Text className="font-bold mb-1">Qualifications:</Text>
          <TextInput
            className="bg-gray-200 rounded-xl w-full py-4 px-4 font-semibold"
            placeholder="Qualifications"
            placeholderTextColor="#999"
            value={editableUser.qualifications}
            onChangeText={(text) => handleChange('qualifications', text)}
          />
        </View>

        <View className="w-full mb-4">
          <Text className="font-bold mb-2">Courses:</Text>
          <View className="flex-row flex-wrap">
            {courses.map((course, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleSelection('courses', course)}
                className={`bg-white border ${editableUser.courses.includes(course) ? 'border-green-500' : 'border-gray-300'} rounded-full py-2 px-4 mr-2 mb-2 font-semibold`}
              >
                <Text>{course}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="w-full mb-8">
          <Text className="font-bold mb-2">Teaching Methods:</Text>
          <View className="flex-row flex-wrap">
            {teachingMethods.map((method, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleSelection('teachingMethods', method)}
                className={`bg-white border ${editableUser.teachingMethods.includes(method) ? 'border-green-500' : 'border-gray-300'} rounded-full py-2 px-4 mr-2 mb-2 font-semibold`}
              >
                <Text>{method}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {hasChanges && (
          <TouchableOpacity onPress={handleSave} className="bg-white border mb-4 border-green-500 rounded-xl w-full py-4">
            {isSaving ? (
              <ActivityIndicator size="small" color="#00FF00" />
            ) : (
              <Text className="text-green-500 text-center font-semibold">Save Changes</Text>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={async () => {
            try {
              await AsyncStorage.removeItem('tutorToken');
              router.push('/');
            } catch (error) {
              console.error('Error removing tutorToken from AsyncStorage:', error);
            }
          }}
          className="bg-white border w-full border-red-500 rounded-xl py-4 mb-8"
        >
          <Text className="text-red-500 text-center font-bold">Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
