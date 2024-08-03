import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, IconButton, Box, useMediaQuery, Theme, Toolbar, AppBar, CssBaseline, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import { palette } from '../theme';

const { medDarkCyan } = palette;

const drawerWidth = 240;

const Aside: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const [isOpen, setIsOpen] = useState(!isMobile);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const list = () => (
    <Box
      sx={{ width: drawerWidth, mt: "4rem" }}
      role="presentation"
      onClick={isMobile ? toggleDrawer : undefined}
      onKeyDown={isMobile ? toggleDrawer : undefined}
    >
      <List>
        <ListItem component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem component={Link} to="/patients">
          <ListItemText primary="Patient List" />
        </ListItem>
        <ListItem component={Link} to="/patients/new">
          <ListItemText primary="Patient Form" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div className='flex'>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap>
            My Application
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isOpen}
        onClose={toggleDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
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
