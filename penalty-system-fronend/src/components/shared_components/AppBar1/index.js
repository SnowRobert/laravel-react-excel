import React, { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import { useStyles } from './style';
import { Avatar, Button, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { SideMenuItems } from '../../data/sideMenuItems';
import { useNavigate } from 'react-router-dom';
import { AcUnitRounded, Close, Flare, Star, Stars } from '@material-ui/icons';
import DropDownMenu from './drop_down_menu'
import ActionMenu from './action_drop_down'
import { useDispatch, useSelector } from 'react-redux';
import { getAllMenus } from '../../../store/reducers/menu/menu.actions';
import { logOut } from '../../../store/reducers/auth/auth.actions';
import CategoryIcon from '@material-ui/icons/Category';


export default function PrimarySearchAppBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const authState = useSelector((state) => state.authReducer)
  const menuReducer = useSelector(state => state.menuReducer)
  const dispatch = useDispatch()

  const isLoggedIn = authState.authenticated;
  const loggedOutMenu = [
    {
        name:"Oturum Aç",
        url: "auth/login"
    },
    {
        name:"Kaydol",
        url: "auth/signup"
    },
  ];
  const loggedInMenu = [
    {
        name:"Profili Düzenle",
        url: "/profil/current-user",
        onclick: null,
    },
    {
        name:"Cıkış Yap",
        url: "",
        onclick:{handleLogout}
    },
  ];


  //adding menus from api

  if(Array.isArray(menuReducer.data)) {

    const icons = [
      <CategoryIcon />,
      <Star />,
      <Stars />,
      <Flare />,
      <AcUnitRounded />
    ]
    menuReducer.data.forEach((item)=>{

        const rand = Math.floor(Math.random() * icons.length)
        const menu = {
          item: item.name,
          url: '/otomatik/veri/'+item.id,
          icon: icons[rand]
        }
        if(!containsMenu(menu, SideMenuItems)) {
          SideMenuItems.push(menu)
        }
      }
    )    
  }


  useEffect(() => {
    
    dispatch(getAllMenus())
  }, [])


  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = (url) => {
    setAnchorEl(null);
    handleMobileMenuClose();
    if(url !== ''){
      navigate(url)
    }
  };

  function handleLogout(){
    
    setAnchorEl(null);
    handleMobileMenuClose();
    dispatch(logOut(navigate))
  }

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSideMenuNav = (url) => {
    navigate(url)
  }

  function containsMenu(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].item.trim().toLowerCase() === obj.item.trim().toLowerCase()) {
            return true;
        }
    }

    return false;
  }


  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={()=>handleMenuClose('')}
    >
      {
          isLoggedIn?
              loggedInMenu.map((item, index)=>(

                  <MenuItem key={index} onClick={item.onclick != null ?handleLogout:()=>handleMenuClose(item.url)}>{item.name}</MenuItem>
              ))
          :
              loggedOutMenu.map((item, index)=>(

                  <MenuItem key={index} value={item.url} onClick={()=>handleMenuClose(item.url)}>{item.name}</MenuItem>
              ))

      }
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          {("profile_img" in authState.data)?<Avatar src={authState.data.profile_img}/> :<AccountCircle />}
        </IconButton>
        <p>profil</p>
      </MenuItem>
    </Menu>
  );

  return (

    <>
        <div className={classes.grow}>
        <AppBar position="static" style={{background: "#fff", color: "#000", padding: '15px 0' }}>
            <Toolbar>
            <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
            >
                <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" noWrap>
                OGZ CEZA SISTEMI
            </Typography>
            <div className={classes.menu_items_container}>

                {SideMenuItems.map((item, index) => {
                    
                    if(index < 4) {
                        return (
                            <Button key={index} className={classes.button} href={item.url}  startIcon={item.icon}>
                                {item.item}
                            </Button>
                        )
                        
                    }else{
                      return (<span key={index}></span>)
                    }
                    
                  })
                    
                }

                <DropDownMenu menuItems={SideMenuItems.filter((item, index) => index >= 4)} />


            </div>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
                
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                {("profile_img" in authState.data)?<Avatar src={authState.data.profile_img}/> :<AccountCircle />}
                </IconButton>
            </div>
            <div className={classes.sectionMobile}>
                <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
                >
                <MoreIcon />
                </IconButton>
            </div>
            </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
        </div>
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>

            
            <div className={classes.list}>

                <Typography variant="h6" style={{fontSize: '18px'}} className={classes.sideMenuHeader}>
                    {"OGZ CEZA SISTEMI".toLowerCase()}
                    <IconButton onClick={toggleDrawer} className={classes.closeIcon} >
                        <Close />
                    </IconButton>
                </Typography>
                

            </div>
            <Divider  className={classes.divider} />
                
            <div className={classes.list}>
                <List>
                    {SideMenuItems.map((item, index) => (
                        <ListItem button key={index} onClick={()=>{handleSideMenuNav(item.url)}}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.item} />
                        </ListItem>
                        ))
                    }


                  <ActionMenu isNavBar={false}/>
                </List>
            </div>

        </Drawer>
    </>
  );
}
