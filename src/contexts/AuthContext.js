import { createContext, useState } from "react";
import axios from 'axios';
import { toastSuccessNotify } from "../helper/ToastNotify";

export const AuthContext = createContext();

const url = "http://127.0.0.1:8000/"

const AuthContextProvider= (props) => {
  const [currentUser, setCurrentUser] = useState(false);
  const [myKey, setMyKey] = useState("");

  const createUser = async (email, password, firstName, lastName, userName) => {
    try {
      const res = await axios.post(`${url}users/auth/register`, {
        "username": userName,
        "email": email,
        "first_name": firstName,
        "last_name": lastName,
        "password": password,
        "password2": password,
      })

      if(res.data.token){
        console.log(res);
        setMyKey(res.data.token)
        setCurrentUser(res.data.userName)
        sessionStorage.setItem('username', res.data.userName)
        //! In Javascript, the window.atob() method decodes a base64 string and the window.btoa() method encodes a string into base64. 👇
        const myToken = window.btoa(res.data.token)
        sessionStorage.setItem('token', myToken)
        toastSuccessNotify('User registered successfully.')
      }
    } catch (error) {
    }
  }

  const signIn = async (email, password, userName) => {
    try {
      const res = await axios.post(`${url}users/auth/login/`, {
        "email": email,
        "username": userName,
        "password": password,
      })
      if(res.data.token){
        console.log(res);
        setMyKey(res.data.token)
        setCurrentUser(res.data.user.userName)
        sessionStorage.setItem('username', res.data.userName)
        const myToken = window.btoa(res.data.token)
        sessionStorage.setItem('token', myToken)
        toastSuccessNotify('User login successfully.')
      }
    } catch (error) {

  }

  const logOut = async () =>{
    try {
      var config = {
        method: 'post',
        url: 'http://127.0.0.1:8000/users/auth/logouts/',
        headers: {
          'Authorization': `Token ${myKey}`,
        }
      };
      const res = await axios(config)
      if(res.status === 200){
        setCurrentUser(false)
        setMyKey(false)
        sessionStorage.clear()
      }
    } catch (error) {
      
    }

  }

  let value= {
    createUser,
    currentUser,
    myKey,
    signIn,
    logOut
  }

  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider;