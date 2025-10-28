import { createUserWithEmailAndPassword, sendPasswordResetEmail, updatePassword } from "firebase/auth";
import {auth} from "./firebase";

import {createUserWithEmailAndPassword} from "./firebase/auth";

export const doCreateUserWithEmailAndPassword = async(email,password) => {
    return createUserWithEmailAndPassword(auth,email,password);
};

export const doSignOut = () => {
    return auth.signOut();
}

export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth,email);
}

export const doPasswordChange = (password) =>{
    return updatePassword(auth.currentUser, password);
}