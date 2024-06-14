import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { router } from 'expo-router';
import { server } from '@/server'; // Replace with your server import

interface Tutor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  courses: string[];
  qualifications: string;
  teachingMethods: string[];
  role: string;
  reviews: any[]; // Define the structure based on actual data
}

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [placeholderText, setPlaceholderText] = useState('Start typing to search');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllTutors();
  }, []);

  const fetchAllTutors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${server}/tutors/tutors`);
      setSearchResults(response.data);
      setNoResults(response.data.length === 0);
      setError('');
    } catch (error) {
      console.error('Error fetching tutors:', error);
      setError('Error fetching tutors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${server}/tutors/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchResults(response.data);
      setNoResults(response.data.length === 0);
    } catch (error) {
      console.error('Error fetching tutors:', error);
      // Handle error scenario, e.g., show an error message
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setNoResults(false);
    setPlaceholderText('Start typing to search');
    fetchAllTutors(); // Reload all tutors when clearing search
  };

  const handleInputChange = (text: string) => {
    setSearchQuery(text);
    if (text.length === 0) {
      setPlaceholderText('Start typing to search');
      fetchAllTutors(); // Reload all tutors when search input is cleared
    } else {
      setPlaceholderText('');
    }
  };

  const handleReturnKey = () => {
    Keyboard.dismiss();
    handleSearch();
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 bg-orange-50 px-5 pt-16">
      <View className="mb-6">
        <Text className="text-2xl font-pbold text-gray-800 mt-4 mb-2">Search Courses, Tutors, and learning styles</Text>
        <View className="flex-row items-center mt-3 bg-gray-200 rounded-xl px-4 py-2">
          <TextInput
            className="flex-1 text-gray-600"
            placeholder={placeholderText}
            value={searchQuery}
            placeholderTextColor="#999"
            onChangeText={handleInputChange}
            onSubmitEditing={handleReturnKey} // Trigger search on return key press
          />
          <TouchableOpacity onPress={handleSearch}>
            <Ionicons name="search" size={24} color="gray" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleClearSearch} style={{ marginTop: 10 }}>
          <Text style={{ color: 'blue', fontSize: 16 }}>Clear Search</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="gray" />
          <Text className="text-gray-600 font-pregular text-lg mt-4">Searching...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-600 font-pregular text-lg mt-4">{error}</Text>
        </View>
      ) : noResults ? (
        <View className="flex-1 items-center justify-center">
          <Ionicons name="search" size={48} color="gray" />
          <Text className="text-gray-600 font-pregular text-lg mt-4">No results found</Text>
        </View>
      ) : (
        <View>
          <View className="flex-row flex-wrap justify-between mb-8">
            {searchResults.map((tutor) => (
              <View key={tutor._id} className="w-[48%] p-4 rounded-xl bg-white mb-4">
                <View className="mb-2">
                  <Text className="text-md font-pbold text-gray-800">{`${tutor.firstName} ${tutor.lastName}`}</Text>
                  <Text className="text-gray-600 font-pregular">
                    Courses: {tutor.courses.join(', ')}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push(`/innerscreens/tutorDetail/${tutor._id}`)} className="py-2 bg-white text-orange-600 rounded-xl">
                  <Text className="text-orange-600 font-pbold">Learn More - </Text>
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
