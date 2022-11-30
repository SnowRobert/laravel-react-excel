
import React, {useEffect,useState} from 'react'
import { Outlet } from 'react-router';

import AppBar from '../../shared_components/AppBar1';
import { useStyles } from './style'
import { useDispatch } from 'react-redux';
import { getUserDetails } from '../../../store/reducers/auth/auth.actions'
import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { useSnackbar } from 'notistack';

export default function Home(props) {

    const [status, setStatus] = useState(true);
    const classes = useStyles()
    const dispatch = useDispatch()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(() => {
        
        dispatch(getUserDetails())

    }, [''])



    
  useEffect(() => {
    if(status === false){
      showSnackBar("No internet Connection", 'error')
    }
  }, [status])

  useEffect(() => {
    function changeStatus() {
      setStatus(navigator.onLine);
    }
    window.addEventListener("online", changeStatus);
    window.addEventListener("offline", changeStatus);
    return () => {
      window.removeEventListener("online", changeStatus);
      window.removeEventListener("offline", changeStatus);
    };
  }, []);

  function showSnackBar(msg, variant = 'info'){
      enqueueSnackbar(msg, {
          variant: variant,            
          action: (key) => (
              <IconButton style={{color: '#fff'}} size="small" onClick={() => closeSnackbar(key)}>
                  <Close />
              </IconButton>
          ),
      })
  }
    
    return (
        <>

            <AppBar />

            <div className={classes.root}>
                
                <Outlet /> 

            </div>
            {/* <SideMenu body={ <Outlet /> }/> */}
            
            
        </>
    )
}
