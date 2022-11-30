import { CircularProgress, Grid } from '@material-ui/core'
import React from 'react'

export default function ProgressBarSpinner () {
    
    return (
        <Grid 
            container
            direction="column"
            alignItems="center"
            justify="center"
        >

            <Grid item xs={12}>
                <CircularProgress size={28} color="secondary"/>
            </Grid>

        </Grid>
    )
}
