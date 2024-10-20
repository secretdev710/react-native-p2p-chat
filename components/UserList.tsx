import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { useSelector } from "react-redux";
import { FlatList } from "react-native";

import { UserListItem, UserListItemProps } from "./UserListItem";
import { RootState } from "../redux/store";
import { useSocket } from "../utils/SocketContex";

// Define the route prop type
type RootStackParamList = {
    UserList: { userName: string; avatarImg: string };
};

type UserListRouteProp = RouteProp<RootStackParamList, 'UserList'>;

const UserList = () => {
    const route = useRoute<UserListRouteProp>(); // Cast route to the correct type
    const { userName, avatarImg } = route.params;
    let [userList, setUserLIst] = useState([]);

    const { socket } = useSocket();

    useEffect(() => {
        if (socket) {
            socket.on('connect', () => {
                console.log('Connected to server');
            });

            socket.on('disconnect', () => {
                console.log('Disconnected from server');
            });

            socket.on('send userList', (socketlist: any) => {
                let tmp: [] = socketlist;
                let tmp1 = tmp.filter((val : any) => val.userId !== socket.id);
                setUserLIst(tmp1);
            })
        }

    }, []);

    const renderItem = ({ item }: { item: any }) =>
        <UserListItem item={{ partnerId: item.userId, partnerName: item.userName, userName: userName }} />

    return (
        <View>
            <FlatList
                inverted
                data={userList}
                renderItem={renderItem}
                keyExtractor={(item: { userId: string }) => item.userId}
            ></FlatList>
        </View>
    );
}

export default UserList;