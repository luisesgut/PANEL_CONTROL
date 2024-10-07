import React, { useState } from 'react';
import { TextField, Button, Box, Grid, Typography, IconButton } from '@mui/material';
import Swal from 'sweetalert2';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import './configuracionembarques.scss';

const ConfiguracionEmbarques: React.FC = () => {
  const [antena1Settings, setAntena1Settings] = useState({ dbm: '', rxSensitivity: '' });
  const [antena2Settings, setAntena2Settings] = useState({ dbm: '', rxSensitivity: '' });
  const [antena3Settings, setAntena3Settings] = useState({ dbm: '', rxSensitivity: '' });
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setSettings: React.Dispatch<React.SetStateAction<any>>
  ) => {
    setSettings((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveSettings = (antena: string, settings: any) => {
    console.log(`Guardando ajustes para ${antena}:`, settings);
    Swal.fire('Guardado', `Ajustes de ${antena} guardados correctamente`, 'success');
  };

  const handleStartScan = (antena: string) => {
    Swal.fire('Escaneo iniciado', `Se ha iniciado el escaneo en ${antena}`, 'info');
  };

  const handleStopScan = (antena: string) => {
    Swal.fire('Escaneo detenido', `Se ha detenido el escaneo en ${antena}`, 'info');
  };

  return (
    <div className="configuracion-embarques">
      <IconButton className="back-button" onClick={() => navigate(-1)}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h4" className="title">Configuración Embarques</Typography>

      {/* Antena 1 */}
      <Box className="antena-section">
        <Typography variant="h6">Antena 1</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="success" onClick={() => handleStartScan('Antena 1')}>Iniciar Escaneo</Button>
          </Grid>
          <Grid item xs={12} sm={6}>
          <Button variant="contained" sx={{ backgroundColor: 'red', '&:hover': { backgroundColor: '#cc0000' } }} onClick={() => handleStopScan('Antena 3')}>Detener Escaneo</Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="DBM"
              name="dbm"
              value={antena1Settings.dbm}
              onChange={(e) => handleInputChange(e, setAntena1Settings)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="RX Sensibility"
              name="rxSensitivity"
              value={antena1Settings.rxSensitivity}
              onChange={(e) => handleInputChange(e, setAntena1Settings)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
          <Button variant="contained"sx={{ backgroundColor: '#46707e', '&:hover': { backgroundColor: '#3b5c6b' } }} onClick={() => handleSaveSettings('Antena 3', antena3Settings)}>Guardar Ajustes</Button>
          </Grid>
        </Grid>
      </Box>

      {/* Antena 2 */}
      <Box className="antena-section">
        <Typography variant="h6">Antena 2</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="success" onClick={() => handleStartScan('Antena 2')}>Iniciar Escaneo</Button>
          </Grid>
          <Grid item xs={12} sm={6}>
          <Button variant="contained" sx={{ backgroundColor: 'red', '&:hover': { backgroundColor: '#cc0000' } }} onClick={() => handleStopScan('Antena 3')}>Detener Escaneo</Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="DBM"
              name="dbm"
              value={antena2Settings.dbm}
              onChange={(e) => handleInputChange(e, setAntena2Settings)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="RX Sensibility"
              name="rxSensitivity"
              value={antena2Settings.rxSensitivity}
              onChange={(e) => handleInputChange(e, setAntena2Settings)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
          <Button variant="contained"sx={{ backgroundColor: '#46707e', '&:hover': { backgroundColor: '#3b5c6b' } }} onClick={() => handleSaveSettings('Antena 3', antena3Settings)}>Guardar Ajustes</Button>
          </Grid>
        </Grid>
      </Box>

      {/* Antena 3 */}
      <Box className="antena-section">
        <Typography variant="h6">Antena 3</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="success" onClick={() => handleStartScan('Antena 3')}>Iniciar Escaneo</Button>
          </Grid>
          <Grid item xs={12} sm={6}>
          <Button variant="contained" sx={{ backgroundColor: 'red', '&:hover': { backgroundColor: '#cc0000' } }} onClick={() => handleStopScan('Antena 3')}>Detener Escaneo</Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="DBM"
              name="dbm"
              value={antena3Settings.dbm}
              onChange={(e) => handleInputChange(e, setAntena3Settings)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="RX Sensibility"
              name="rxSensitivity"
              value={antena3Settings.rxSensitivity}
              onChange={(e) => handleInputChange(e, setAntena3Settings)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
          <Button variant="contained"sx={{ backgroundColor: '#46707e', '&:hover': { backgroundColor: '#3b5c6b' } }} onClick={() => handleSaveSettings('Antena 3', antena3Settings)}>Guardar Ajustes</Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default ConfiguracionEmbarques;