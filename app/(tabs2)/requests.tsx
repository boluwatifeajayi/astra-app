import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Sample data for sessions
interface Session {
  courseName: string;
  lecturerName: string;
  date: string;
  status: 'pending' | 'approved' | 'canceled';
  meetingType: string;
  location: string;
  teacherName: string;
  time: string;
}

const sessionsData: Session[] = [
  {
    courseName: 'CSC441',
    lecturerName: 'John Doe',
    date: '06/15/2024',
    status: 'pending',
    meetingType: 'Online',
    location: 'Zoom Meeting',
    teacherName: 'Jane Smith',
    time: '10:00 AM',
  },
  {
    courseName: 'MIS211',
    lecturerName: 'Alice Johnson',
    date: '06/18/2024',
    status: 'approved',
    meetingType: 'In-person',
    location: 'Room 205, Main Building',
    teacherName: 'Bob Wilson',
    time: '2:30 PM',
  },
  {
    courseName: 'MTH302', // Added a new course
    lecturerName: 'David Lee',
    date: '06/17/2024', // Different date
    status: 'canceled', // Added a new status
    meetingType: 'Hybrid', // Added a new meeting type
    location: 'Room 101, Science Building (or Online)', // Location with option
    teacherName: 'Emily Jones',
    time: '11:00 AM',
  },
  {
    courseName: 'ENG101',
    lecturerName: 'Sarah Brown',
    date: '06/20/2024',
    status: 'pending', // Added a new status
    meetingType: 'In-person',
    location: 'Room 300, Library (Cancelled)', // Location with cancellation notice
    teacherName: 'Michael Garcia',
    time: '1:00 PM',
  },
];


const SessionsScreen = () => {
  const [modalVisible, setModalVisible] = useState<Session | null>(null);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [inputType, setInputType] = useState('');
  const [location, setLocation] = useState('');


  const handleApprove = () => {
    setApproveModalVisible(true);
    setModalVisible(null);

  };

  const handleDecline = () => {
    // Implement decline logic here
    setModalVisible(null);
  };

  const handleSubmit = () => {
    // Implement submit logic here
    setApproveModalVisible(false);
    setModalVisible(null);
    setInputType('');
    setLocation('');
  };

  const renderSessionItem = (session: Session) => (
    <TouchableOpacity
      className="bg-white rounded-lg p-4 mb-4 flex-row items-center justify-between"
      onPress={() => setModalVisible(session)}
    >
      <View>
        <Text className="text-md font-pbold">{session.courseName}</Text>
        <Text className="text-gray-500 font-semibold">{session.lecturerName}</Text>
        <Text className="mr-4">{session.date}</Text>
      </View>
      <View className="flex-row items-center">
       
        <Text
          className={`px-2 py-1 mr-4 rounded-md font-pbold ${
            session.status === 'pending'
              ? 'bg-yellow-200 text-yellow-800'
              : session.status === 'approved'
              ? 'bg-green-200 text-green-800'
              : 'bg-red-200 text-red-800'
          }`}
        >
          {session.status}
        </Text>
        <Ionicons name="eye-outline" size={18} color="#333" className="ml-4" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-blue-50 pt-20 px-4">
      <Text className="text-3xl font-pbold mb-4">Tutor Requests</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {sessionsData.map(renderSessionItem)}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible !== null}
        onRequestClose={() => setModalVisible(null)}
      >
        {modalVisible && (
          <View className="flex-1 justify-center items-center  bg-[#80808080] bg-opacity-50">
            <View className="bg-white rounded-lg border-2 border-gray-400 p-6 w-11/12">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-pbold">Session Details</Text>
                <Pressable onPress={() => setModalVisible(null)}>
                  <Ionicons name="close-circle-outline" size={24} color="#333" />
                </Pressable>
              </View>
              <Text className="text-gray-500 font-semibold mb-2">Course Name:</Text>
              <Text className="mb-4 text-xl font-psemibold">{modalVisible.courseName}</Text>
              <Text className="text-gray-500 font-semibold mb-2">Meeting Type:</Text>
              <Text className="mb-4">{modalVisible.meetingType}</Text>
              <Text className="text-gray-500 font-semibold mb-2">Location:</Text>
              <Text className="mb-4">{modalVisible.location}</Text>
              <Text className="text-gray-500 font-semibold mb-2">Teacher Name:</Text>
              <Text className="mb-4">{modalVisible.teacherName}</Text>
              <Text className="text-gray-500 font-semibold mb-2">Time:</Text>
              <Text className="mb-4">{modalVisible.time}</Text>
              <Text className="text-gray-500 font-semibold mb-2">Date:</Text>
              <Text className="mb-4">{modalVisible.date}</Text>

              <View className="flex-row justify-between mt-4">
                <TouchableOpacity
                  className="bg-green-500 py-2 px-4 rounded-lg"
                  onPress={handleApprove}
                >
                  <Text className="text-white font-pbold">Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-red-500 py-2 px-4 rounded-lg"
                  onPress={handleDecline}
                >
                  <Text className="text-white font-pbold">Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-yellow-500 py-2 px-4 rounded-lg"
                  onPress={() => setModalVisible(null)}
                >
                  <Text className="text-white font-pbold">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={approveModalVisible}
        onRequestClose={() => setApproveModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-[#80808080] bg-opacity-50">
          <View className="bg-white rounded-lg border-2 border-gray-400 p-6 w-11/12">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-pbold">Approve Session</Text>
              <Pressable onPress={() => setApproveModalVisible(false)}>
                <Ionicons name="close-circle-outline" size={24} color="#333" />
              </Pressable>
            </View>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4"
              placeholder="Enter meeting type"
              placeholderTextColor="#999"
              value={inputType}
              onChangeText={setInputType}
            />
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4"
              placeholder="Enter location"
              placeholderTextColor="#999"
              value={location}
              onChangeText={setLocation}
            />
            <TouchableOpacity
              className="bg-blue-500 py-4 px-4 rounded-lg"
              onPress={handleSubmit}
            >
              <Text className="text-white font-pbold text-center">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SessionsScreen;