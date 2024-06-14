import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { server } from '@/server';
import moment from 'moment';

const TutorDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentData = async () => {
    try {
      const response = await axios.get(`${server}/students/get/${id}`);
      setStudent(response.data);
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError('Failed to load student data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-blue-50">
        <ActivityIndicator size="large" color="dodgerblue" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-blue-50">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-blue-50 pt-12">
      <ScrollView className="px-4 py-6">
        <TouchableOpacity
          className="absolute top-4 left-1 bg-gray-200 rounded-full p-3 mb-3 z-10"
          onPress={() => router.push("/dashboard")}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <Text className="text-4xl font-pbold mb-4 pt-20">{student.firstName} {student.lastName}</Text>

        <Text className="text-lg font-pbold mb-2">Discipline:</Text>
        <Text className="font-pregular mb-8">{student.discipline}</Text>

        <Text className="text-lg font-pbold mb-2">Learning styles</Text>
        <View className="flex-row flex-wrap mb-6">
          {student.learningStyle.map((style: string, index: number) => (
            <Text key={index} className="bg-gray-200 text-gray-700 font-semibold py-1 px-3 rounded-full mr-2 mb-2">
              {style}
            </Text>
          ))}
        </View>

        <Text className="text-lg font-pbold mb-2">Courses</Text>
        <View className="flex-row flex-wrap mb-6">
          {student.courses.map((course: string, index: number) => (
            <Text key={index} className="bg-gray-200 text-gray-700 font-semibold py-1 px-3 rounded-full mr-2 mb-2">
              {course}
            </Text>
          ))}
        </View>

        <Text className="text-lg font-pbold mb-2">Joined</Text>
        <Text className="font-pregular mb-8">{moment(student.createdAt).fromNow()}</Text>

        <TouchableOpacity className="bg-blue-500 rounded-xl py-4 mb-4">
          <Text className="text-white text-center font-pbold">Send Message</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default TutorDetails;
