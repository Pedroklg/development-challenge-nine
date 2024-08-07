import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, Box, Tooltip, Divider } from '@mui/material';
import { Home as HomeIcon, FormatListBulleted as FormatListBulletedIcon, Create as CreateIcon, EditNote as EditNoteIcon } from '@mui/icons-material';
import { palette } from '../theme';

const { medDarkCyan } = palette;

interface DrawerListProps {
  isOpen: boolean;
  isMobile: boolean;
  drawerWidth: number;
  closedDrawerWidth: number;
  handleDrawerClose?: () => void;
}

const DrawerList: React.FC<DrawerListProps> = ({ isOpen, isMobile, drawerWidth, closedDrawerWidth, handleDrawerClose }) => {
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
      case '/patients/edit/':
        setSelected('Edit');
        break;
      default:
        setSelected('/');
    }
  }, [location]);

  return (
    <Drawer
      variant={!isMobile ? 'permanent' : (isOpen ? 'temporary' : 'permanent')}
      open={isOpen}
      onClose={handleDrawerClose}
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
      <Box
        sx={{ width: isOpen ? drawerWidth : closedDrawerWidth }}
        role="navigation"
      >
        <Divider />
        <List>
          <Tooltip title="Início" placement="right" arrow>
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
              {isOpen && <ListItemText primary="Início" sx={{ ml: 2 }} />}
            </ListItem>
          </Tooltip>
          <Tooltip title="Lista de Pacientes" placement="right" arrow>
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
              {isOpen && <ListItemText primary="Lista de Pacientes" sx={{ ml: 2 }} />}
            </ListItem>
          </Tooltip>
          <Tooltip title="Criar Pacientes" placement="right" arrow>
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
              {isOpen && <ListItemText primary="Criar Paciente" sx={{ ml: 2 }} />}
            </ListItem>
          </Tooltip>
          <Tooltip title="Editar Pacientes" placement="right" arrow>
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
              {isOpen && <ListItemText primary="Editar Paciente" sx={{ ml: 2 }} />}
            </ListItem>
          </Tooltip>
        </List>
      </Box>
    </Drawer>
  );
};

export default DrawerList;