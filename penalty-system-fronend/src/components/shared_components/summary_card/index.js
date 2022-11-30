import { Divider, Grid, Typography } from '@material-ui/core';
import React from 'react'
import { Card,IconBox, useStyles,NumberHeader } from './style';
import { Link } from 'react-router-dom';

export default function SummaryCard (props) {
    
    const classes = useStyles();
    const { color,title,value,url, icon } = props;

    return (

        <Grid 
            className={classes.root}
            item md={3} sm={12} xs={12}
        >

            <Card variant="outlined" className={classes.card} style={{backgroundColor: color,}}>

                <Grid
                    container            
                    direction="column"
                    alignItems="center"
                    justify="center"
                >

                    <Grid item xs={12}>

                        <IconBox>

                            <div className={classes.icons} >
                                {icon}
                            </div>
                        </IconBox>
                        
                    </Grid>
                    <Grid item xs={12}>
                        <NumberHeader variant="h4" >
                            {value}
                        </NumberHeader>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6"  className={classes.title}>
                            {title}
                        </Typography>
                    </Grid>

                </Grid>

                <Divider className={classes.divider} />
                <Link to={url} className={classes.link}>daha fazla göster</Link>
            </Card>
        </Grid>

    );

}
