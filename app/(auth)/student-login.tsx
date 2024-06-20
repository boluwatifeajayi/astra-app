import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkUserToken();
  }, []);

  const checkUserToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        router.push('/home');
      }
    } catch (err) {
      console.log('Error checking user token:', err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://astra-server-sp74.onrender.com/api/students/login', {
        email,
        password,
      });

      const { token } = response.data;

      await AsyncStorage.setItem('userToken', token);

      router.push('/home');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 px-5 bg-white">
      <View className="items-center justify-center flex-1">
        {/* Top-left arrow button */}
        <TouchableOpacity
          className="absolute top-4 left-1 bg-gray-200 rounded-full p-3 mt-16 mb-3 z-10"
          onPress={() => router.push("/")}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <Image source={require('../../assets/images/logo.png')} className="w-32 h-32 mb-0" />
        <Text className="text-3xl font-pbold text-gray-800 text-left mb-2">Student Login</Text>
        <Text className="text-gray-600 text-center font-pbold text-md mb-8">Fill in your credentials to continue</Text>

        {error ? (
          <Text className="text-red-600 mb-4">{error}</Text>
        ) : null}

        <View className="w-full mb-4">
          <Text className="text-gray-600 font-pbold mb-2">Email</Text>
          <TextInput
            className="px-4 py-4 bg-white border-gray-200 border rounded-xl"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#999"
          />
        </View>

        <View className="w-full mb-6 relative">
          <Text className="text-gray-600 font-pbold mb-2">Password</Text>
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

        <TouchableOpacity className="mb-4">
          <Text className="text-orange-600 font-pbold">Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogin} className="w-full py-5 bg-orange-500 rounded-xl mb-4">
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center font-bold">Continue</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/student-register")}>
          <Text className="text-gray-600">Create an account instead</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default StudentLogin;
