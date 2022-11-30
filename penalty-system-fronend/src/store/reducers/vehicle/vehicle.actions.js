
import axios from 'axios'

import {
    CLEAR_VEHICLE_ERROR,
    SET_VEHICLE_PLATES_DATA,
    LOADING_VEHICLE_DATA,
    SET_VEHICLE_DATA,
    SET_VEHICLE_ERROR,
    SET_VEHICLE_MESSAGE,
} from './vehicle.types'


const setAuthorizationHeader = () => {
    if(localStorage.getItem('access_token') && localStorage.getItem('access_token') !== '') {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token');

    }
};

export const getAllVehicles = (sort_by = 'created_at', page = 1, perPage = 100) => (dispatch) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_VEHICLE_DATA })
    axios.get('vehicle?per_page='+perPage+'&page='+page+'&sort_by='+sort_by)
    .then((res)=>{
        
        dispatch({ type: CLEAR_VEHICLE_ERROR})
        dispatch({
            type: SET_VEHICLE_DATA,
            payload: res.data
        })


    })
    .catch((error)=> {
        
        dispatch({
            type: SET_VEHICLE_ERROR,
            payload: error.response.data
        })
    })

}

export const getAllVehiclesPlateNumber = () => (dispatch) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_VEHICLE_DATA })
    axios.get('all-vehicle-plates')
    .then((res)=>{
        
        dispatch({ type: CLEAR_VEHICLE_ERROR})
        dispatch({
            type: SET_VEHICLE_PLATES_DATA,
            payload: res.data
        })


    })
    .catch((error)=> {
        
        dispatch({
            type: SET_VEHICLE_ERROR,
            payload: error.response.data
        })
    })

}

export const setNewVehicle = (newData, user_id, navigate) => (dispatch) => {

    dispatch({ type: LOADING_VEHICLE_DATA })
    axios.post('users/'+user_id+'/vehicle', newData)
    .then((res)=>{
        
        dispatch({ type: CLEAR_VEHICLE_ERROR})
        dispatch({
            type: SET_VEHICLE_MESSAGE,
            payload: res.data.message
        })

        navigate('/arac')

    })
    .catch((error)=> {
        dispatch({
            type: SET_VEHICLE_ERROR,
            payload: error.response.data
        })
    })

}


export const updateVehicle = (newData, user_id,vehicle_id) => (dispatch) => {

    dispatch({ type: LOADING_VEHICLE_DATA })
    axios.put('users/'+user_id+'/vehicle/'+vehicle_id, newData)
    .then((res)=>{
        
        dispatch({ type: CLEAR_VEHICLE_ERROR})
        dispatch({
            type: SET_VEHICLE_MESSAGE,
            payload: res.data.message
        })

        dispatch(getAllVehicles())

    })
    .catch((error)=> {
        dispatch({
            type: SET_VEHICLE_ERROR,
            payload: error.response.data
        })
    })

}



export const searchVehiclesData = (data,sort_by = 'created_at', page = 1, perPage = 100) => (dispatch) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_VEHICLE_DATA })
    axios.post('vehicles-search?per_page='+perPage+'&page='+page+'&sort_by='+sort_by, data)
    .then((res)=>{
        
        dispatch({ type: CLEAR_VEHICLE_ERROR})
        dispatch({
            type: SET_VEHICLE_DATA,
            payload: res.data
        })


    })
    .catch((error)=> {
        
        dispatch({
            type: SET_VEHICLE_ERROR,
            payload: error.response.data
        })
    })

}


export const deleteVehicle = (user_id, vehicle_id) => (dispatch) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_VEHICLE_DATA })
    axios.delete('users/'+parseInt(user_id)+'/vehicle/'+parseInt(vehicle_id))
    .then((res)=>{
        
        dispatch({ type: CLEAR_VEHICLE_ERROR})
        dispatch({
            type: SET_VEHICLE_MESSAGE,
            payload: res.data
        })
        dispatch(getAllVehicles())


    })
    .catch((error)=> {
        
        dispatch({
            type: SET_VEHICLE_ERROR,
            payload: error.response.data
        })
    })

}


export const deleteMultipleVehicles = (user_id, vehicle_ids) => new Promise((successFun, errorFun) => {

    setAuthorizationHeader()
    vehicle_ids.split(",").forEach(vehicle_id => {
        
        axios.delete('users/'+parseInt(user_id)+'/vehicle/'+parseInt(vehicle_id))
        .then((res)=>{
            successFun(res)
        })
        .catch(errorFun)
    });

})



