import React from 'react';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import { StyledMenu,StyledMenuItem,MoreButton } from '../drop_down_menu/style'
// import { ExpandMore, FileCopy, Print } from '@material-ui/icons';
import { useStyles } from '../drop_down_menu/style'
// import { useNavigate } from 'react-router-dom';
// import { ListItem } from '@material-ui/core';
import PdfModal from '../../PdfModal'
// import PrintDataModal from '../../PrintDataModal'


export default function ActionMenus(props) {

  const { isNavBar } = props;
  const classes = useStyles()

  return (
    <>
      
        <PdfModal isNavBar={isNavBar}/>
    </>
  );
  
}
