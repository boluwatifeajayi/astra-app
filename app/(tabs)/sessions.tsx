import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Pressable } from 'react-native';
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
    <View className="flex-1 bg-orange-50 pt-20 px-4">
      <Text className="text-3xl font-pbold mb-4">Available Sessions</Text>
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
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

export default SessionsScreen;