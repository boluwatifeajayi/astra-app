import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Tutor {
  name: string;
  courses: string[];
}

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Tutor[]>([]);

  const tutors: Tutor[] = [
    {
      name: 'John Doe',
      courses: ['Mathematics', 'Physics'],
    },
    {
      name: 'Jane Smith',
      courses: ['English Literature', 'Creative Writing'],
    },
    {
      name: 'Michael Johnson',
      courses: ['Computer Science', 'Web Development'],
    },
    // Add more tutor objects as needed
  ];

  const handleSearch = () => {
    // Perform search logic here and update searchResults state
    const filteredTutors = tutors.filter((tutor) =>
      tutor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredTutors);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 bg-blue-50 px-5 pt-16">
      <View className="mb-6">
        <Text className="text-2xl font-pbold text-gray-800 mt-4 mb-2">Search Courses, Students, and learning styles</Text>
        <View className="flex-row items-center mt-3 bg-gray-200 rounded-xl px-4 py-2">
          <TextInput
            className="flex-1 text-gray-600"
            placeholder="Search..."
            value={searchQuery}
            placeholderTextColor="#999"
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={handleSearch}>
            <Ionicons name="search" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      {searchResults.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Ionicons name="search" size={48} color="gray" />
          <Text className="text-gray-600 font-pregular text-lg mt-4">Search to see results</Text>
        </View>
      ) : (
        <View>
          <View className="flex-row flex-wrap justify-between mb-8">
            {searchResults.map((tutor, index) => (
              <View key={index} className="w-[48%] p-4 rounded-xl bg-white mb-4">
                <View className="mb-2">
                  <Text className="text-lg font-pbold text-gray-800">{tutor.name}</Text>
                  <Text className="text-gray-600 font-pregular">
                    Courses: {tutor.courses.join(', ')}
                  </Text>
                </View>
                <TouchableOpacity className="py-2 px-4 bg-blue-500 rounded-xl">
                  <Text className="text-white font-pbold">Learn More</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default Explore;