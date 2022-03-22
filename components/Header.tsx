import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

type Props = {
  message: string
}

export const Header = ({ message }: Props) => {
  return (
    <Box width='100%' position='fixed' sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box width='100%' sx={{ textAlign: 'center', fontSize: '1.3rem' }}>{message}</Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}