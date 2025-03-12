import React from "react";
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Divider 
} from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import DoorFrontIcon from "@mui/icons-material/DoorFront";
import WindowIcon from "@mui/icons-material/Window";

const ItemInfo = ({ selectedItem, selectedItemType }) => {
  if (!selectedItem) {
    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>Selected Item Information</Typography>
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="body1">Select a room, door, or window to view details</Typography>
        </Paper>
      </Box>
    );
  }

  const getIcon = () => {
    switch(selectedItemType) {
      case 'room':
        return <RoomIcon />;
      case 'door':
        return <DoorFrontIcon />;
      case 'window':
        return <WindowIcon />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>Selected Item Information</Typography>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {getIcon()}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {selectedItemType.charAt(0).toUpperCase() + selectedItemType.slice(1)}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        <List dense disablePadding>
          {selectedItemType === 'room' && (
            <>
              <ListItem>
                <ListItemText primary="Name" secondary={selectedItem.name} />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Dimensions" 
                  secondary={`${selectedItem.width}x${selectedItem.length}`} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Position" 
                  secondary={`(${Math.round(selectedItem.x)}, ${Math.round(selectedItem.y)})`} 
                />
              </ListItem>
            </>
          )}
          
          {(selectedItemType === 'door' || selectedItemType === 'window') && (
            <>
              <ListItem>
                <ListItemText primary="Position" secondary={selectedItem.position} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Offset" secondary={Math.round(selectedItem.offset)} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Width" secondary={Math.round(selectedItem.width)} />
              </ListItem>
            </>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default ItemInfo;
