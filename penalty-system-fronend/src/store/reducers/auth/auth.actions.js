
import axios from 'axios'
import {
    SET_AUTHENTICATED,
    CLEAR_ERROR,
    SET_USER_DETAILS,
    LOADING_USER,
    SET_ERROR,
    SET_MESSAGE,
    SET_UNAUTHENTICATED
} from './auth.types'
import { forgotPasswordPageType } from '../../../utils/constants'



const setAuthorizationHeader = () => {
    if(localStorage.getItem('access_token') && localStorage.getItem('access_token') != '') {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token');

    }
};

export const loginUser = (userData, navigate) => (dispatch) => {
    dispatch({ type: LOADING_USER })
    axios.post('auth/login', userData)
    .then((res)=>{

        localStorage.setItem('access_token', `Bearer ${res.data.access_token}`);
        setAuthorizationHeader()
        dispatch({ type: CLEAR_ERROR})
        dispatch({ type: SET_AUTHENTICATED})
        dispatch(getUserDetails())
        dispatch({
            type: SET_MESSAGE,
            payload: "Başarılı Giriş"
        })
        
        navigate('/ana-sayfa')

    })
    .catch((error)=> {
        dispatch({
            type: SET_ERROR,
            payload: error.response.data
        })
        dispatch({ type: SET_UNAUTHENTICATED})
    })

}


export const signUpUser = (userData, navigate, isSignUp = true) => (dispatch) => {

    dispatch({ type: LOADING_USER })
    axios.post('auth/signup', userData)
    .then((res)=>{
        
        dispatch({ type: CLEAR_ERROR})
        dispatch({ type: SET_AUTHENTICATED})
        dispatch({
            type: SET_MESSAGE,
            payload: res.data.message
        })

        if(isSignUp) {
            navigate('/auth/login/')
        }else {
            
            navigate('/personel')
        }

    })
    .catch((error)=> {
        dispatch({
            type: SET_ERROR,
            payload: error.response.data
        })
        // dispatch({ type: SET_UNAUTHENTICATED})
    })

}


export const getUserDetails = () => (dispatch) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_USER })
    axios.get('auth/user-details')
    .then((res)=>{
        
        dispatch({ type: CLEAR_ERROR})
        dispatch({
            type: SET_USER_DETAILS,
            payload: res.data
        })
    })
    .catch((error)=> {
        
        dispatch({
            type: SET_ERROR,
            payload: error.response.data
        })
        dispatch({ type: SET_UNAUTHENTICATED})
    })

}


export const updateProfileImage = (userData) => (dispatch) => {
    
    dispatch({ type: LOADING_USER })
    setAuthorizationHeader()
    axios.post('auth/update-profile', userData)
    .then((res)=>{
        
        dispatch({ type: CLEAR_ERROR})
        dispatch({ type: SET_AUTHENTICATED})
        dispatch({
            type: SET_MESSAGE,
            payload: res.data.message
        })

    })
    .catch((error)=> {
        dispatch({
            type: SET_ERROR,
            payload: error.response.data
        })
    })

}


export const editProfile = (userData, user_id) => (dispatch) => {
    
    dispatch({ type: LOADING_USER })
    setAuthorizationHeader()
    axios.put('users/'+user_id, userData)
    .then((res)=>{
        
        dispatch({ type: CLEAR_ERROR})
        dispatch({
            type: SET_MESSAGE,
            payload: res.data['message']
        })

    })
    .catch((error)=> {
        dispatch({
            type: SET_ERROR,
            payload: error.response.data
        })
    })

}


export const checkEmail = (email, navigate) => (dispatch) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_USER })
    axios.get('auth/check-account?email='+email)
    .then((res)=>{
        
        dispatch({ type: CLEAR_ERROR})
        dispatch({
            type: SET_MESSAGE,
            payload: res.data.message
        })

        navigate('/auth/login')


    })
    .catch((error)=> {
        
        dispatch({
            type: SET_ERROR,
            payload: error.response.data
        })
        dispatch({ type: SET_UNAUTHENTICATED})
    })

}


export const forgotPassword = (data, navigate) => (dispatch) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_USER })
    axios.post('auth/forgot-password', data)
    .then((res)=>{
        
        dispatch({ type: CLEAR_ERROR})
        dispatch({
            type: SET_MESSAGE,
            payload: res.data.message
        })
        navigate('/auth/login')


    })
    .catch((error)=> {
        
        dispatch({
            type: SET_ERROR,
            payload: error.response.data
        })
        dispatch({ type: SET_UNAUTHENTICATED})
    })

}


export const resendEmailLink = (email) => (dispatch) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_USER })
    axios.get('auth/verification-resend?email='+email)
    .then((res)=>{
        
        dispatch({ type: CLEAR_ERROR})
        dispatch({
            type: SET_MESSAGE,
            payload: res.data.message
        })

    })
    .catch((error)=> {
        
        dispatch({
            type: SET_ERROR,
            payload: error.response.data
        })
        dispatch({ type: SET_UNAUTHENTICATED})
    })

}

export const logOut = (navigate) => (dispatch) => {

    dispatch({ type: LOADING_USER })
    axios.post('auth/logout')
    .then((res)=>{
        //delete access token
        localStorage.setItem('access_token', '')
        dispatch({ type: CLEAR_ERROR})
        dispatch({ type: SET_UNAUTHENTICATED})        
        navigate('/auth/login')

    })
    .catch((error)=> {
        dispatch({
            type: SET_ERROR,
            payload: error.response.data
        })
    })

}