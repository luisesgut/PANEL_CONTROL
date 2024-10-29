import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import Swal from 'sweetalert2';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './configuracionalmacen.scss';

interface Settings {
  dbm: string;
  rxSensitivity: string;
}

interface AntennaConfig {
  txPower: number;
  rxSensitivity: number;
}

const API_BASE_URL = 'http://localhost:5239/api/EntradaPT';

const generateDbmOptions = () => {
  const options = [];
  for (let i = 10; i <= 30; i += 0.25) {
    options.push(i.toFixed(2)); // Redondear a dos decimales
  }
  return options;
};

const generateRxSensitivityOptions = () => {
  const options = [];
  for (let i = -30; i >= -80; i--) {
    options.push(i.toString());
  }
  return options;
};

const ConfiguracionAlmacen: React.FC = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [isSettingsSaved, setIsSettingsSaved] = useState(false);
  const [ptSettings, setPtSettings] = useState<Settings>({ dbm: '', rxSensitivity: '' });
  const [antennaConfig, setAntennaConfig] = useState<AntennaConfig | null>(null);

  const handleStartConnection = async () => {
    try {
      await axios.post(`${API_BASE_URL}/connect`);
      setIsConnected(true);
      Swal.fire('Conectado', 'Antena Entrada PT conectada exitosamente', 'info');
      fetchAntennaConfig();
    } catch (error: any) {
      Swal.fire('Error', `Error al conectar: ${error.message}`, 'error');
    }
  };

  const fetchAntennaConfig = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/verify-settings`);
      const [firstConfig] = response.data;
      setAntennaConfig(firstConfig);
    } catch (error: any) {
      Swal.fire('Error', `Error al obtener configuración: ${error.message}`, 'error');
    }
  };

  const handleSaveSettings = async () => {
    try {
      const { dbm, rxSensitivity } = ptSettings;
      await axios.post(`${API_BASE_URL}/configurar-antenas`, {
        TxPower: parseFloat(dbm),
        RxSensitivity: parseFloat(rxSensitivity),
      });
      setIsSettingsSaved(true);
      Swal.fire('Guardado', 'Ajustes guardados correctamente', 'success');
      fetchAntennaConfig(); // Llamar verify-settings después de guardar
    } catch (error: any) {
      Swal.fire('Error', `Error al guardar ajustes: ${error.message}`, 'error');
    }
  };

  const handleStartScan = async () => {
    try {
      await axios.post(`${API_BASE_URL}/start-reading`);
      Swal.fire('Escaneo iniciado', 'Se ha iniciado el escaneo en Antena Entrada PT', 'info');
    } catch (error: any) {
      Swal.fire('Error', `Error al iniciar escaneo: ${error.message}`, 'error');
    }
  };

  const handleStopScan = async () => {
    try {
      await axios.post(`${API_BASE_URL}/stop-reading`);
      Swal.fire('Escaneo detenido', 'Se ha detenido el escaneo en Antena Entrada PT', 'info');
    } catch (error: any) {
      Swal.fire('Error', `Error al detener escaneo: ${error.message}`, 'error');
    }
  };

  const handleForceDisconnect = async () => {
    try {
      await axios.post(`${API_BASE_URL}/force-disconnect`);
      setIsConnected(false);
      setIsSettingsSaved(false);
      setPtSettings({ dbm: '', rxSensitivity: '' });
      setAntennaConfig(null); // Reiniciar la configuración de la antena
      Swal.fire('Desconectado', 'La antena ha sido desconectada forzosamente', 'info');
    } catch (error: any) {
      Swal.fire('Error', `Error al desconectar: ${error.message}`, 'error');
    }
  };

  return (
    <div className="configuracion-embarques">
      <IconButton className="back-button" onClick={() => navigate(-1)}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h4" align="center" gutterBottom>
        Configuración Almacén
      </Typography>

      <Card sx={{ marginBottom: 4, padding: 2, backgroundColor: '#f5f5f5' }}>
        <CardContent>
          <Typography variant="h6" align="center" gutterBottom>
            Antena Entrada PT
          </Typography>
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleStartConnection}
                disabled={isConnected}
              >
                Conectar
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="success"
                fullWidth
                onClick={handleStartScan}
                disabled={!isSettingsSaved}
              >
                Iniciar Escaneo
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                sx={{ backgroundColor: 'red', '&:hover': { backgroundColor: '#cc0000' } }}
                fullWidth
                onClick={handleStopScan}
                disabled={!isSettingsSaved}
              >
                Detener Escaneo
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>DBM</InputLabel>
                <Select
                  value={ptSettings.dbm}
                  onChange={(e) => setPtSettings((prev) => ({ ...prev, dbm: e.target.value }))}
                  disabled={!isConnected}
                >
                  {generateDbmOptions().map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>RX Sensibility</InputLabel>
                <Select
                  value={ptSettings.rxSensitivity}
                  onChange={(e) =>
                    setPtSettings((prev) => ({ ...prev, rxSensitivity: e.target.value }))
                  }
                  disabled={!isConnected}
                >
                  {generateRxSensitivityOptions().map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#46707e', '&:hover': { backgroundColor: '#3b5c6b' } }}
                fullWidth
                onClick={handleSaveSettings}
                disabled={!isConnected}
              >
                Guardar Ajustes
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {antennaConfig && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Configuración Actual de Antenas:
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Tx Power (dBm)</TableCell>
                  <TableCell align="center">Rx Sensibility (dBm)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center">{antennaConfig.txPower}</TableCell>
                  <TableCell align="center">{antennaConfig.rxSensitivity}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <Box sx={{ marginTop: 4 }}>
        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={handleForceDisconnect}
          disabled={!isConnected}
        >
          Desconectar Forzosamente
        </Button>
      </Box>
    </div>
  );
};

export default ConfiguracionAlmacen;
