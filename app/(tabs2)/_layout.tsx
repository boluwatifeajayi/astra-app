import React from "react";
import { View, Text } from "react-native";
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import MaterialIcons from '@expo/vector-icons/MaterialIcons';




export default function TabsLayout() {
  return (
   
    <Tabs
      initialRouteName="dashboard"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#2a52be", 
          paddingTop: 5, 
          height: 70,
          
          paddingBottom: 15, 
          borderTopLeftRadius: 15, 
          borderTopRightRadius: 15, 
          ...Platform.OS === "ios" ? {
            backgroundColor: "#2a52be", 
            paddingTop: 5, 
            height: 90,
            
            paddingBottom: 35, 
            borderTopLeftRadius: 0, 
            borderTopRightRadius: 0, 
          } : {},
        },
        headerShown: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "lightgray",
      }}
      tabBar={(props) =>
        Platform.OS === "ios" ? (
          <BlurView
            style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
            intensity={95}
          >
            <BottomTabBar {...props} />
          </BlurView>
        ) : (
          <BottomTabBar {...props} />
        )
      }
    >

<Tabs.Screen
        name="dashboard"
        options={{
          href: "/dashboard",
          
          tabBarIcon: ({ color }) => (
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                marginTop: 17,
                backgroundColor: "transparent",
              }}
            >
              
              <Entypo name="home" size={24} color={color} />
            
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          href: "/search",
          
          tabBarIcon: ({ color }) => (
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                marginTop: 17,
                backgroundColor: "transparent",
              }}
            >
              
              <Ionicons name="search" size={24} color={color} />
             
            </View>
          ),
        }}
      />
     
     <Tabs.Screen
        name="requests"
        options={{
          href: "/requests",
         
          tabBarIcon: ({ color }) => (
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                marginTop: 17,
                backgroundColor: "transparent",
              }}
            >
              
              <MaterialIcons name="school" size={24} color={color} />
             
            </View>
          ),
        }}
      />

     

      <Tabs.Screen
        name="messages"
        options={{
          href: {
            pathname: "/messages",
          },
          tabBarIcon: ({ color }) => (
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                marginTop: 17,
                backgroundColor: "transparent",
              }}
            >
             <Ionicons name="notifications" size={24} color={color} />
              
            </View>
          ),
        }}
      />

<Tabs.Screen
        name="settings"
        options={{
          href: {
            pathname: "/settings",
          },
          tabBarIcon: ({ color }) => (
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                marginTop: 17,
                backgroundColor: "transparent",
              }}
            >
             <Ionicons name="settings" size={24} color={color} />
             
            </View>
          ),
        }}
      />


{/* <Tabs.Screen
        name="chats"
        options={{
          href: {
            pathname: "/chats",
          },
          tabBarIcon: ({ color }) => (
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                marginTop: 17,
                backgroundColor: "transparent",
              }}
            >
             <Ionicons name="chatbox-ellipses" size={24} color={color} />
              <Text style={{ marginTop: 3, paddingBottom: 10, fontSize: 10, opacity: 0.5 }}>
      
              </Text>
            </View>
          ),
        }}
      /> */}
    </Tabs>
  
  );
}

function TabBarIcon(props:any) {
  return (
    // <FontAwesome5
    //   size={props.size || 26}
    //   style={{ marginBottom: -3 }}
    //   {...props}
    // />
    <Ionicons name="dashboard" size={props.size || 26} color="black" style={{ marginBottom: -3 }} {...props}/>
  );
}