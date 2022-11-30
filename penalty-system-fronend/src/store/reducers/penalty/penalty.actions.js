
import axios from 'axios'


import {
    CLEAR_PENALTY_ERROR,
    LOADING_PENALTY_DATA,
    SET_PENALTY_DATA,
    SET_PENALTY_ERROR,
    SET_PENALTY_MESSAGE,
} from './penalty.types'


const setAuthorizationHeader = () => {
    if(localStorage.getItem('access_token') && localStorage.getItem('access_token') != '') {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token');

    }
};

export const getAllPenalties = (sort_by = 'created_at', page = 1, perPage = 100, payStatus = "all") => (dispatch) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_PENALTY_DATA })
    axios.get('penalty?per_page='+perPage+'&page='+page+'&pay_status='+payStatus+'&sort_by='+sort_by)
    .then((res)=>{

        dispatch({ type: CLEAR_PENALTY_ERROR})
        dispatch({
            type: SET_PENALTY_DATA,
            payload: res.data
        })


    })
    .catch((error)=> {

        dispatch({
            type: SET_PENALTY_ERROR,
            payload: error.response.data
        })
    })

}

export const setNewPenalty = (newData, user_id, navigate) => (dispatch) => {

    dispatch({ type: LOADING_PENALTY_DATA })
    axios.post('users/'+user_id+'/penalty', newData)
    .then((res)=>{

        dispatch({ type: CLEAR_PENALTY_ERROR})
        dispatch({
            type: SET_PENALTY_MESSAGE,
            payload: res.data.message
        })

        navigate('/ceza')

    })
    .catch((error)=> {
        dispatch({
            type: SET_PENALTY_ERROR,
            payload: error.response.data
        })
    })

}


export const updatePenalty = (newData, user_id, penalty_id) => (dispatch) => {

    dispatch({ type: LOADING_PENALTY_DATA })
    axios.post('users/'+user_id+'/penalty/'+penalty_id, newData)
    .then((res)=>{

        dispatch({ type: CLEAR_PENALTY_ERROR})
        dispatch({
            type: SET_PENALTY_MESSAGE,
            payload: res.data.message
        })
        dispatch(getAllPenalties())

    })
    .catch((error)=> {
        dispatch({
            type: SET_PENALTY_ERROR,
            payload: error.response.data
        })
    })

}


export const searchPenaltiesData = (data,sort_by = 'created_at', page = 1, perPage = 100, payStatus = "all") => (dispatch) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_PENALTY_DATA })
    axios.post('penalty-search?per_page='+perPage+'&page='+page+'&pay_status='+payStatus+'&sort_by='+sort_by, data)
    .then((res)=>{

        dispatch({ type: CLEAR_PENALTY_ERROR})
        dispatch({
            type: SET_PENALTY_DATA,
            payload: res.data
        })


    })
    .catch((error)=> {

        dispatch({
            type: SET_PENALTY_ERROR,
            payload: error.response.data
        })
    })

}


export const deletePenalty = (user_id, penalty_id) => (dispatch) => new Promise((successFun,errorFun) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_PENALTY_DATA })
    axios.delete('users/'+parseInt(user_id)+'/delete/penalty/'+parseInt(penalty_id))
    .then((res)=>{
        successFun(res)

        // dispatch({ type: CLEAR_PENALTY_ERROR})
        // dispatch({
        //     type: SET_PENALTY_MESSAGE,
        //     payload: res.data
        // })
        dispatch(getAllPenalties())

    })
    .catch(errorFun)
    // .catch((error)=> {

    //     dispatch({
    //         type: SET_PENALTY_ERROR,
    //         payload: error.response.data
    //     })
    // })

})

export const setFilteredPenaltyData = (data) => (dispatch) => {
    dispatch({ type: LOADING_PENALTY_DATA })
    dispatch({
        type: SET_PENALTY_DATA,
        payload: data
    })
}


export const deleteMultiplePenalty = (user_id, penalty_ids) => new Promise((successFun, errorFun) => {

    setAuthorizationHeader()
    axios.post('users/penalty/delete', {
        ids: penalty_ids
    })
    .then((res)=>{
        successFun(res)
    })
    .catch(errorFun)
})
