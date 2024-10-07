import React from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Inventory2Icon from '@mui/icons-material/Inventory2'; // Icon for ENTRADAS PT
import AgricultureIcon from '@mui/icons-material/Agriculture'; // Icon for ENTRADAS MP
import './modulosentradas.scss';

const ModulosEntradas: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="modulos-entradas-container">
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <IconButton
          onClick={() => navigate('/')}
          sx={{ alignSelf: 'flex-start', m: 1, color: '#46707e' }}
        >
          <ArrowBackIcon sx={{ fontSize: 40 }} />
        </IconButton>
        <Typography variant="h5" sx={{ mt: 3, mb: 2, textAlign: 'center' }}>
          SELECCIONA EL TIPO DE ENTRADA QUE QUIERES CONSULTAR
        </Typography>
        <Box className="button-container">
          <Button
            variant="contained"
            onClick={() => navigate('/EntradasPT')}
            sx={{
              m: 2,
              width: 250,
              height: 250,
              fontSize: '1rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              backgroundColor: '#46707e',
              '&:hover': {
                backgroundColor: '#3b5c6b',
              },
              '.MuiButton-startIcon': {
                fontSize: '4rem', // Adjust icon size here
                marginBottom: '16px' // Increased padding between the icon and the text
              }
            }}
          >
            <Inventory2Icon sx={{ fontSize: '4rem !important' }} />
            <Typography variant="body1" sx={{ 
              margin: 0,
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
              fontSize: '1.25rem',
              lineHeight: 1.6,
              letterSpacing: '0.0075em',
              marginTop: '16px' // Adding top margin as per your style request
            }}>
              ENTRADAS PT
            </Typography>
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/EntradasMP')}
            sx={{
              m: 2,
              width: 250,
              height: 250,
              fontSize: '1rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              backgroundColor: '#46707e',
              '&:hover': {
                backgroundColor: '#3b5c6b',
              },
              '.MuiButton-startIcon': {
                fontSize: '4rem', // Adjust icon size here
                marginBottom: '16px' // Increased padding between the icon and the text
              }
            }}
          >
            <AgricultureIcon sx={{ fontSize: '4rem !important' }} />
            <Typography variant="body1" sx={{ 
              margin: 0,
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
              fontSize: '1.25rem',
              lineHeight: 1.6,
              letterSpacing: '0.0075em',
              marginTop: '16px' // Adding top margin as per your style request
            }}>
              ENTRADAS MP
            </Typography>
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default ModulosEntradas;