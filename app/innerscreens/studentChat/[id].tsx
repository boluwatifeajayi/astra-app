import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { server } from '@/server';

interface ChatMessage {
  content: string;
  senderModel: 'Student' | 'Tutor';
  timestamp: string;
  createdAt?: string;
}

interface Tutor {
  id: string;
  firstName: string;
  lastName: string;
  // Add other tutor properties as needed
}

const StudentChat = () => {
  const { id: tutorId } = useLocalSearchParams<{ id: string }>();
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchTutorData();
    fetchChatData();
  }, []);

  const fetchTutorData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${server}/tutors/get/${tutorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTutor(response.data);
    } catch (error) {
      console.error('Error fetching tutor data:', error);
    }
  };

  const fetchChatData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${server}/messages/conversation/${tutorId}/Tutor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChat(response.data);
    } catch (error) {
      console.error('Error fetching chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    setSending(true);
    const newMessage: ChatMessage = {
      content: message,
      senderModel: 'Student',
      timestamp: new Date().toISOString(),
    };

    try {
      setChat(prevChat => [...prevChat, newMessage]);
      setMessage('');
      scrollViewRef.current?.scrollToEnd({ animated: true });

      const token = await AsyncStorage.getItem('userToken');
      await axios.post(
        `${server}/messages/send`,
        { recipientId: tutorId, content: message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setChat(prevChat => prevChat.filter(msg => msg !== newMessage));
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        <View className="flex-1">
          {/* Header */}
          <View className="flex-row items-center p-4 bg-orange-500">
            <TouchableOpacity onPress={() => router.push('/notifications')} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">{tutor?.firstName} {tutor?.lastName}</Text>
          </View>

          {/* Chat messages */}
          <ScrollView 
            ref={scrollViewRef}
            className="flex-1 p-4"
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {chat.map((item:any, index) => (
              <View key={index} className={`mb-4 ${item.senderModel === 'Student' ? 'items-end' : 'items-start'}`}>
                <View className={`p-3 rounded-lg ${item.senderModel === 'Student' ? 'bg-orange-500 rounded-br-none' : 'bg-gray-200 rounded-bl-none'}`}>
                  <Text className={item.senderModel === 'Student' ? 'text-white' : 'text-gray-800'}>{item.content}</Text>
                </View>
                <Text className="text-xs text-gray-500 mt-1">{new Date(item.timestamp || item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Message input */}
          <View className="flex-row items-center p-4 bg-white border-t border-gray-200">
            <TextInput
              className="flex-1 bg-gray-100 rounded-xl px-4 py-4 mr-2"
              placeholder="Type a message..."
              placeholderTextColor="#777"
              value={message}
              onChangeText={setMessage}
              editable={!sending}
            />
            <TouchableOpacity onPress={sendMessage} disabled={sending}>
              <Ionicons name="paper-plane" size={24} color={sending ? '#CCCCCC' : '#F97316'} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default StudentChat;