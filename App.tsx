import React, { useEffect, useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from "react-redux";

import PersonalInfo from './components/PersonalInfo';
import Chat from "./components/Chat";
import UserList from "./components/UserList";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";

import { store } from "./redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from 'expo-splash-screen';
import { SocketProvider } from './utils/SocketContex';

type RootStackParamList = {
  UserList: { userName: string; avatarImg: string };
  Chat: { userName: string; avatarImg: string; partner: string };
  PersonalInfo: undefined; // If no params are expected
};

const Stack = createNativeStackNavigator();

export default function App() {
  const storageUserNameKey = "chatapp-username";
  const storageImageKey = "chatapp-image";

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchPersonalData = async () => {
    let fetchedUsername = await AsyncStorage.getItem(storageUserNameKey);
    let userName = fetchedUsername == null ? "" : fetchedUsername;
    let fetchedImage = await AsyncStorage.getItem(storageImageKey);
    let image = fetchedImage == null ? "" : fetchedImage;
    setName(userName);
    setImage(image);
  };

  AsyncStorage.clear();

  const onSubmitPersonalInfo = async (name: string, image: string) => {
    setName(name);
    await AsyncStorage.setItem(storageUserNameKey, name);
    setImage(image);
    await AsyncStorage.setItem(storageImageKey, image);
  }

  if (isLoading) {
    // Prevent auto-hiding of the splash screen
    SplashScreen.preventAutoHideAsync();

    // Start your data fetching process
    fetchPersonalData()
      .then(() => {
        // Once data fetching is complete, hide the splash screen
        SplashScreen.hideAsync();
        setIsLoading(false);
      })
      .catch((error) => {
        // Handle errors
        console.warn(error);
      });

    // Return null during loading
    return null;
  }

  return (
    <SocketProvider>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="LoginScreen">
            <Stack.Screen name="LoginScreen" component={() => <LoginScreen />} />
            <Stack.Screen name="RegisterScreen" component={() => <RegisterScreen />} />
            <Stack.Screen name="ResetPasswordScreen" component={() => <ResetPasswordScreen />} />
            <Stack.Screen name="PersonalInfo" component={() => <PersonalInfo onClosed={() => { onSubmitPersonalInfo }} />} />
            <Stack.Screen name="UserList" component={() => <UserList />} />
            <Stack.Screen name="Chat" component={() => <Chat />} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </SocketProvider>
  );
}