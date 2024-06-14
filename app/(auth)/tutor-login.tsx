import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { server } from '@/server';

const TutorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${server}/tutors/login`, { email, password });
      const { token } = response.data;
      await AsyncStorage.setItem('tutorToken', token);
      router.push('/dashboard');
    } catch (error) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 px-5 items-center justify-center bg-white">
      <TouchableOpacity
        className="absolute top-4 left-3 bg-gray-200 rounded-full p-3 mt-16 mb-3 z-10"
        onPress={() => router.push("/")}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <Image source={require('../../assets/images/logo.png')} className="w-32 h-32 mb-0" />
      <Text className="text-3xl font-pbold text-left mb-2 text-blue-700">Tutor Login</Text>
      <Text className="text-gray-600 text-center font-psemibold text-md mb-8">Fill in your credentials to continue</Text>

      <View className="w-full mb-4">
        <Text className="text-gray-600 font-psemibold mb-2">Email</Text>
        <TextInput
          className="px-4 py-4 bg-white border-gray-200 border rounded-xl"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#999"
        />
      </View>

      <View className="w-full mb-6 relative">
        <Text className="text-gray-600 font-psemibold mb-2">Password</Text>
        <TextInput
          className="px-4 py-4 bg-white border border-gray-200 rounded-xl"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          className="absolute right-4 top-9"
          onPress={togglePasswordVisibility}
        >
          <Text>{showPassword ? '🙈' : '🙉'}</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}

      <TouchableOpacity className="mb-4">
        <Text className="text-blue-700 font-psemibold">Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogin} className="w-full py-5 bg-blue-700 rounded-xl mb-4" disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-pbold">Continue</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/tutor-register")}>
        <Text className="text-gray-600">Create a tutor account instead</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TutorLogin;
