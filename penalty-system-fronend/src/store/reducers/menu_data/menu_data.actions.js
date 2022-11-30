
import axios from 'axios'

import {
    CLEAR_MENU_DATA_ERROR,
    CLEAR_MENU_DATA_MESSAGE,
    LOADING_MENU_DATA_DATA,
    SET_MENU_DATA_DATA,
    SET_MENU_DATA_ERROR,
    SET_MENU_DATA_MESSAGE
} from './menu_data.types'


const setAuthorizationHeader = () => {
    if(localStorage.getItem('access_token') && localStorage.getItem('access_token') != '') {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token');

    }
};

export const getMenuData = (menu_id,sort_by = 'created_at', page = 1, perPage = 100) => (dispatch) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_MENU_DATA_DATA })
    axios.get('menu/'+menu_id+'/menu-data?per_page='+perPage+'&page='+page+'&sort_by='+sort_by)
    .then((res)=>{
        
        dispatch({ type: CLEAR_MENU_DATA_ERROR})
        dispatch({
            type: SET_MENU_DATA_DATA,
            payload: res.data
        })


    })
    .catch((error)=> {
        
        dispatch({
            type: SET_MENU_DATA_ERROR,
            payload: error.response.data
        })
    })

}


export const setNewMenuData = (newData, user_id, navigate) => (dispatch) => {

    dispatch({ type: LOADING_MENU_DATA_DATA })
    axios.post('users/'+user_id+'/menu-data', newData)
    .then((res)=>{
        
        dispatch({ type: CLEAR_MENU_DATA_ERROR})
        dispatch({
            type: SET_MENU_DATA_MESSAGE,
            payload: res.data
        })

        navigate('/otomatik/veri/'+newData.get('menu_id'))

    })
    .catch((error)=> {
        dispatch({
            type: SET_MENU_DATA_ERROR,
            payload: error.response.data
        })
    })

}


export const updateMenuData = (newData, user_id,menuData_id, menu_id) => (dispatch) => {

    
    dispatch({ type: LOADING_MENU_DATA_DATA })
    axios.put('users/'+user_id+'/menu-data/'+menuData_id, newData)
    .then((res)=>{
        
        dispatch({ type: CLEAR_MENU_DATA_ERROR})
        dispatch({
            type: SET_MENU_DATA_MESSAGE,
            payload: res.data
        })
        dispatch(getMenuData(menu_id))

    })
    .catch((error)=> {
        dispatch({
            type: SET_MENU_DATA_ERROR,
            payload: error.response.data
        })
    })

}

export const searchMenuData_data = (data,sort_by = 'created_at', page = 1, perPage = 100) => (dispatch) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_MENU_DATA_DATA })
    axios.get('menu-data-search?value='+data.query+'&menu_id='+data.menu_id+'&per_page='+perPage+'&page='+page+'&sort_by='+sort_by)
    .then((res)=>{
        
        dispatch({ type: CLEAR_MENU_DATA_ERROR})
        dispatch({
            type: SET_MENU_DATA_DATA,
            payload: res.data
        })


    })
    .catch((error)=> {
        
        dispatch({
            type: SET_MENU_DATA_DATA,
            payload: error.response.data
        })
    })

}



export const  deleteMenuData = (user_id, menuData_id, menu_id) => (dispatch) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_MENU_DATA_DATA })
    axios.delete('users/'+parseInt(user_id)+'/menu-data/'+parseInt(menuData_id))
    .then((res)=>{
        
        dispatch({ type: CLEAR_MENU_DATA_ERROR})
        dispatch({
            type: SET_MENU_DATA_MESSAGE,
            payload: res.data
        })
        dispatch(getMenuData(menu_id))


    })
    .catch((error)=> {
        
        dispatch({
            type: SET_MENU_DATA_ERROR,
            payload: error.response.data
        })
    })

}


export const deleteMultipleMenuData = (user_id, menuData_ids) => new Promise((successFun, errorFun) => {

    setAuthorizationHeader()
    menuData_ids.split(",").forEach(menuData_id => {
        
        axios.delete('users/'+parseInt(user_id)+'/menu-data/'+parseInt(menuData_id))
        .then((res)=>{
            successFun(res)
        })
        .catch(errorFun)
    });

})





