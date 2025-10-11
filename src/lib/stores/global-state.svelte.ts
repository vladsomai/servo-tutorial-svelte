import type { User } from "firebase/auth"

export interface UserStateType {
    CurrentUser: User | null
}
export const UserStateObj = $state<UserStateType>({ CurrentUser: null })

export function SetCurrentUser(usr: User | null) {
    UserStateObj.CurrentUser = usr
}

console.log("Global state is defined")
