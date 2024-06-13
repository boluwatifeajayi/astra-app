import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface LearningStyleOption {
  label: string;
  bgColor: string;
}

const Register = () => {
  const [step, setStep] = useState<number>(1);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [qualification, setqualification] = useState<string>('');
  const [learningStyles, setLearningStyles] = useState<string[]>([]);
  const [courses, setCourses] = useState<string>('');
  const [availableTime, setAvailableTime] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showStartTimePicker, setShowStartTimePicker] = useState<boolean>(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState<boolean>(false);


  const learningStyleOptions: LearningStyleOption[] = [
    { label: 'Visual', bgColor: 'bg-blue-500' },
    { label: 'Auditory', bgColor: 'bg-green-500' },
    { label: 'Kinesthetic', bgColor: 'bg-yellow-500' },
    { label: 'Reading/Writing', bgColor: 'bg-purple-500' },
  ];

  const toggleLearningStyle = (style: string) => {
    if (learningStyles.includes(style)) {
      setLearningStyles(learningStyles.filter((s) => s !== style));
    } else {
      setLearningStyles([...learningStyles, style]);
    }
  };

  const onTimeChange = (event: any, selectedTime: Date | undefined) => {
    const currentTime = selectedTime || availableTime;
    setShowTimePicker(Platform.OS === 'ios');
    setAvailableTime(currentTime);
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const onStartTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowStartTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setStartTime(selectedTime);
    }
  };

  const onEndTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowEndTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setEndTime(selectedTime);
    }
  };

  const formatTime = (time: Date | null) => {
    if (!time) return 'Select time';
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            
        <Text className="text-gray-600  text-left font-psemibold text-md mb-8">Fill Your Personal Information</Text>

           
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

            <View className=" w-full">
            <Text className="text-gray-600 font-pbold mb-2">Password</Text>
            <TextInput
              className="px-4 py-4 bg-white border border-gray-300 rounded-xl mb-4"
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            </View>

            <View className=" w-full">
            <Text className="text-gray-600 font-pbold mb-2">Password Confirm</Text>
            <TextInput
              className="px-4 py-4 bg-white border border-gray-300 rounded-xl mb-4"
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            </View>
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
             <Text className="text-gray-600  text-left font-psemibold text-md mb-8">Teaching Information</Text>

             <View className="w-full">
            <Text className="text-gray-600 font-pbold mb-2">Qualification</Text>
            <TextInput
              className="px-4 py-4 bg-white border border-gray-300 rounded-xl mb-4"
              placeholder="qualification"
              value={qualification}
              onChangeText={setqualification}
            />
            </View>

            <View className="w-full">
            <Text className="text-gray-600 font-pbold mb-2">Select Teaching Styles</Text>
            <View className="flex-row flex-wrap mb-4">
              {learningStyleOptions.map((option) => (
                <TouchableOpacity
                  key={option.label}
                  className={`px-4 py-2 rounded-lg mr-2 mb-2 ${
                    learningStyles.includes(option.label) ? option.bgColor : 'bg-gray-200'
                  }`}
                  onPress={() => toggleLearningStyle(option.label)}
                >
                  <Text
                    className={`text-white ${
                      learningStyles.includes(option.label) ? 'font-bold' : 'text-gray-600'
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            </View>


            <View className="w-full">
            <Text className="text-gray-600 font-pbold mb-2">Choose Courses Offered</Text>
            <TextInput
              className="px-4 py-4 bg-white border border-gray-300 rounded-xl mb-4"
              placeholder="Courses"
              value={courses}
              onChangeText={setCourses}
            />
            </View>

            <View className="w-full mb-4">
              <Text className="text-gray-600 font-pbold mb-2">Available Time</Text>
              <View className="flex-row justify-between">
                <TouchableOpacity
                  className="px-4 py-4 bg-white border border-gray-300 rounded-xl flex-1 mr-2"
                  onPress={() => setShowStartTimePicker(true)}
                >
                  <Text>{formatTime(startTime)}</Text>
                </TouchableOpacity>
                <Text className="self-center">-</Text>
                <TouchableOpacity
                  className="px-4 py-4 bg-white border border-gray-300 rounded-xl flex-1 ml-2"
                  onPress={() => setShowEndTimePicker(true)}
                >
                  <Text>{formatTime(endTime)}</Text>
                </TouchableOpacity>
              </View>
              {showStartTimePicker && (
                <DateTimePicker
                  testID="startTimePicker"
                  value={startTime || new Date()}
                  mode="time"
                  is24Hour={false}
                  display="default"
                  onChange={onStartTimeChange}
                />
              )}
              {showEndTimePicker && (
                <DateTimePicker
                  testID="endTimePicker"
                  value={endTime || new Date()}
                  mode="time"
                  is24Hour={false}
                  display="default"
                  onChange={onEndTimeChange}
                />
              )}
            </View>
            
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-gray-500 py-4 w-[35%] rounded-xl mb-4 px-4"
                onPress={handlePreviousStep}
              >
                <Text className="text-white text-center font-bold">Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-600 ml-2 py-4 w-[60%] rounded-xl mb-4 px-4"
                onPress={() => console.log('Account created')}
              >
                <Text className="text-white text-center font-bold">Complete Creation</Text>
              </TouchableOpacity>
            </View>
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
      <TouchableOpacity>
        <Text className="text-blue-600 font-pbold text-center mb-4">Login instead</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Register;