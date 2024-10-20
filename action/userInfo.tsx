import { SET_USERINFO } from "./types";
import { userInfoType } from "./types";

import { Socket } from "socket.io-client";

export const SetUserInfo = (userInfo: any) => {
    return {
        type: SET_USERINFO,
        data: userInfo
    }
}