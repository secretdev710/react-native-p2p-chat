import React, { useEffect, useState } from "react";
import { Image, ImageBackground, Pressable, Text, TextInput, View } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from "react-redux";
import { io, Socket } from 'socket.io-client';

import Styles from './Styles';
import ImageChooser from "./ImageChooser";
import { SetUserInfo } from "../action/userInfo";
import { RootState, AppDispatch } from '../redux/store';
import { useSocket } from "../utils/SocketContex";

type PersonalInfoProps = {
    onClosed: (userName: string, avatarImg: string) => void
};

type RootStackParamList = {
    PersonalInfo: undefined;
    UserList: { userName: string } | undefined;
};

type PersonalInfoScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'PersonalInfo'
>;

const PersonalInfo = ({ onClosed }: PersonalInfoProps) => {
    const [name, setName] = useState("");
    const [image, setImage] = useState("");

    const navigation = useNavigation<PersonalInfoScreenNavigationProp>();

    const dispatch = useDispatch<AppDispatch>();
    const { socket } = useSocket();

    return (
        <View style={Styles.personalInfoContainer}>
            <ImageBackground source={require("../assets/login-bg.png")} resizeMode="repeat" style={Styles.bg}>
                <Image
                    style={Styles.logoImage}
                    source={require("../assets/chat-expo-app-icon.png")} />
                <Text style={Styles.welcome}>Welcome to ChatExpo</Text>
                <View style={Styles.enterYourName}>
                    <Text style={Styles.nameText}>Please enter your name</Text>
                    <TextInput
                        style={Styles.nameTextInput}
                        onChangeText={(val) => {
                            setName(val)
                        }}
                        value={name}
                    />
                    <ImageChooser onChangeImage={(image) => setImage(image)} />
                    <Pressable onPress={
                        () => {
                            dispatch(SetUserInfo({ userName: name, avatarImage: image }));
                            if (socket)
                                socket.emit("join", name);
                            navigation.navigate(
                                "UserList",
                                { userName: name }
                            )
                        }}
                        style={() => [
                            Styles.LoginBtn
                        ]}>
                        <Text style={Styles.LoginBtnText}> Start Chatting...</Text>
                    </Pressable>
                </View>
            </ImageBackground>
        </View>
    );
}

export default PersonalInfo;