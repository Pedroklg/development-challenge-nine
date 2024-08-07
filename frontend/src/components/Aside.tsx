import React, { useState } from 'react';
import { useMediaQuery, Theme, AppBar, Toolbar, IconButton, Typography, CssBaseline } from '@mui/material';
import { MenuOpen as MenuOpenIcon, Menu as MenuIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import DrawerList from './DrawerList';

const drawerWidth = 240;
const closedDrawerWidth = 60;

const Aside: React.FC = () => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const [isOpen, setIsOpen] = useState(!isMobile);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='flex'>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            aria-label="toggle drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ color: 'white' }}
          >
            {isOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
          <Typography component={Link} to={"/"} sx={{ ml: (!isMobile) ? (isOpen ? 25 : 5) : 0 }}>
            <img src="logoMedcloud.svg" alt="Medcloud" className='h-20 p-4' />
          </Typography>
        </Toolbar>
      </AppBar>
      <DrawerList
        isOpen={isOpen}
        isMobile={isMobile}
        drawerWidth={drawerWidth}
        closedDrawerWidth={closedDrawerWidth}
        handleDrawerClose={toggleDrawer}
      />
    </div>
  );
};

export default Aside;