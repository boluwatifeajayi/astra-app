import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

const StudentLogin = () => {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [showPassword, setShowPassword] = useState(false);

 const togglePasswordVisibility = () => {
   setShowPassword(!showPassword);
 };

 return (
   <View className="flex-1 px-5 items-center justify-center bg-white">
     <Image source={require('../../assets/images/logo.png')} className="w-32 h-32 mb-0" />
     <Text className="text-3xl font-pbold text-left mb-2 text-blue-700">Tutor Login</Text>
     <Text className="text-gray-600 text-center font-psemibold text-md mb-8">Fill in your credentials to continue</Text>

     <View className="w-full mb-4">
       <Text className="text-gray-600 font-psemibold mb-2">Email</Text>
       <TextInput
         className="px-4 py-4 bg-white border-gray-200  border rounded-xl"
         placeholder="Enter your email"
         value={email}
         onChangeText={setEmail}
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
       />
       <TouchableOpacity
         className="absolute right-4 top-9"
         onPress={togglePasswordVisibility}
       >
         <Text>{showPassword ? '🙈' : '🙉'}</Text>
       </TouchableOpacity>
     </View>

     <TouchableOpacity className="mb-4">
       <Text className="text-blue-700 font-psemibold">Forgot Password?</Text>
     </TouchableOpacity>

     <TouchableOpacity className="w-full py-5 bg-blue-700 rounded-xl mb-4">
       <Text className="text-white text-center font-pbold">Continue</Text>
     </TouchableOpacity>

     <TouchableOpacity>
       <Text className="text-gray-600">Create an account instead</Text>
     </TouchableOpacity>
   </View>
 );
};

export default StudentLogin;