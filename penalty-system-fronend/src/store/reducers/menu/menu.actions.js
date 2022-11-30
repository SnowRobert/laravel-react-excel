
import axios from 'axios'

import {
    CLEAR_MENU_ERROR,
    LOADING_MENU_DATA,
    SET_SINGLE_MENU_DATA,
    SET_MENU_DATA,
    SET_MENU_ERROR,
    SET_MENU_ENTRIES_DATA,
    SET_MENU_MESSAGE,
} from './menu.types'


const setAuthorizationHeader = () => {
    if(localStorage.getItem('access_token') && localStorage.getItem('access_token') != '') {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token');

    }
};

export const getAllMenus = () => (dispatch) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_MENU_DATA })
    axios.get('menu')
    .then((res)=>{
        
        dispatch({ type: CLEAR_MENU_ERROR})
        dispatch({
            type: SET_MENU_DATA,
            payload: res.data
        })


    })
    .catch((error)=> {
        
        dispatch({
            type: SET_MENU_ERROR,
            payload: error.response.data
        })
    })

}


export const getMenuInfo = (menu_id) => (dispatch) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_MENU_DATA })
    axios.get('menu/'+menu_id)
    .then((res)=>{
        
        dispatch({ type: CLEAR_MENU_ERROR})
        dispatch({
            type: SET_SINGLE_MENU_DATA,
            payload: res.data,
        })


    })
    .catch((error)=> {

        dispatch({
            type: SET_MENU_ERROR,
            payload: error.response.data
        })
    })

}

export const setNewMenu = (newData, user_id) => (dispatch) => {

    dispatch({ type: LOADING_MENU_DATA })
    axios.post('users/'+user_id+'/menu', newData)
    .then((res)=>{
        
        dispatch({ type: CLEAR_MENU_ERROR})
        dispatch({
            type: SET_MENU_MESSAGE,
            payload: res.data
        })

    })
    .catch((error)=> {
        dispatch({
            type: SET_MENU_ERROR,
            payload: error.response.data
        })
    })

}



export const getAllMenuEntries = (menu_id) => (dispatch) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_MENU_DATA })
    axios.get('menu/'+menu_id+'/menu-item')
    .then((res)=>{
        dispatch({ type: CLEAR_MENU_ERROR})
        dispatch({
            type: SET_MENU_ENTRIES_DATA,
            payload: res.data
        })


    })
    .catch((error)=> {
        
        dispatch({
            type: SET_MENU_ERROR,
            payload: error.response.data
        })
    })

}

export const setNewMenuEntries = (newData, user_id,navigate) => (dispatch) => {

    dispatch({ type: LOADING_MENU_DATA })
    axios.post('users/'+user_id+'/menu-item', newData)
    .then((res)=>{
        
        dispatch({ type: CLEAR_MENU_ERROR})
        dispatch({
            type: SET_MENU_MESSAGE,
            payload: res.data
        })
        dispatch(getAllMenus())

        navigate('/otomatik/veri/'+newData.menu_id)


    })
    .catch((error)=> {
        dispatch({
            type: SET_MENU_ERROR,
            payload: error.response.data
        })
    })

}

export const deleteMenu = (user_id, menu_id) => (dispatch) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_MENU_DATA })
    axios.delete('users/'+parseInt(user_id)+'/menu/'+parseInt(menu_id))
    .then((res)=>{
        
        dispatch({ type: CLEAR_MENU_ERROR})
        dispatch({
            type: SET_MENU_MESSAGE,
            payload: res.data
        })
        dispatch(getAllMenus())


    })
    .catch((error)=> {
        
        dispatch({
            type: SET_MENU_ERROR,
            payload: error.response.data
        })
    })

}




