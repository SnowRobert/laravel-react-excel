import './App.css';
import React, {useEffect} from 'react';
import {useRoutes} from 'react-router-dom'
import {routes} from './components/routes/index';
import {SnackbarProvider} from 'notistack';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {getUserDetails} from './store/reducers/auth/auth.actions';

function App() {

    const dispatch = useDispatch()
    // const changeSTr = '';
    const authReducer = useSelector((state) => state.authReducer)
    const routing = useRoutes(routes(authReducer.authenticated, getVerified(), getEmail()));
//  axios.defaults.baseURL = 'https://vehicle-penalty-api.herokuapp.com/api/'
//     axios.defaults.baseURL = 'http://excel-upload.loc/api/'

    axios.defaults.baseURL = 'https://oguzhansenyigit.com/api/api/'
    // axios.defaults.baseURL = 'https://trafikceza.ibb.gov.tr/api/api'
    // axios.defaults.baseURL = 'http://localhost:8000/api/'


    function getVerified() {
        return ("verified" in authReducer.data) ? authReducer.data.verified : 1
    }

    function getEmail() {
        return ("email" in authReducer.data) ? authReducer.data.email : ""
    }

    useEffect(() => {

        dispatch(getUserDetails())

    }, [])

    return (
        <SnackbarProvider maxSnack={3}>
            {

                routing

            }
        </SnackbarProvider>)
}

export default App;
