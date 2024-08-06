import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, IconButton, Box, useMediaQuery, Theme, Toolbar, AppBar, CssBaseline, Typography, Tooltip, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import MenuIcon from '@mui/icons-material/Menu';
import CreateIcon from '@mui/icons-material/Create';
import EditNoteIcon from '@mui/icons-material/EditNote';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { palette } from '../theme';

const { medDarkCyan } = palette;

const drawerWidth = 240;
const closedDrawerWidth = 60;

const Aside: React.FC = () => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const [isOpen, setIsOpen] = useState(!isMobile);
  const location = useLocation();
  const [selected, setSelected] = useState(location.pathname);

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setSelected('Home');
        break;
      case '/patients':
        setSelected('List');
        break;
      case '/patients/new':
        setSelected('Create');
        break;
      case '/patients/edit':
        setSelected('Edit');
        break;
      default:
        setSelected('/');
    }
  }, [location]);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const list = () => (
    <Box
      sx={{ width: isOpen ? drawerWidth : closedDrawerWidth }}
      role="navigation"
    >
      <Divider />
      <List>
        <Tooltip title="Home" placement="right" arrow>
          <ListItem
            component={Link}
            to="/"
            sx={{
              bgcolor: selected === 'Home' ? medDarkCyan : 'white',
              color: selected === 'Home' ? 'white' : medDarkCyan,
              justifyContent: isOpen ? 'initial' : 'center',
              px: 2.5,
              my: 4,
            }}
          >
            <HomeIcon />
            {isOpen && <ListItemText primary="Home" sx={{ ml: 2 }} />}
          </ListItem>
        </Tooltip>
        <Tooltip title="Patient List" placement="right" arrow>
          <ListItem
            component={Link}
            to="/patients"
            sx={{
              bgcolor: selected === 'List' ? medDarkCyan : 'white',
              color: selected === 'List' ? 'white' : medDarkCyan,
              justifyContent: isOpen ? 'initial' : 'center',
              px: 2.5,
              my: 4,
            }}
          >
            <FormatListBulletedIcon />
            {isOpen && <ListItemText primary="Patient List" sx={{ ml: 2 }} />}
          </ListItem>
        </Tooltip>
        <Tooltip title="Create Patient" placement="right" arrow>
          <ListItem
            component={Link}
            to="/patients/new"
            sx={{
              bgcolor: selected === 'Create' ? medDarkCyan : 'white',
              color: selected === 'Create' ? 'white' : medDarkCyan,
              justifyContent: isOpen ? 'initial' : 'center',
              px: 2.5,
              my: 4,
            }}
          >
            <CreateIcon />
            {isOpen && <ListItemText primary="Create Patient" sx={{ ml: 2 }} />}
          </ListItem>
        </Tooltip>
        <Tooltip title="Edit Patient" placement="right" arrow>
          <ListItem
            component={Link}
            to="/patients/edit/"
            sx={{
              bgcolor: selected === 'Edit' ? medDarkCyan : 'white',
              color: selected === 'Edit' ? 'white' : medDarkCyan,
              justifyContent: isOpen ? 'initial' : 'center',
              px: 2.5,
              my: 4,
            }}
          >
            <EditNoteIcon />
            {isOpen && <ListItemText primary="Edit Patient" sx={{ ml: 2 }} />}
          </ListItem>
        </Tooltip>
      </List>
    </Box>
  );

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
          <Typography component={Link} to={"/"} sx={{ ml: (!isMobile) ? (isOpen ? 25 : 5) : '' }}>
          {/* <img src="logoMedcloud.svg" alt="Medcloud" className='h-20 p-4' /> */}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={!isMobile ? 'permanent' : (isOpen ? 'temporary' : 'permanent')}
        open={isOpen}
        sx={{
          width: isOpen ? drawerWidth : closedDrawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: isOpen ? drawerWidth : closedDrawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'white',
            overflow: 'hidden',
            color: medDarkCyan,
            mt: 6,
          },
        }}
      >
        {list()}
      </Drawer>
    </div>
  );
};

export default Aside;
