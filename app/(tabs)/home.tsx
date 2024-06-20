import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { server } from '@/server';

const Explore = () => {
  const [user, setUser] = useState<any>(null);
  const [matchingTutors, setMatchingTutors] = useState<any[]>([]);
  const [trendingSkills, setTrendingSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      router.push('/');
      return;
    }

    try {
      const [userResponse, tutorsResponse, skillsResponse] = await Promise.all([
        axios.get(`${server}/students/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${server}/students/matching-tutors`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${server}/skills`),
      ]);

      setUser(userResponse.data);
      setMatchingTutors(tutorsResponse.data.slice(0, 4));
      setTrendingSkills(skillsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      await AsyncStorage.removeItem('userToken');
      router.push('/student-login');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const tutorBackgroundColors = ['bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-purple-200'];
  const skillBackgroundColors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-orange-500'];

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-orange-50">
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }



  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={16}
          color="#FFD700"
          style={{ marginRight: 2 }}
        />
      );
    }
    return (
      <View style={{ flexDirection: 'row' }}>
        {stars}
      </View>
    );
  };

  const calculateAverageRating = (reviews:any) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc:any, review:any) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10; // Round to 1 decimal place
  };


  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="flex-1 bg-orange-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FFA500']} />
      }
    >
      <View className="px-5 pt-16">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-gray-400 font-psemibold">{getGreeting()}</Text>
            <Text className="text-2xl font-pbold text-gray-800">{user?.firstName} {user?.lastName} </Text>
            
            <Text className=" font-psemibold text-orange-600">{user?.role}</Text>
          </View>
          <View className="flex-row gap-1">
            <Ionicons name="notifications-outline" size={26} color="gray" className="mr-4" />
            <MaterialIcons name="account-circle" size={28} color="gray" />
          </View>
        </View>

        <View className="mb-6">
          <TextInput
            className="px-4 py-4 bg-white rounded-xl placeholder-gray-500"
            placeholder="Search tutors"
            placeholderTextColor="#999"
          />
        </View>

        <Text className="text-xl font-pbold text-gray-800 mb-2">Top Matched Tutors</Text>

        <View className="flex-row flex-wrap justify-between mb-8">
          {matchingTutors.map((tutor, index) => (
            <View key={tutor._id} className={`w-[49%] p-4 mt-2 rounded-xl ${tutorBackgroundColors[index % tutorBackgroundColors.length]}`}>
              <Text className="text-md font-pbold text-gray-800 mb-2">{tutor.firstName} {tutor.lastName}</Text>
              {renderStars(calculateAverageRating(tutor.reviews))}
              <Text className="text-gray-600 font-psemibold mb-2">{tutor.qualifications}</Text>
              <Text className="text-gray-600 font-psemibold mb-4">
                {tutor.teachingMethods.slice(0, 2).join(', ')}
              </Text>
              <TouchableOpacity onPress={() => router.push(`/innerscreens/tutorDetail/${tutor._id}`)} className="py-2 px-4 bg-white rounded-xl">
                <Text className=" text-orange-600 font-pbold">Learn More</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text className="text-xl font-pbold text-gray-800 mb-4">Trending Topics</Text>

        <View>
          {trendingSkills.map((skill, index) => (
            <TouchableOpacity
              key={index}
              className={`flex-row items-center justify-between py-4 px-5 mb-4 rounded-xl ${skillBackgroundColors[index % skillBackgroundColors.length]}`}
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