import * as React from 'react';
import { Box, Grid, Typography, IconButton, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessIcon from '@mui/icons-material/Business';
import { Link } from 'react-router-dom';
import './modulosimpresion.scss';

const ImpresionModules = [
  { icon: <BusinessIcon sx={{ fontSize: 60 }} />, label: 'IMPRESION MATERIA PRIMA', path: '/ImpresionMP' },
  { icon: <BusinessIcon sx={{ fontSize: 60 }} />, label: 'IMPRESION PT', path: '/ImpresionPT' },
  { icon: <BusinessIcon sx={{ fontSize: 60 }} />, label: 'REENTARIMADO MP', path: '/ReentarimadoMP' },
  { icon: <BusinessIcon sx={{ fontSize: 60 }} />, label: 'REENTARIMADO PT', path: '/ReentarimadoPT' },
];

const ModulosImpresion: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className='modulos-impresion'>
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
            SELECCIONA EL FORMATO DE ETIQUETA QUE REQUIERES IMPRIMIR DE PRODUCTO TERMINADO
          </Typography>
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <Grid container spacing={4} justifyContent="center">
          {ImpresionModules.map((item, index) => (
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

export default ModulosImpresion;
