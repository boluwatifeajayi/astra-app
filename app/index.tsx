import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";




// import { useGlobalContext } from "../context/GlobalProvider";

const Welcome = () => {
 

  return (
    <SafeAreaView className="bg-white h-full">
      {/* <Loader isLoading={loading} /> */}

      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center h-full px-4">
         
        <Image source={require('../assets/images/logo.png')} className="w-32 h-32 mb-0" />
         

          <View className="relative mt-5">
            <Text className="text-3xl text-gray-800 font-pbold text-center">
           
             Unlock Your{"\n"}
             Potential with{" "}
              <Text className="text-secondary-200">Astra</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm font-pregular text-gray-600 mt-5 text-center">
          Master anything. Expert tutors, personalized learning. Students, professionals, lifelong learners - achieve your goals.
          </Text>

         <TouchableOpacity onPress={() => router.push("/student-login")} className="mt-7 rounded-xl w-full py-4 text-center bg-orange-500">
            <Text className="text-white text-center font-pbold">Continue as Student</Text>
         </TouchableOpacity>
            <Text className="font-pbold text-center py-2 text-gray-500">or</Text>
         <TouchableOpacity onPress={() => router.push("/tutor-login")}  className="mt-1 rounded-xl w-full py-4 text-center bg-blue-700">
            <Text className="text-white text-center font-pbold">Continue as Tutor</Text>
         </TouchableOpacity>
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;