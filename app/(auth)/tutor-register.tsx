import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Platform, ActivityIndicator, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { server } from '@/server'; // Assuming you have a server file for the server URL

const Register = () => {
  const [step, setStep] = useState<number>(1);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [qualification, setQualification] = useState<string>('');
  const [learningStyles, setLearningStyles] = useState<string[]>([]);
  const [availableLearningStyles, setAvailableLearningStyles] = useState<string[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [availableCourses, setAvailableCourses] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showStartTimePicker, setShowStartTimePicker] = useState<boolean>(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [dailyStartTime, setDailyStartTime] = useState<Date | null>(null);
  const [dailyEndTime, setDailyEndTime] = useState<Date | null>(null);
  const [showDailyStartTimePicker, setShowDailyStartTimePicker] = useState<boolean>(false);
  const [showDailyEndTimePicker, setShowDailyEndTimePicker] = useState<boolean>(false);

  useEffect(() => {
    fetchLearningStyles();
    fetchCourses();
  }, []);

  const fetchLearningStyles = async () => {
    try {
      const response = await axios.get(`${server}/learning-styles`);
      setAvailableLearningStyles(response.data);
    } catch (error) {
      setError('Failed to load learning styles.');
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${server}/skills`);
      setAvailableCourses(response.data);
    } catch (error) {
      setError('Failed to load courses.');
    }
  };

  const toggleLearningStyle = (style: string) => {
    if (learningStyles.includes(style)) {
      setLearningStyles(learningStyles.filter((s) => s !== style));
    } else {
      setLearningStyles([...learningStyles, style]);
    }
  };

  const toggleCourse = (course: string) => {
    if (courses.includes(course)) {
      setCourses(courses.filter((c) => c !== course));
    } else {
      setCourses([...courses, course]);
    }
  };

 


  const toggleDay = (day: string) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter((d) => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const onDailyStartTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowDailyStartTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setDailyStartTime(selectedTime);
    }
  };

  const onDailyEndTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowDailyEndTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setDailyEndTime(selectedTime);
    }
  };



  const formatTime = (time: Date | null) => {
    if (!time) return 'Select time';
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatAvailability = () => {
    if (availableDays.length === 0 || !dailyStartTime || !dailyEndTime) return '';
    const days = availableDays.join(',');
    const startTime = dailyStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = dailyEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${days} ${startTime}-${endTime}`;
  };

  const handleNextStep = () => {
    if (step === 1 && (!firstName || !lastName || !email || !password || !confirmPassword)) {
      setError('Please fill all fields.');
      return;
    }
    if (step === 1 && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleRegister = async () => {
    if (!qualification || !learningStyles.length || !courses.length || availableDays.length === 0 || !dailyStartTime || !dailyEndTime) {
      setError('Please fill all fields.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const availableTime = formatAvailability();
      const response = await axios.post(`${server}/tutors/register`, {
        firstName,
        lastName,
        email,
        password,
        availableTime,
        courses,
        qualifications: qualification,
        teachingMethods: learningStyles,
      });
      const { token } = response.data;
      await AsyncStorage.setItem('tutorToken', token);
      router.push('/dashboard');
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text className="text-gray-600 text-left font-psemibold text-md mb-8">Fill Your Personal Information</Text>
            <View className="flex-row mb-4 w-full">
              <View className="w-[50%]">
                <Text className="text-gray-600 font-pbold mb-2">First Name</Text>
                <TextInput
                  className="flex-1 px-4 py-4 bg-white border border-gray-300 rounded-xl mr-1"
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View className="w-[50%]">
                <Text className="text-gray-600 font-pbold mb-2 ml-2">Last Name</Text>
                <TextInput
                  className="flex-1 px-4 py-4 bg-white border border-gray-300 rounded-xl ml-2"
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>
            <View className="w-full">
              <Text className="text-gray-600 font-pbold mb-2">Email Address</Text>
              <TextInput
                className="px-4 py-4 bg-white border border-gray-300 rounded-xl mb-4"
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View className="w-full">
              <Text className="text-gray-600 font-pbold mb-2">Password</Text>
              <TextInput
                className="px-4 py-4 bg-white border border-gray-300 rounded-xl mb-4"
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <View className="w-full">
              <Text className="text-gray-600 font-pbold mb-2">Confirm Password</Text>
              <TextInput
                className="px-4 py-4 bg-white border border-gray-300 rounded-xl mb-4"
                placeholder="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
            {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}
            <TouchableOpacity
              className="bg-blue-600 py-5 rounded-xl mb-4"
              onPress={handleNextStep}
            >
              <Text className="text-white text-center font-pbold">Proceed</Text>
            </TouchableOpacity>
          </View>
        );
      case 2:
        return (
          <View>
            <Text className="text-gray-600 text-left font-psemibold text-md mb-8">Teaching Information</Text>
            <View className="w-full">
              <Text className="text-gray-600 font-pbold mb-2">Qualification</Text>
              <TextInput
                className="px-4 py-4 bg-white border border-gray-300 rounded-xl mb-4"
                placeholder="Qualification"
                value={qualification}
                onChangeText={setQualification}
              />
            </View>
            <View className="w-full">
              <Text className="text-gray-600 font-pbold mb-2">Select Teaching Styles</Text>
              <View className="flex-row flex-wrap mb-4">
                {availableLearningStyles.map((style) => (
                  <TouchableOpacity
                    key={style}
                    className={`px-4 py-2 rounded-lg mr-2 mb-2 ${learningStyles.includes(style) ? 'bg-blue-500' : 'bg-gray-200'}`}
                    onPress={() => toggleLearningStyle(style)}
                  >
                    <Text className={`text-white ${learningStyles.includes(style) ? 'font-bold' : 'text-gray-600'}`}>
                      {style}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View className="w-full">
              <Text className="text-gray-600 font-pbold mb-2">Select Courses</Text>
              <View className="flex-row flex-wrap mb-4">
                {availableCourses.map((course) => (
                  <TouchableOpacity
                    key={course}
                    className={`px-4 py-2 rounded-lg mr-2 mb-2 ${courses.includes(course) ? 'bg-blue-500' : 'bg-gray-200'}`}
                    onPress={() => toggleCourse(course)}
                  >
                    <Text className={`${courses.includes(course) ? 'text-white font-bold' : 'text-gray-600'}`}>
                      {course}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View className="w-full mb-4">
    <Text className="text-gray-600 font-pbold mb-2">Available Days</Text>
    <View className="flex-row flex-wrap mb-4">
      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
        <TouchableOpacity
          key={day}
          className={`px-4 py-2 rounded-lg mr-2 mb-2 ${availableDays.includes(day) ? 'bg-blue-500' : 'bg-gray-200'}`}
          onPress={() => toggleDay(day)}
        >
          <Text className={`${availableDays.includes(day) ? 'text-white font-bold' : 'text-gray-600'}`}>
            {day}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    <Text className="text-gray-600 font-pbold mb-2">Daily Available Time</Text>
    <View className="flex-row justify-between">
      <TouchableOpacity
        className="flex-1 px-4 py-4 bg-white border border-gray-300 rounded-xl mr-2"
        onPress={() => setShowDailyStartTimePicker(true)}
      >
        <Text>{formatTime(dailyStartTime)}</Text>
        {showDailyStartTimePicker && (
      <DateTimePicker
        value={dailyStartTime || new Date()}
        mode="time"
        is24Hour={true}
        display="default"
        onChange={onDailyStartTimeChange}
      />
    )}
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-1 px-4 py-4 bg-white border border-gray-300 rounded-xl ml-2"
        onPress={() => setShowDailyEndTimePicker(true)}
      >
        <Text>{formatTime(dailyEndTime)}</Text>
        {showDailyEndTimePicker && (
      <DateTimePicker
        value={dailyEndTime || new Date()}
        mode="time"
        is24Hour={true}
        display="default"
        onChange={onDailyEndTimeChange}
      />
    )}
      </TouchableOpacity>
    </View>
   
   
  </View>
            {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}
            <View className="flex-row justify-between mb-24">
              <TouchableOpacity
                className="bg-gray-300 py-5 rounded-xl mb-4 w-[48%]"
                onPress={handlePreviousStep}
              >
                <Text className="text-gray-700 text-center font-pbold">Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-600 py-5 rounded-xl mb-4 w-[48%]"
                onPress={handleRegister}
              >
                 {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-center font-bold">Complete Creation</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 py-8">
      <View className="items-center mb-8">
        <Image
          source={require('@/assets/images/logo.png')}
          style={{ width: 100, height: 100 }}
          resizeMode="contain"
        />
        <Text className="text-2xl font-pbold mt-4">Register as a Tutor</Text>
      </View>
      {renderStep()}
      {loading && (
        <View className="absolute inset-0 bg-black bg-opacity-50 items-center justify-center">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </ScrollView>
  );
};

export default Register;
