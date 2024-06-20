import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { server } from '@/server';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const TutorDetails = () => {
  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [time, setTime] = useState('');
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false); // New state for message modal
  const [message, setMessage] = useState(''); // New state for message content
  const { id } = useLocalSearchParams<{ id: string }>();
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    fetchTutorData();
  }, [id]);

  const fetchTutorData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${server}/tutors/get/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTutor(response.data);
    } catch (err) {
      setError('Failed to fetch tutor data');
      console.error('Error fetching tutor data:', err);
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event:any, selectedDate:any) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const onTimeChange = (event:any, selectedTime:any) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setSelectedTime(selectedTime);
    }
  };


  const handleSubmitBooking = async () => {
    if (!selectedCourse) {
      Alert.alert('Error', 'Please select a course.');
      return;
    }

    const formattedDate = selectedDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const formattedTime = selectedTime.toTimeString().split(' ')[0]; // Format: HH:MM:SS

    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(`${server}/sessions/book`, {
        tutorId: id,
        courseName: selectedCourse,
        date: formattedDate,
        time: formattedTime,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert('Success', 'Your session has been booked successfully.');
      handleCloseModal();
      router.push('/sessions');
    } catch (error) {
      console.error('Error booking session:', error);
      Alert.alert('Error', 'Failed to book session. Please try again.');
    }
  };

  const handleBookSession = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setCourseName('');
    setTime('');
  };

  const handleSendMessage = () => {
    setMessageModalVisible(true);
  };

  const handleCloseMessageModal = () => {
    setMessageModalVisible(false);
    setMessage('');
  };

  const handleSubmitMessage = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(`${server}/messages/send`, {
        recipientId: id,
        content: message,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert('Success', 'Your message has been sent successfully.');
      handleCloseMessageModal();
      router.push('/notifications');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const handleAddReview = () => {
    setReviewModalVisible(true);
  };

  const handleSubmitReview = async () => {
    if (newRating === 0 || newReview.trim() === '') {
      Alert.alert('Error', 'Please provide both a rating and a review comment.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(`${server}/students/add-review`, {
        tutorId: id,
        rating: newRating,
        comment: newReview,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert('Success', 'Your review has been submitted successfully.');
      setReviewModalVisible(false);
      setNewReview('');
      setNewRating(0);
      fetchTutorData(); // Refetch tutor data to update reviews
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    }
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

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-orange-50">
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-orange-50">
        <Text className="text-red-500 font-pbold">{error}</Text>
        <TouchableOpacity className="mt-4 bg-orange-500 rounded-xl py-2 px-4" onPress={fetchTutorData}>
          <Text className="text-white font-pbold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-orange-50 pt-12">
      <ScrollView className="px-4 py-6">
        <TouchableOpacity
          className="absolute top-4 left-1 bg-gray-200 rounded-full p-3 mb-3 z-10"
          onPress={() => router.push("/home")}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <Text className="text-4xl font-pbold mb-4 pt-20">{tutor?.firstName} {tutor?.lastName}</Text>

        <Text className="text-lg font-pbold mb-2">Qualifications:</Text>
        <Text className="font-pregular mb-8">{tutor.qualifications}</Text>

        <Text className="text-lg font-pbold mb-2">Teaching Methods</Text>
        <View className="flex-row flex-wrap mb-6">
          {tutor.teachingMethods.map((method:any, index:any) => (
            <Text key={index} className="bg-gray-200 text-gray-700 font-semibold py-1 px-3 rounded-full mr-2 mb-2">
              {method}
            </Text>
          ))}
        </View>

        <Text className="text-lg font-pbold mb-2">Courses</Text>
        <View className="flex-row flex-wrap mb-6">
          {tutor.courses.map((course:any, index:any) => (
            <Text key={index} className="bg-gray-200 text-gray-700 font-semibold py-1 px-3 rounded-full mr-2 mb-2">
              {course}
            </Text>
          ))}
        </View>

        <Text className="text-lg font-pregular mb-2">Available Times:</Text>
        <Text className="font-semibold mb-6">{tutor.availableTime}</Text>

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

        {tutor?.reviews.length === 0 ? (
          <View className='my-10'>
            <Text className='text-center font-pbold text-gray-500'>No Reviews for this tutor Yet</Text>
          </View>
        ) : (
          tutor.reviews.map((review:any, index:any) => (
            <View key={index} className="bg-white rounded-lg p-4 mb-4">
              <Text className="font-pbold mb-2">{review.studentFirstName} {review.studentLastName}</Text>
              <View className="flex-row mb-2">
                {renderStars(review.rating)}
              </View>
              <Text className="font-pregular">{review.comment}</Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Booking Modal */}
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

            <Text className="font-semibold mb-2">Course:</Text>
            <Picker
              selectedValue={selectedCourse}
              onValueChange={(itemValue) => setSelectedCourse(itemValue)}
              className="bg-gray-200 rounded-xl mb-4"
            >
              {tutor?.courses.map((course:any, index:any) => (
                <Picker.Item key={index} label={course} value={course} />
              ))}
            </Picker>

            <Text className="font-semibold mb-2">Date:</Text>
          <TouchableOpacity 
            onPress={() => setShowDatePicker(true)}
            className="bg-gray-200 rounded-xl py-2 px-4 mb-4"
          >
            <Text>{selectedDate?.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          <Text className="font-semibold mb-2">Time:</Text>
          <TouchableOpacity 
            onPress={() => setShowTimePicker(true)}
            className="bg-gray-200 rounded-xl py-2 px-4 mb-4"
          >
            <Text>{selectedTime?.toLocaleTimeString()}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onTimeChange}
            />
          )}
            <TouchableOpacity
              className="bg-orange-500 rounded-xl py-4 mt-6"
              onPress={handleSubmitBooking}
            >
              <Text className="text-white text-center font-pbold">Book Session</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Review Modal */}
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

      {/* Message Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={messageModalVisible}
        onRequestClose={handleCloseMessageModal}
      >
        <View className="flex-1 justify-center items-center bg-[#80808080] bg-opacity-50">
          <View className="bg-white rounded-lg p-6 w-11/12">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-pbold">Send Message</Text>
              <TouchableOpacity onPress={handleCloseMessageModal}>
                <Ionicons name="close-circle-outline" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <Text className="font-semibold mb-2">Your Message:</Text>
            <TextInput
              className="bg-gray-200 rounded-xl py-2 px-4 mb-4 font-pregular"
              placeholder="Enter your message"
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity
              className="bg-orange-500 rounded-xl py-4 mb-4"
              onPress={handleSubmitMessage}
            >
              <Text className="text-white text-center font-pbold">Send Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TutorDetails;
