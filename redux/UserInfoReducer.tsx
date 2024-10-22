import { SET_USERINFO } from "../action/types";
import { userInfoType } from "../action/types";

const initialState = {
    userName: "",
    passWord: null,
    email: null,
    avatarImg: ""
}

const UserInfoReducer = (state: userInfoType = initialState, action : any) => {
    switch (action.type) {
        case SET_USERINFO:
            return {
                ...state,
                ...action.data
            }

        default:
            return state;
    }
}

export default UserInfoReducer;