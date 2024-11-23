import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Button } from '@mui/material';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import '../styles.css';
import successAnimation from '../animations/okey.lottie';

const fontFamily = {
  fontFamily: 'Josefin Sans, sans-serif',
};

const SuccessMessage = () => {
  const navigate = useNavigate();
  const dotLottieRef = useRef(null);



  return (
    <div className='animated-background' style={{ padding: '0 15%', background: '#664f74' }}>
      <div className="container" style={{ background: '#f1e9cb' }}>
        <Grid
          container
          spacing={0}
          style={{
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f1e9cb',
          }}
        >
          <Grid item xs={12} container justifyContent="center" alignItems="center" paddingTop='10%'>
            <DotLottieReact
              src={successAnimation}
              loop={false}
              autoplay
              dotLottieRefCallback={dotLottieRef}
              style={{ height: '350px', width: '350px' }}
            />
          </Grid>
          <Grid item xs={12} container direction="column" alignItems="center" textAlign="center" height='50vh'>
            <Typography variant="h4" sx={{ ...fontFamily, fontSize: '4rem', marginBottom:'10%' }}>
              ¡Registro exitoso!
            </Typography>
            <Button variant="contained" sx={{ ...fontFamily, fontSize: '1rem' }} onClick={() => navigate('/register')}>
              Volver
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default SuccessMessage;
