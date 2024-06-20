import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { server } from '@/server';

const Register = () => {
  const [step, setStep] = useState<any>(1);
  const [firstName, setFirstName] = useState<any>('');
  const [lastName, setLastName] = useState<any>('');
  const [email, setEmail] = useState<any>('');
  const [password, setPassword] = useState<any>('');
  const [confirmPassword, setConfirmPassword] = useState<any>('');
  const [discipline, setDiscipline] = useState<any>('');
  const [learningStyles, setLearningStyles] = useState<any>([]);
  const [selectedLearningStyles, setSelectedLearningStyles] = useState<any>([]);
  const [courses, setCourses] = useState<any>([]);
  const [selectedCourses, setSelectedCourses] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const [error, setError] = useState<any>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [learningStylesResponse, skillsResponse] = await Promise.all([
          axios.get(`${server}/learning-styles`),
          axios.get(`${server}/skills`),
        ]);
        setLearningStyles(learningStylesResponse.data);
        setCourses(skillsResponse.data);
      } catch (err) {
        setError('Error fetching data');
      }
    };
    fetchData();
  }, []);

  const toggleLearningStyle = (style:any) => {
    if (selectedLearningStyles.includes(style)) {
      setSelectedLearningStyles(selectedLearningStyles.filter((s:any) => s !== style));
    } else {
      setSelectedLearningStyles([...selectedLearningStyles, style]);
    }
  };

  const toggleCourse = (course:any) => {
    if (selectedCourses.includes(course)) {
      setSelectedCourses(selectedCourses.filter((c:any) => c !== course));
    } else {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      const response = await axios.post(`${server}/students/register`, {
        firstName,
        lastName,
        email,
        password,
        discipline,
        learningStyle: selectedLearningStyles,
        courses: selectedCourses,
      });
  
      await AsyncStorage.setItem('userToken', response.data.token);
      Alert.alert(
        'Registration Successful',
        'Your account has been created successfully. Please log in to continue.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/student-login'),
          },
        ]
      );
    } catch (err) {
      setError('Registration failed, account already exists');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text className="text-gray-600 text-left font-psemibold text-md mb-8">
              Fill Your Personal Information
            </Text>
            <View className="flex-row mb-4 w-full">
              <View className="w-[50%]">
                <Text className="text-gray-600 font-pbold mb-2">Firstname</Text>
                <TextInput
                  className="flex-1 px-4 py-4 bg-white border border-gray-300 rounded-xl mr-1"
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View className="w-[50%]">
                <Text className="text-gray-600 font-pbold mb-2 ml-2">Lastname</Text>
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
            <TouchableOpacity
              className="bg-orange-600 py-5 rounded-xl mb-4"
              onPress={handleNextStep}
            >
              <Text className="text-white text-center font-pbold">Proceed</Text>
            </TouchableOpacity>
          </View>
        );
      case 2:
        return (
          <View>
            <Text className="text-gray-600 text-left font-psemibold text-md mb-8">
              Learning Information
            </Text>
            <View className="w-full">
              <Text className="text-gray-600 font-pbold mb-2">Program</Text>
              <TextInput
                className="px-4 py-4 bg-white border border-gray-300 rounded-xl mb-4"
                placeholder="Discipline"
                value={discipline}
                onChangeText={setDiscipline}
              />
            </View>
            <View className="w-full">
              <Text className="text-gray-600 font-pbold mb-2">Select Learning Styles</Text>
              <View className="flex-row flex-wrap mb-4">
                {learningStyles.map((style:any) => (
                  <TouchableOpacity
                    key={style}
                    className={`px-4 py-2 rounded-lg mr-2 mb-2 ${
                      selectedLearningStyles.includes(style) ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                    onPress={() => toggleLearningStyle(style)}
                  >
                    <Text
                      className={`text-white ${
                        selectedLearningStyles.includes(style) ? 'font-bold' : 'text-gray-600'
                      }`}
                    >
                      {style}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View className="w-full">
              <Text className="text-gray-600 font-pbold mb-2">Choose Courses</Text>
              <View className="flex-row flex-wrap mb-4">
                {courses.map((course:any) => (
                  <TouchableOpacity
                    key={course}
                    className={`px-4 py-2 rounded-lg mr-2 mb-2 ${
                      selectedCourses.includes(course) ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                    onPress={() => toggleCourse(course)}
                  >
                    <Text
                      className={`text-white ${
                        selectedCourses.includes(course) ? 'font-bold' : 'text-gray-600'
                      }`}
                    >
                      {course}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-gray-500 py-4 w-[35%] rounded-xl mb-4 px-4"
                onPress={handlePreviousStep}
              >
                <Text className="text-white text-center font-bold">Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-orange-600 ml-2 py-4 w-[60%] rounded-xl mb-4 px-4"
                onPress={handleRegister}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-center font-bold">Complete Creation</Text>
                )}
              </TouchableOpacity>
            </View>
            {error ? <Text className="text-red-500 text-center">{error}</Text> : null}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 p-5 bg-white">
      <View className="flex-1 justify-center">
        <Image source={require('../../assets/images/logo.png')} className="w-32 h-32 mb-0" />
        <Text className="text-3xl font-pbold text-gray-800 text-left mb-2">Student Register</Text>
        {renderStep()}
      </View>
      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text className="text-orange-600 font-pbold text-center mb-4">Login instead</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Register;
