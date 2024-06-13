import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

// Sample data for messages
interface Message {
  name: string;
  message: string;
  time: string;
}

const messagesData: Message[] = [
  { name: 'John Doe', message: 'Hello, how are you?', time: '9:30 AM' },
  { name: 'Jane Smith', message: 'Did you finish the report?', time: '11:15 AM' },
  { name: 'Bob Johnson', message: 'Let\'s have a meeting tomorrow.', time: '2:45 PM' },
  // Add more sample data as needed
];

// Sample data for notifications
interface Notification {
  notification: string;
}

const notificationsData: Notification[] = [
  { notification: 'Your schedule status has been changed' },
  { notification: 'Your session has been approved' },
  { notification: 'You have a new message' },
  // Add more sample data as needed
];

const NotificationsScreen = () => {
  const [activeTab, setActiveTab] = useState<'messages' | 'notifications'>('messages');

  const handleMessagePress = (message: Message) => {
    // Handle message press here
    console.log('Message pressed:', message);
  };

  return (
    <View className="flex-1 bg-blue-50 pt-16">
      <Text className="text-2xl font-pbold text-gray-800 mt-4 px-4 mb-2">Messages & Notifications</Text>
      <View className="flex flex-row px-4 py-2">
        <Text
          className={`flex-1 py-2 text-left font-pbold ${
            activeTab === 'messages' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
          }`}
          onPress={() => setActiveTab('messages')}
        >
          Messages ({messagesData.length})
        </Text>
        <Text
          className={`flex-1 py-2 text-right font-pbold ${
            activeTab === 'notifications' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
          }`}
          onPress={() => setActiveTab('notifications')}
        >
          Notifications ({notificationsData.length})
        </Text>
      </View>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {activeTab === 'messages' ? (
          messagesData.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleMessagePress(item)}>
              <Text className="font-pbold mr-4 pl-4 mt-2">{item.name}</Text>
              <View className="flex-row items-center pb-4 px-4 border-b border-gray-200">
                <Text className="flex-1 font-pregular">{item.message}</Text>
                <Text className="text-gray-500 font-pregular">{item.time}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          notificationsData.map((item, index) => (
            <View key={index} className="px-4 py-4 border-b border-gray-200">
              <Text className='font-psemibold'>{item.notification}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default NotificationsScreen;