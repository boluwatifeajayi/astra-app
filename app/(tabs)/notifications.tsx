import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { server } from '@/server';
import { router } from 'expo-router';

const NotificationsScreen = () => {
  const [activeTab, setActiveTab] = useState<'messages' | 'notifications'>('messages');
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');

      const messagesResponse = await axios.get(`${server}/messages/tutors`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const notificationsResponse = await axios.get(`${server}/notification/student`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages(messagesResponse.data);
      setNotifications(notificationsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-orange-50">
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-orange-50 pt-16">
      <Text className="text-2xl font-pbold text-gray-800 mt-4 px-4 mb-2">Messages & Notifications</Text>
      <View className="flex flex-row px-4 py-2">
        <Text
          className={`flex-1 py-2 text-left font-pbold ${
            activeTab === 'messages' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'
          }`}
          onPress={() => setActiveTab('messages')}
        >
          Messages ({messages.length})
        </Text>
        <Text
          className={`flex-1 py-2 text-right font-pbold ${
            activeTab === 'notifications' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'
          }`}
          onPress={() => setActiveTab('notifications')}
        >
          Notifications ({notifications.length})
        </Text>
      </View>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'messages' ? (
          messages.map((item:any, index) => (
            <TouchableOpacity key={index} onPress={() => router.push(`/innerscreens/studentChat/${item._id}`)}>
              <Text className="font-pbold mr-4 pl-4 text-xl mt-2">{item.firstName} {item.lastName}</Text>
              <View className="flex-row items-center pb-4 px-4 border-b border-gray-200">
                <Text className="flex-1 font-pregular">New Chat</Text>
                {/* <Text className="text-gray-500 font-pregular">{new Date(item.time).toLocaleString()}</Text> */}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          notifications.map((item:any, index) => (
            <View key={index} className="px-4 py-4 border-b border-gray-200">
              <Text className="font-psemibold">{item.message}</Text>
              <Text className="text-gray-500 font-pregular">{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default NotificationsScreen;
