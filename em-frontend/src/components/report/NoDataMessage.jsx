import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

export const NoDataMessage = ({ message }) => (
  <Paper sx={{ p: 3, mt: 2 }}>
    <Box display="flex" justifyContent="center">
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  </Paper>
);