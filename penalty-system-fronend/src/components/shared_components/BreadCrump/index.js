import React from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import { useStyles } from './style';

function handleClick(event) {
  event.preventDefault();
}

export default function Breadcrumb(props) {

    const classes = useStyles();
    const { links } = props;


  return (
    <Breadcrumbs aria-label="breadcrumb" className={classes.breadCrump} >

      
      {
        
        links.map((item, index)=>{

          if(index === (links.length - 1)){
            return (
              <Link
                color="textPrimary"
                href={item.url}
                onClick={handleClick}
                aria-current="page"
                key={index}
              >
                {item.name}
              </Link>
            )
          }
          return (
            <Link color="inherit" href={item.url} key={index}>
              {item.name}
            </Link>
          )
          
        })

      }
      
      
    </Breadcrumbs>
  );
}
