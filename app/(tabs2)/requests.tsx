import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Pressable, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { server } from '@/server'; // adjust the import according to your project structure
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalDropdown from 'react-native-modal-dropdown';

interface Session {
  _id: string;
  courseName: string;
  date: string;
  time: string;
  duration?: number;
  meetingType: string;
  location?: string;
  meetingLink?: string;
  sessionStatus: 'pending' | 'scheduled' | 'completed' | 'canceled' | 'rejected';
  student: {
    firstName: string;
    lastName: string;
  };
  tutor: {
    firstName: string;
    lastName: string;
    qualifications: string;
  };
}

const SessionsScreen = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<Session | null>(null);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [meetingType, setMeetingType] = useState<'online' | 'in-person'>('online');
  const [location, setLocation] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [duration, setDuration] = useState('');
  const [approvalSession, setApprovalSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      const token = await AsyncStorage.getItem('tutorToken');

      try {
        const response = await axios.get(`${server}/sessions/requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSessions(response.data);
      } catch (error) {
        console.error('Error fetching session data:', error);
        setError('Failed to load session data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleApprove = (session: Session) => {
    setApproveModalVisible(true);
    setModalVisible(null);
    setApprovalSession(session);
  };

  const handleDecline = async (sessionId: string) => {
    const token = await AsyncStorage.getItem('tutorToken');
    try {
      await axios.put(`${server}/sessions/update-status`, {
        sessionId,
        status: 'rejected'
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSessions(sessions.map(session => session._id === sessionId ? { ...session, sessionStatus: 'rejected' } : session));
      Alert.alert('Success', 'Session declined successfully.');
    } catch (error) {
      console.error('Error declining session:', error);
      Alert.alert('Error', 'Failed to decline session.');
    }
    setModalVisible(null);
  };

  const handleCancel = async (sessionId: string) => {
    const token = await AsyncStorage.getItem('tutorToken');
    try {
      await axios.put(`${server}/sessions/update-status`, {
        sessionId,
        status: 'canceled'
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSessions(sessions.map(session => session._id === sessionId ? { ...session, sessionStatus: 'canceled' } : session));
      Alert.alert('Success', 'Session canceled successfully.');
    } catch (error) {
      console.error('Error canceling session:', error);
      Alert.alert('Error', 'Failed to cancel session.');
    }
    setModalVisible(null);
  };

  const handleSubmit = async () => {
    if (approvalSession) {
      const token = await AsyncStorage.getItem('tutorToken');
      const sessionId = approvalSession._id;
      try {
        await axios.put(`${server}/sessions/update-status`, {
          sessionId,
          duration: parseInt(duration, 10),
          meetingType,
          meetingLink: meetingType === 'online' ? meetingLink : undefined,
          location: meetingType === 'in-person' ? location : undefined,
          status: 'scheduled'
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSessions(sessions.map(session => session._id === sessionId ? { ...session, sessionStatus: 'scheduled' } : session));
        Alert.alert('Success', 'Session approved and scheduled successfully.');
      } catch (error) {
        console.error('Error approving session:', error);
        Alert.alert('Error', 'Failed to approve session.');
      }
    }
    setApproveModalVisible(false);
    setApprovalSession(null);

    setMeetingType('online');
    setLocation('');
    setMeetingLink('');
    setDuration('');
  };

  const renderSessionItem = (session: Session) => (
    <TouchableOpacity
      key={session._id}
      className="bg-white rounded-lg p-4 mb-4 flex-row items-center justify-between"
      onPress={() => setModalVisible(session)}
    >
      <View>
        <Text className="text-md font-pbold">{session.courseName}</Text>
        <Text className="text-gray-500 font-semibold">{`${session.student.firstName} ${session.student.lastName}`}</Text>
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

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-blue-50">
        <ActivityIndicator size="large" color="dodgerblue" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-blue-50">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-blue-50 pt-20 px-4">
      <Text className="text-3xl font-pbold mb-4">Tutor Sessions</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {sessions.map(renderSessionItem)}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible !== null}
        onRequestClose={() => setModalVisible(null)}
      >
        {modalVisible && (
          <View className="flex-1 justify-center items-center bg-[#80808080] bg-opacity-50">
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
              <Text className="mb-4">{modalVisible.meetingType || <Text className="text-red-500">Awaiting Your approval</Text>}</Text>
              <Text className="text-gray-500 font-semibold mb-2">Location:</Text>
              <Text className="mb-4">{modalVisible.meetingType || <Text className="text-red-500">Awaiting your approval</Text>}</Text>
              <Text className="text-gray-500 font-semibold mb-2">Teacher Name:</Text>
              <Text className="mb-4">{`${modalVisible.tutor.firstName} ${modalVisible.tutor.lastName}`}</Text>
              <Text className="text-gray-500 font-semibold mb-2">Time:</Text>
              <Text className="mb-4">{modalVisible.time}</Text>
              <Text className="text-gray-500 font-semibold mb-2">Date:</Text>
              <Text className="mb-4">{new Date(modalVisible.date).toLocaleDateString()}</Text>

              <View className="flex-row justify-between mt-4">
                <TouchableOpacity
                  className="bg-green-500 py-2 px-4 rounded-lg"
                  onPress={() => handleApprove(modalVisible)}
                >
                  <Text className="text-white font-pbold">Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-red-500 py-2 px-4 rounded-lg"
                  onPress={() => handleDecline(modalVisible._id)}
                >
                  <Text className="text-white font-pbold">Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-yellow-500 py-2 px-4 rounded-lg"
                  onPress={() => handleCancel(modalVisible._id)}
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

            <Text className="text-gray-500 font-semibold mb-2">Course Name:</Text>
            <Text className="mb-4 text-xl font-psemibold">{approvalSession?.courseName}</Text>
            
            <Text className="text-gray-500 font-semibold mb-2">Meeting Type:</Text>
            <View className="border border-gray-300 rounded-lg mb-4">
              <ModalDropdown
                options={['online', 'in-person']}
                defaultValue={meetingType}
                onSelect={(index, value) => setMeetingType(value as 'online' | 'in-person' | 'online')}
                style={{ padding: 10 }}
                textStyle={{ fontSize: 16 }}
                dropdownStyle={{ width: 200, padding: 10 }}
              />
            </View>
            <Text className="text-gray-500 font-semibold mb-2">Duration (minutes):</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4"
              placeholder="Enter duration"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={duration}
              onChangeText={setDuration}
            />
            {meetingType === 'online' && (
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-4"
                placeholder="Enter meeting link"
                placeholderTextColor="#999"
                value={meetingLink}
                onChangeText={setMeetingLink}
              />
            )}
            {meetingType === 'in-person' && (
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-4"
                placeholder="Enter location"
                placeholderTextColor="#999"
                value={location}
                onChangeText={setLocation}
              />
            )}
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
