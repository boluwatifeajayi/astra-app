import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { server } from '@/server';

const SessionsScreen = () => {
  const [sessions, setSessions] = useState([]);
  const [modalVisible, setModalVisible] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${server}/sessions/student-sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(response.data);
    } catch (err) {
      setError('Failed to fetch sessions');
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderSessionItem = (session:any) => (
    <TouchableOpacity
      key={session._id}
      className="bg-white rounded-lg p-4 mb-4 flex-row items-center justify-between"
      onPress={() => setModalVisible(session)}
    >
      <View>
        <Text className="text-md font-pbold">{session.courseName}</Text>
        <Text className="text-gray-500 font-semibold">{`${session.tutor.firstName} ${session.tutor.lastName}`}</Text>
        <Text className="mr-4">{new Date(session.date).toLocaleDateString()}</Text>
      </View>
      <View className="flex-row items-center">
        <Text
          className={`px-2 py-1 mr-4 rounded-md font-pbold ${
            session.sessionStatus === 'pending'
              ? 'bg-yellow-200 text-yellow-800'
              : session.sessionStatus === 'scheduled'
              ? 'bg-green-200 text-green-800'
              : 'bg-red-200 text-red-800'
          }`}
        >
          {session.sessionStatus}
        </Text>
        <Ionicons name="eye-outline" size={18} color="#333" className="ml-4" />
      </View>
    </TouchableOpacity>
  );

  const renderModalContent = (session:any) => (
    <View className="bg-white rounded-lg border-2 border-gray-400 p-6 w-11/12">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-pbold">Session Details</Text>
        <Pressable onPress={() => setModalVisible(null)}>
          <Ionicons name="close-circle-outline" size={24} color="#333" />
        </Pressable>
      </View>
      <Text className="text-gray-500 font-semibold mb-2">Course Name:</Text>
      <Text className="mb-4 text-xl font-psemibold">{session.courseName}</Text>
      <Text className="text-gray-500 font-semibold mb-2">Meeting Type:</Text>
      <Text className="mb-4">{session.meetingType || <Text className="text-red-500">Awaiting tutor's approval</Text>}</Text>
      <Text className="text-gray-500 font-semibold mb-2">Location:</Text>
      <Text className="mb-4">{session.location || <Text className="text-red-500">Awaiting tutor's approval</Text>}</Text>
      <Text className="text-gray-500 font-semibold mb-2">Tutor Name:</Text>
      <Text className="mb-4">{`${session.tutor.firstName} ${session.tutor.lastName}`}</Text>
      <Text className="text-gray-500 font-semibold mb-2">Time:</Text>
      <Text className="mb-4">{session.time}</Text>
      <Text className="text-gray-500 font-semibold mb-2">Date:</Text>
      <Text className="mb-4">{new Date(session.date).toLocaleDateString()}</Text>
      <Text className="text-gray-500 font-semibold mb-2">Duration:</Text>
      <Text className="mb-4">{session.duration ? `${session.duration} minutes` : <Text className="text-red-500">Awaiting tutor's approval</Text>}</Text>
      <Text className="text-gray-500 font-semibold mb-2">Status:</Text>
      <Text className={`mb-4 ${
        session.sessionStatus === 'pending'
          ? 'text-yellow-600'
          : session.sessionStatus === 'scheduled'
          ? 'text-green-600'
          : 'text-red-600'
      }`}>{session.sessionStatus}</Text>
    </View>
  );

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
        <TouchableOpacity className="mt-4 bg-orange-500 rounded-xl py-2 px-4" onPress={fetchSessions}>
          <Text className="text-white font-pbold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-orange-50 pt-20 px-4">
      <Text className="text-3xl font-pbold mb-4">Your Sessions</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
      {sessions.length === 0 ? (
  <View className='my-10'>
    <Text className='text-center font-pbold text-gray-600'>No sessions yet</Text>
  </View>
) : (
  sessions.map(renderSessionItem)
)}

      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible !== null}
        onRequestClose={() => setModalVisible(null)}
      >
        {modalVisible && (
          <View className="flex-1 justify-center items-center bg-[#80808080] bg-opacity-50">
            {renderModalContent(modalVisible)}
          </View>
        )}
      </Modal>
    </View>
  );
};

export default SessionsScreen;