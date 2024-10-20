import { View, Text, Pressable } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../utils/style";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

// Define types for the message and item
interface Message {
    text?: string;
    time?: string;
}

interface UserListItemProps {
    item: {
        userName: string,
        partnerId: string,
        partnerName: string,
    };
}

type RootStackParamList = {
    UserListItem: undefined; // No parameters expected for this screen
    Chat: { // Define the expected parameters for the Chat screen
        item: {
            userName: string;
            partnerId: string;
            partnerName: string;
        };
    };
};

type UserListItemNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'UserListItem'
>;

const UserListItem: React.FC<UserListItemProps> = ({ item }) => {
    const navigation = useNavigation<UserListItemNavigationProp>();
    return (
        <Pressable style={styles.cchat} onPress={() => {
            navigation.navigate("Chat", {item});
        }}>
            <Ionicons
                name='person-circle-outline'
                size={45}
                color='black'
                style={styles.cavatar}
            />

            <View style={styles.crightContainer}>
                <View>
                    <Text style={styles.cusername}>{item.partnerName}</Text>
                </View>
            </View>
        </Pressable>
    );
};

export { UserListItem, UserListItemProps };