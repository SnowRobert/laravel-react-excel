import { Avatar, Grid, Typography } from '@material-ui/core'
import React from 'react'
import NotFoundImage from '../../images/404.jpg'
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({

    root: {
        marginTop: '10%',
    },
    avatar: {
        width: theme.spacing(20),
        height: theme.spacing(20),
    },
    title: {
        textAlign: 'center',
    }
}))

export default (props) => {
    const classes = useStyles();

    return (

        <div>

            <Grid
                container            
                direction="column"
                alignItems="center"
                justify="center"
            >
                <Grid item xs={4} className={classes.root} >
                    <Avatar src={NotFoundImage} alt="page not found" className={classes.avatar} />
                    <Typography variant="h4" className={classes.title}>404</Typography>
                    <Typography variant="h6" className={classes.title}>Page Not Found</Typography>
                </Grid>
            </Grid>

        </div>

    );
}
