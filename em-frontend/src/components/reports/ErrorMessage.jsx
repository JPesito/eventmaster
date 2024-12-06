import React from 'react';
import { Box, Typography } from '@mui/material';

const ErrorMessage = ({ message }) => {
  return (
    <Box sx={{ textAlign: 'center', marginTop: 4 }}>
      <Typography variant="h6" sx={{ color: 'red' }}>
        {message}
      </Typography>
    </Box>
  );
};

export default ErrorMessage;
