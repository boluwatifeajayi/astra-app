import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";


// import { useGlobalContext } from "../../context/GlobalProvider";

const AuthLayout = () => {
  // const { loading, isLogged } = useGlobalContext();

  // if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <>
      <Stack>
        <Stack.Screen
          name="student-login"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="tutor-login"
          options={{
            headerShown: false,
          }}
        />


        <Stack.Screen
          name="student-register"
          options={{
            headerShown: false,
          }}
        />          

        <Stack.Screen
          name="tutor-register"
          options={{
            headerShown: false,
          }}
        />          
      
      </Stack>

   

      {/* <Loader isLoading={loading} /> */}
      <StatusBar style="dark" />
    </>
  );
};

export default AuthLayout;
