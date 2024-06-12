import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 px-5 bg-white">
      <View className="items-center justify-center flex-1">
        {/* Top-left arrow button */}
        <TouchableOpacity className="absolute top-5 left-5 mt-14">
          <Text className="text-gray-600 text-xl">&#8592;</Text>
        </TouchableOpacity>

        <Image source={require('../../assets/images/logo.png')} className="w-32 h-32 mb-0" />
        <Text className="text-3xl font-pbold text-gray-800 text-left mb-2">Student Login</Text>
        <Text className="text-gray-600 text-center font-pbold text-md mb-8">Fill in your credentials to continue</Text>

        <View className="w-full mb-4">
          <Text className="text-gray-600 font-pbold mb-2">Email</Text>
          <TextInput
            className="px-4 py-4 bg-white border-gray-200 border rounded-xl"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
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

        <TouchableOpacity onPress={() => router.push("/(tabs)/home")} className="w-full py-5 bg-orange-500 rounded-xl mb-4">
          <Text className="text-white text-center font-bold">Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity  onPress={() => router.push("/student-register")}>
          <Text className="text-gray-600">Create an account instead</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default StudentLogin;