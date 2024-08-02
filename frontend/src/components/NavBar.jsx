import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';

const NavBar = () => {
  return (
    <Drawer variant="permanent" anchor="left" className="w-64 flex-shrink-0">
      <div className="flex flex-col h-full">
        <List>
          <ListItem component={Link} to="/">
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem component={Link} to="/Patients">
            <ListItemText primary="Patient List" />
          </ListItem>
          <ListItem component={Link} to="/PatientsForm">
            <ListItemText primary="Patient Form" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default NavBar;