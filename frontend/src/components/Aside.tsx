import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, IconButton, Box, useMediaQuery, Theme, Toolbar, AppBar, CssBaseline, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import MenuIcon from '@mui/icons-material/Menu';
import CreateIcon from '@mui/icons-material/Create';
import CloseIcon from '@mui/icons-material/Close';
import { palette } from '../theme';

const { medDarkCyan } = palette;

const drawerWidth = 240;

const Aside: React.FC = () => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const [isOpen, setIsOpen] = useState(!isMobile);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const list = () => (
    <Box
      sx={{ width: drawerWidth }}
      role="navigation"
      onClick={isMobile ? toggleDrawer : undefined}
      onKeyDown={isMobile ? toggleDrawer : undefined}
    >

      <Typography component={Link} to={"/"}>
        <img src="logoMedcloud.svg" alt="Medcloud" className='h-20 p-4 mb-5' />
      </Typography>

      <List>
        <ListItem component={Link} to="/">
          <HomeIcon />
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem component={Link} to="/patients">
          <FormatListBulletedIcon />
          <ListItemText primary="Patient List" />
        </ListItem>
        <ListItem component={Link} to="/patients/new">
          <CreateIcon />
          <ListItemText primary="Patient Form" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div className='flex'>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          {isMobile && (
            <IconButton
              aria-label="open drawer"
              onClick={toggleDrawer}
              edge="start"
              sx={{ color: 'white' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isOpen}
        onClose={toggleDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]:
            { width: drawerWidth, boxSizing: 'border-box', bgcolor: 'white', overflow: 'hidden', color: medDarkCyan },
        }}
      >
        {isMobile && (
          <IconButton onClick={toggleDrawer} edge="start">
            <CloseIcon />
          </IconButton>
        )}
        {list()}
      </Drawer>
    </div>
  );
};

export default Aside;
