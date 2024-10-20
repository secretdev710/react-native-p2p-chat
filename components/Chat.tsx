import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import {
    FlatList,
    TextInput,
    Pressable,
    ListRenderItem,
} from "react-native";
import { useSelector } from "react-redux";

import Styles from './Styles';
import { RenderChatItem, ChatItem } from "./ChatItem";
import { RootState } from "../redux/store";
import { useSocket } from "../utils/SocketContex";

type RootStackParamList = {
    Chat: { item: any };
};

type UserListRouteProp = RouteProp<RootStackParamList, 'Chat'>;

const Chat = () => {
    const [chatInput, setChatInput] = useState("");
    const [chatItems, setChatItems] = useState<ChatItem[]>([]);
    const route = useRoute<UserListRouteProp>(); 
    const { userName, partnerId, partnerName } = route.params.item;

    const { socket } = useSocket();

    const sendMessage = () => {
        if (chatInput.trim() && socket) {
            const messageData = {
                senderId: socket.id,
                receiverId: partnerId,
                message: chatInput.trim(),
                timeStamp: Date.now(),
            };

            socket.emit('chat message', messageData);

            setChatItems(prevItems => [
                ...prevItems,
                {
                    id: `id_${messageData.timeStamp}`,
                    text: messageData.message,
                    image: "",
                    timeStamp: messageData.timeStamp,
                    by: userName,
                },
            ]);
            setChatInput('');
        }
    };

    useEffect(() => {
        if (socket) {
            const handleMessage = (data: { message: string; timeStamp: number; senderId: string }) => {
                const { message, timeStamp, senderId } = data;
                if (senderId === partnerId) {
                    setChatItems(prevItems => [
                        ...prevItems,
                        {
                            id: `id_${timeStamp}`,
                            text: message,
                            image: "",
                            timeStamp,
                            by: partnerName,
                        },
                    ]);
                }
            };

            socket.on('new message', handleMessage);

            return () => {
                socket.off('new message', handleMessage);
            };
        }
    }, [socket, partnerId, partnerName]);

    const renderChatItem: ListRenderItem<ChatItem> = ({ item }) => (
        <RenderChatItem chatItem={item} username={userName} />
    );

    return (
        <View style={Styles.chatInfoContainer}>
            <FlatList
                inverted
                data={chatItems.sort((a, b) => b.timeStamp - a.timeStamp)}
                renderItem={renderChatItem}
                keyExtractor={item => item.id}
            />
            <View style={Styles.sendSection}>
                <TextInput
                    style={Styles.chatTextInput}
                    value={chatInput}
                    onChangeText={setChatInput}
                />
                <Pressable style={Styles.chatBtn} onPress={sendMessage}>
                    <Text style={Styles.chatBtnText}>Send</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default Chat;