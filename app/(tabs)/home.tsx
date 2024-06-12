import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const Explore = () => {
  const tutors = [
    {
      name: 'John Doe',
      qualification: 'Ph.D. in Mathematics',
      teachingStyles: ['Visual', 'Auditory'],
      bgColor: 'bg-blue-200',
    },
    {
      name: 'Jane Smith',
      qualification: 'Master in English Lit',
      teachingStyles: ['Writing', 'Kinesthetic'],
      bgColor: 'bg-green-200',
    },
    {
      name: 'Michael Johnson',
      qualification: 'Bachelor in Computer Science',
      teachingStyles: ['Visual', 'Kinesthetic'],
      bgColor: 'bg-yellow-200',
    },
    {
      name: 'Emily Davis',
      qualification: 'Ph.D. in Physics',
      teachingStyles: ['Auditory', 'Reading/Writing'],
      bgColor: 'bg-purple-200',
    },
  ];

  const trendingSkills = [
    { label: 'Mathematics', bgColor: 'bg-blue-500' },
    { label: 'English', bgColor: 'bg-green-500' },
    { label: 'Computer Science', bgColor: 'bg-yellow-500' },
    { label: 'Physics', bgColor: 'bg-purple-500' },
    { label: 'Chemistry', bgColor: 'bg-orange-500' },
  ];

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 bg-orange-50">
      <View className="px-5 pt-16">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-gray-400 font-psemibold">Good Morning</Text>
            <Text className="text-2xl font-pbold text-gray-800">Boluwatife</Text>
            <Text className=" font-psemibold text-orange-600">Student</Text>
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
          />
        </View>

        <Text className="text-xl font-pbold text-gray-800 mb-2">Top Matched Tutors</Text>

        <View className="flex-row flex-wrap  justify-between mb-8">
          {tutors.map((tutor, index) => (
            <View key={index} className={`w-[49%] p-4 mt-2  rounded-xl ${tutor.bgColor}`}>
              <Text className="text-lg font-pbold text-gray-800 mb-2">{tutor.name}</Text>
              <Text className="text-gray-600 font-psemibold mb-2">{tutor.qualification}</Text>
              <Text className="text-gray-600 font-psemibold mb-4">
                Teaching Styles: {tutor.teachingStyles.join(', ')}
              </Text>
              <TouchableOpacity className="py-2 px-4 bg-white rounded-xl">
                <Text className=" text-orange-600 font-pbold">Learn More</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text className="text-xl font-pbold text-gray-800 mb-4">Trending Skills</Text>

        <View>
          {trendingSkills.map((skill, index) => (
            <TouchableOpacity
              key={index}
              className={`flex-row items-center justify-between py-4 px-5 mb-4 rounded-xl ${skill.bgColor}`}
            >
              <Text className="text-white font-pbold">{skill.label}</Text>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Explore;