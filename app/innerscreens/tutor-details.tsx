import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const TutorDetails = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [time, setTime] = useState('');
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);

  // Sample data for reviews
interface Review {
  name: string;
  message: string;
  rating: number;
}

const reviewsData: Review[] = [
  { name: 'Alice Johnson', message: 'Great tutor! Very helpful and patient.', rating: 5 },
  { name: 'Bob Smith', message: 'Explains concepts clearly. Highly recommended.', rating: 4 },
  { name: 'Carol Davis', message: 'Good session, but could be more engaging.', rating: 3 },
];

  const handleBookSession = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setCourseName('');
    setTime('');
  };

  const handleSendMessage = () => {
    // Implement send message logic here
    console.log("Send message clicked");
  };

  const handleAddReview = () => {
    setReviewModalVisible(true);
  };

  const handleSubmitReview = () => {
    // Implement submit review logic here
    console.log("New review submitted:", newReview, "Rating:", newRating);
    setReviewModalVisible(false);
    setNewReview('');
    setNewRating(0);
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={16}
        color="#FFD700"
      />
    ));
  };

  return (
    <View className="flex-1 bg-orange-50 pt-12">
      <ScrollView className="px-4 py-6">
        <TouchableOpacity
          className="absolute top-4 left-1 bg-gray-200 rounded-full p-3 mb-3 z-10"
          onPress={() => router.push("/home")}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <Text className="text-4xl font-pbold mb-4 pt-20">Femi Olusanya</Text>

        <Text className="text-lg font-pbold mb-2">Qualifications:</Text>
        <Text className="font-pregular mb-8">
          - Bachelor's Degree in Education
          
          - 5 years of teaching experience
        
          - Certified in various teaching methodologies
        </Text>

        <Text className="text-lg font-pbold mb-2">Teaching styles</Text>

        <View className="flex-row flex-wrap mb-6">
          <Text className="bg-gray-200 text-gray-700 font-semibold py-1 px-3 rounded-full mr-2 mb-2">
            Visual
          </Text>
          <Text className="bg-gray-200 text-gray-700 font-semibold py-1 px-3 rounded-full mr-2 mb-2">
            Auditory
          </Text>
          <Text className="bg-gray-200 text-gray-700 font-semibold py-1 px-3 rounded-full mr-2 mb-2">
            Kinesthetic
          </Text>
        </View>

        <Text className="text-lg font-pbold mb-2">Courses</Text>
        <View className="flex-row flex-wrap mb-6">
          <Text className="bg-gray-200 text-gray-700 font-semibold py-1 px-3 rounded-full mr-2 mb-2">
            Math
          </Text>
          <Text className="bg-gray-200 text-gray-700 font-semibold py-1 px-3 rounded-full mr-2 mb-2">
            Science
          </Text>
          <Text className="bg-gray-200 text-gray-700 font-semibold py-1 px-3 rounded-full mr-2 mb-2">
            English
          </Text>
        </View>

        <Text className="text-lg font-pregular mb-2">Available Times:</Text>
        <Text className="font-semibold mb-6">Monday - Friday, 9:00 AM - 5:00 PM</Text>

        <TouchableOpacity
          className="bg-orange-500 rounded-xl py-4 mb-4"
          onPress={handleBookSession}
        >
          <Text className="text-white text-center font-pbold">Book Session</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-[transparent] border-2 border-orange-600 rounded-xl py-4 mb-4"
          onPress={handleSendMessage}
        >
          <Text className="text-orange-600 text-center font-pbold">Send Message</Text>
        </TouchableOpacity>

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-pbold">Reviews</Text>
          <TouchableOpacity onPress={handleAddReview}>
            <Text className="text-orange-600 font-pbold">Add Review</Text>
          </TouchableOpacity>
        </View>
       
        {reviewsData.map((review, index) => (
          <View key={index} className="bg-white rounded-lg p-4 mb-4">
            <Text className="font-pbold mb-2">{review.name}</Text>
            <View className="flex-row mb-2">
              {renderStars(review.rating)}
            </View>
            <Text className="font-pregular">{review.message}</Text>
          </View>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View className="flex-1 justify-center items-center bg-[#80808080] bg-opacity-50">
          <View className="bg-white rounded-lg p-6 w-11/12">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-pbold">Book Session</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close-circle-outline" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <Text className="font-semibold mb-2">Course Name:</Text>
            <TextInput
              className="bg-gray-200 rounded-xl py-2 px-4 mb-4 font-pregular"
              placeholder="Enter course name"
              value={courseName}
              onChangeText={setCourseName}
            />
            <Text className="font-semibold mb-2">Time:</Text>
            <TextInput
              className="bg-gray-200 rounded-xl py-2 px-4 mb-4 font-pregular"
              placeholder="Enter time"
              value={time}
              onChangeText={setTime}
            />

            <TouchableOpacity
              className="bg-orange-500 rounded-xl py-4 mb-4"
            >
              <Text className="text-white text-center font-pbold">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      <Modal
        animationType="slide"
        transparent={true}
        visible={reviewModalVisible}
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-[#80808080] bg-opacity-50">
          <View className="bg-white rounded-lg p-6 w-11/12">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-pbold">Add Review</Text>
              <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
                <Ionicons name="close-circle-outline" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <Text className="font-semibold mb-2">Your Review:</Text>
            <TextInput
              className="bg-gray-200 rounded-xl py-2 px-4 mb-4 font-pregular"
              placeholder="Enter your review"
              value={newReview}
              onChangeText={setNewReview}
              multiline
            />
            <Text className="font-semibold mb-2">Rating:</Text>
            <View className="flex-row mb-4">
              {Array(5).fill(0).map((_, index) => (
                <TouchableOpacity key={index} onPress={() => setNewRating(index + 1)}>
                  <Ionicons
                    name={index < newRating ? 'star' : 'star-outline'}
                    size={24}
                    color="#FFD700"
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              className="bg-orange-500 rounded-xl py-4 mb-4"
              onPress={handleSubmitReview}
            >
              <Text className="text-white text-center font-pbold">Submit Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TutorDetails;