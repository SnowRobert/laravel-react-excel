import { Card, Grid, Typography } from '@material-ui/core'
import React from 'react'
import { CircularProgressbar,buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useStyles } from './style'

export default function DataProgressRateCard (props) {

    const {color, value, dataType} = props;
    const classes = useStyles();
    return (

        <Card className={classes.root}>

            <Grid container>
                <Grid item xs={4} className={classes.progressBar}>
                    <CircularProgressbar 
                        value={value}
                        text={value + '%'}                        
                        styles={buildStyles({
                            
                            pathColor: color,
                            textColor: color,
                        })}
                    />
                </Grid>
                <Grid item xs={6} className={classes.infoContainer}>
                    
                    <Typography className={classes.header} > {dataType} </Typography>
                    <Typography className={classes.info}>Geçen Aya göre %{value} artış</Typography>

                </Grid>
            </Grid>

        </Card>
    )
    
}
