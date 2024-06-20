import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { server } from '@/server';

const Explore = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [matchedStudents, setMatchedStudents] = useState<any[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    const token = await AsyncStorage.getItem('tutorToken');
    if (!token) {
      router.push('/');
      return;
    }

    try {
      const response = await axios.get(`${server}/tutors/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      await AsyncStorage.removeItem('tutorToken');
      router.push('/tutor-login');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchMatchedStudents = async () => {
    try {
      const token = await AsyncStorage.getItem('tutorToken');
      const response = await axios.get(`${server}/tutors/matched-students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMatchedStudents(response.data);
    } catch (error) {
      console.error('Error fetching matched students:', error);
      setError('Failed to load matched students.');
    } finally {
      setDataLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await axios.get(`${server}/skills`);
      setSkills(response.data.slice(0, 7));
    } catch (error) {
      console.error('Error fetching skills:', error);
      setError('Failed to load skills.');
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchMatchedStudents();
    fetchSkills();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserData();
    fetchMatchedStudents();
    fetchSkills();
  }, []);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-orange-50">
        <ActivityIndicator size="large" color="dodgerblue" />
      </View>
    );
  }

  if (dataLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-orange-50">
        <ActivityIndicator size="large" color="dodgerblue" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-orange-50">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="flex-1 bg-blue-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['dodgerblue']} />
      }
    >
      <View className="px-5 pt-16">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-gray-400 font-psemibold">{getGreeting()}</Text>
            <Text className="text-2xl font-pbold text-gray-800">{user?.firstName} {user?.lastName}</Text>
            <Text className=" font-psemibold text-blue-600">{user?.role}</Text>
          </View>
          <View className="flex-row gap-1">
            <Ionicons name="notifications-outline" size={26} color="gray" className="mr-4" />
            <MaterialIcons name="account-circle" size={28} color="gray" />
          </View>
        </View>

        <View className="mb-6">
          <TextInput
            className="px-4 py-4 bg-white rounded-xl placeholder-gray-500"
            placeholder="Search students"
            placeholderTextColor="#999"
          />
        </View>

        <Text className="text-xl font-pbold text-gray-800 mb-2">Top Matched Students</Text>

        <View className="flex-row flex-wrap justify-between mb-8">
          {matchedStudents.map((student, index) => (
            <View key={index} className={`w-[49%] p-4 mt-2 rounded-xl bg-${index % 4 === 0 ? 'blue' : index % 4 === 1 ? 'green' : index % 4 === 2 ? 'yellow' : 'purple'}-200`}>
              <Text className="text-md font-pbold text-gray-800 mb-2">{student.firstName} {student.lastName}</Text>
              <Text className="text-gray-600 font-psemibold mb-2">{student.discipline}</Text>
              <Text className="text-gray-600 font-psemibold mb-4">
                {student.learningStyle?.join(', ')}
              </Text>
              <TouchableOpacity onPress={() => router.push(`/innerscreens/studentDetail/${student._id}`)} className="py-2 px-4 bg-white rounded-xl">
                <Text className="text-blue-600 font-pbold">Learn More</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text className="text-xl font-pbold text-gray-800 mb-4">Trending Skills</Text>

        <View>
          {skills.map((skill, index) => (
            <TouchableOpacity
              key={index}
              className={`flex-row items-center justify-between py-4 px-5 mb-4 rounded-xl bg-${index % 4 === 0 ? 'blue' : index % 4 === 1 ? 'green' : index % 4 === 2 ? 'yellow' : 'purple'}-500`}
            >
              <Text className="text-white font-pbold">{skill}</Text>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Explore;
