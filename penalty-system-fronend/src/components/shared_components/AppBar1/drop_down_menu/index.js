import React from 'react';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { StyledMenu,StyledMenuItem,MoreButton } from './style'
import { ExpandMore } from '@material-ui/icons';
import { useStyles } from './style'
import { useNavigate } from 'react-router-dom';
import ActionMenu from '../action_drop_down'


export default function CustomizedMenus(props) {

  const { menuItems } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles()
  const navigate = useNavigate()
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClick = (url) => {
    handleClose()
    navigate(url)
  }
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <MoreButton
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        onClick={handleClick}
        className={classes.btn}
        startIcon={<ExpandMore />}

      >
        Daha Fazla Sayfa
      </MoreButton>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >


          {

            menuItems.map((item, index)=>(
              <StyledMenuItem onClick={()=>{handleMenuClick(item.url)}} key={index} >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.item} />
              </StyledMenuItem>

            ))

          }


          <ActionMenu isNavBar={true}/>
      </StyledMenu>
    </>
  );
}
