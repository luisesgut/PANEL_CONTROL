import * as React from 'react';
import { Box, Grid, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InputIcon from '@mui/icons-material/Input';
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';
import { Link } from 'react-router-dom';
import './modulosantenas.scss';

const AntenaModules = [
  { icon: <InputIcon sx={{ fontSize: 60 }} />, label: 'ENTRADA PRODUCCIÓN', path: '/EntradaProduccion' },
  { icon: <StoreMallDirectoryIcon sx={{ fontSize: 60 }} />, label: 'SALIDA ALMACÉN', path: '/SalidaAlmacen' },
  { icon: <LocalShippingIcon sx={{ fontSize: 60 }} />, label: 'EMBARQUES', path: '/Embarques' },
];

const ModulosAntenas: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className='modulos-antenas'>
      <Box sx={{ width: '100%', p: 1, position: 'relative' }}>
        <IconButton
          onClick={() => navigate('/')}
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 10
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 40, color: '#46707e' }} />
        </IconButton>
        <Box sx={{ pt: 3, width: '100%', textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mt: 3 }}>
            SELECCIONA LA ACCIÓN QUE DESEAS REALIZAR
          </Typography>
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <Grid container spacing={4} justifyContent="center">
          {AntenaModules.map((item, index) => (
            <Grid item key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Link to={item.path} style={{ textDecoration: 'none' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 250,
                    width: 250,
                    backgroundColor: '#46707e',
                    borderRadius: 2,
                    boxShadow: 3,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#3b5c6b',
                    },
                    mx: 2,
                  }}
                >
                  {item.icon}
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {item.label}
                  </Typography>
                </Box>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default ModulosAntenas;