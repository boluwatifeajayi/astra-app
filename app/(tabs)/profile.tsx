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
  const [skills, setSkills] = useState<string[]>([]);
  const [learningStyles, setLearningStyles] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchData();
    fetchSkills();
    fetchLearningStyles();
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
      setEditableUser({ ...response.data });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await axios.get(`${server}/skills`);
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const fetchLearningStyles = async () => {
    try {
      const response = await axios.get(`${server}/learning-styles`);
      setLearningStyles(response.data);
    } catch (error) {
      console.error('Error fetching learning styles:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      // Handle token not found, maybe redirect to login
      return;
    }

    try {
      // Update user profile
      const response = await axios.put(`${server}/students/update`, editableUser, {
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

  const toggleSelection = (field: string, item: any) => {
    const currentArray: any = editableUser[field];
    if (currentArray.includes(item)) {
      handleChange(field, currentArray.filter((i: any) => i !== item));
    } else {
      handleChange(field, [...currentArray, item]);
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
            value={editableUser.firstName}
            onChangeText={(text) => handleChange('firstName', text)}
          />
        </View>
        <View className="mb-4 w-full">
          <Text className="text-gray-700 mb-2 font-semibold">Last Name</Text>
          <TextInput
            className="bg-gray-200 rounded-xl w-full py-4 px-4 mb-2 font-semibold"
            placeholder="Last Name"
            placeholderTextColor="#999"
            value={editableUser.lastName}
            onChangeText={(text) => handleChange('lastName', text)}
          />
        </View>
        <View className="mb-4 w-full">
          <Text className="text-gray-700 mb-2 font-semibold">Courses</Text>
          <View className="flex flex-row flex-wrap">
            {skills.map((skill, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleSelection('courses', skill)}
                className={`bg-white text-sm border ${editableUser.courses.includes(skill) ? 'border-green-500 bg-green-50' : 'border-gray-300'} rounded-full py-2 px-4 mr-2 mb-2 font-semibold`}
              >
                <Text>{skill}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View className="mb-8 w-full">
          <Text className="text-gray-700 mb-2 font-semibold">Learning Styles</Text>
          <View className="flex flex-row flex-wrap">
            {learningStyles.map((style, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleSelection('learningStyle', style)}
                className={`bg-white text-sm border ${editableUser.learningStyle.includes(style) ? 'border-green-500 bg-green-50' : 'border-gray-300'} rounded-full py-2 px-4 mr-2 mb-2 font-semibold`}
              >
                <Text>{style}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View className="mb-4 w-full">
          <Text className="text-gray-700 mb-2 font-semibold">Discipline</Text>
          <TextInput
            className="bg-gray-200 rounded-xl w-full py-4 px-4 mb-8 font-semibold"
            placeholder="Discipline"
            placeholderTextColor="#999"
            value={editableUser.discipline}
            onChangeText={(text) => handleChange('discipline', text)}
          />
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
              await AsyncStorage.removeItem('userToken');
              router.push('/');
            } catch (error) {
              console.error('Error removing studentToken from AsyncStorage:', error);
            }
          }}
          className="bg-white border mb-60 border-red-500 rounded-xl w-full py-4"
        >
          <Text className="text-red-500 text-center font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
