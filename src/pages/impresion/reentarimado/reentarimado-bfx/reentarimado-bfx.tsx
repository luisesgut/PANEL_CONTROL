import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Modal, Paper } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import './reentarimado-bfx.scss';

const ReentarimadoBFX: React.FC = () => {
  const [rfidInput, setRfidInput] = useState(''); // Campo para el RFID completo
  const [tarimaData, setTarimaData] = useState<any>(null); // Datos de la tarima
  const [openModal, setOpenModal] = useState(false); // Control para mostrar/ocultar el modal

  // Función para obtener los datos de la tarima usando el RFID completo ingresado
  const fetchTarimaData = async () => {
    try {
      const response = await axios.get(`http://172.16.10.31/api/RfidLabel/GetLabelByTraceabilityCode/${rfidInput}`);
      if (response.data) {
        setTarimaData(response.data);
        setOpenModal(true);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se encontró ninguna tarima con ese RFID.',
        });
      }
    } catch (error) {
      console.error('Error fetching tarima data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al obtener los datos de la tarima.',
      });
    }
  };

  // Función para confirmar y generar las dos etiquetas
  const handleConfirm = () => {
    setOpenModal(false);
    generateEtiquetas();
  };

  // Función para generar dos etiquetas usando la lógica existente
  const generateEtiquetas = () => {
    for (let i = 0; i < 2; i++) {
      const data = {
        area: tarimaData.area,
        claveProducto: tarimaData.claveProducto,
        nombreProducto: tarimaData.nombreProducto,
        claveOperador: tarimaData.claveOperador,
        operador: tarimaData.operador,
        turno: tarimaData.turno,
        pesoTarima: tarimaData.pesoTarima,
        pesoBruto: tarimaData.pesoBruto,
        pesoNeto: tarimaData.pesoNeto,
        piezas: tarimaData.piezas,
        trazabilidad: tarimaData.trazabilidad,
        orden: tarimaData.orden,
        rfid: tarimaData.rfid,
        uom: tarimaData.uom,
        fecha: tarimaData.fecha,
      };

      axios.post('http://172.16.10.31/api/generarEtiqueta', data)
        .then(response => {
          if (i === 1) { // Mostrar el mensaje solo después de la segunda etiqueta
            Swal.fire({
              icon: 'success',
              title: 'Etiquetas Generadas',
              text: 'Se generaron las dos etiquetas correctamente.',
            });
          }
        })
        .catch(error => {
          console.error('Error generando etiqueta:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al generar una de las etiquetas.',
          });
        });
    }
  };

  return (
    <Box className="reentarimado-container-bfx">
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Reentarimado - Generación de Etiquetas
      </Typography>
      <TextField
        label="Código RFID Completo"
        fullWidth
        value={rfidInput}
        onChange={(e) => setRfidInput(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <Button
        variant="contained"
        className="search-button"
        onClick={fetchTarimaData}
      >
        Buscar Tarima
      </Button>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Paper className="reentarimado-modal-content">
          <Box className="reentarimado-modal-header">
            <Typography variant="h6">Información de la Tarima</Typography>
            <Button onClick={() => setOpenModal(false)}>Cerrar</Button>
          </Box>
          <Box className="reentarimado-modal-body">
            {tarimaData && (
              <>
                <Typography><strong>Área:</strong> {tarimaData.area}</Typography>
                <Typography><strong>Orden:</strong> {tarimaData.orden}</Typography>
                <Typography><strong>Producto:</strong> {tarimaData.nombreProducto}</Typography>
                <Typography><strong>Máquina:</strong> {tarimaData.maquina}</Typography>
                <Typography><strong>Turno:</strong> {tarimaData.turno}</Typography>
                <Typography><strong>Operador:</strong> {tarimaData.operador}</Typography>
                <Typography><strong>Peso Bruto:</strong> {tarimaData.pesoBruto} kg</Typography>
                <Typography><strong>Peso Neto:</strong> {tarimaData.pesoNeto} kg</Typography>
                <Typography><strong>Piezas:</strong> {tarimaData.piezas}</Typography>
              </>
            )}
          </Box>
          <Box className="reentarimado-modal-footer">
            <Button
              variant="contained"
              color="success"
              className="reentarimado-generate-button"
              onClick={handleConfirm}
            >
              Confirmar y Generar Etiquetas
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};

export default ReentarimadoBFX;
