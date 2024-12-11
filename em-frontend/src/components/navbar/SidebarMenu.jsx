import React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';

export const SidebarMenu = ({ menuItems }) => (
  <List>
    {menuItems.map((item) => (
      <ListItem key={item.text} disablePadding>
        <ListItemButton component="a" href={item.path}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItemButton>
      </ListItem>
    ))}
  </List>
);
