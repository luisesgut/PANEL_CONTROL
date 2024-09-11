import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Button, Modal, TextField, Grid, Autocomplete } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DataGrid, GridToolbar, GridColumnVisibilityModel } from '@mui/x-data-grid';
import './registroinsumos.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importamos axios
import Swal from 'sweetalert2'; // Importamos SweetAlert2 para alertas

// Definir una interfaz para los registros
interface RegistroInsumo {
  id: number;
  fechaCambio: string;
  insumo: string;
  operador: string;
  impresora: string;
}

const RegistroInsumos: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [date, setDate] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedPrinter, setSelectedPrinter] = useState('');
  const [operator, setOperator] = useState('');
  const [records, setRecords] = useState<RegistroInsumo[]>([]); // Actualizar el tipo del estado `records`
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({});
  const navigate = useNavigate();

  // Cargar registros de insumos desde el backend
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get<RegistroInsumo[]>('http://172.16.10.31/api/RegistroInsumos');
        setRecords(response.data);
      } catch (error) {
        console.error('Error al cargar los registros de insumos:', error);
      }
    };

    fetchRecords();
  }, []);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  const handleCreateRecord = async () => {
    if (!date || !selectedItem || !selectedPrinter || !operator) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa todos los campos.',
      });
      return;
    }

    try {
      const newRecord = {
        fechaCambio: date,
        insumo: selectedItem,
        impresora: selectedPrinter,
        operador: operator,
      };

      // Hacer la solicitud POST para crear un nuevo registro
      const response = await axios.post<RegistroInsumo>('http://172.16.10.31/api/RegistroInsumos', newRecord);

      // Actualizar la tabla con el nuevo registro
      setRecords([...records, response.data]);

      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Registro de insumo creado exitosamente.',
      });

      handleCloseModal();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al crear el registro.',
      });
      console.error('Error al crear el registro de insumo:', error);
    }
  };

  const columns = [
    { field: 'fechaCambio', headerName: 'Fecha', width: 150 },
    { field: 'insumo', headerName: 'Insumo', width: 150 },
    { field: 'operador', headerName: 'Operador', width: 200 },
    { field: 'impresora', headerName: 'Impresora', width: 150 },
  ];

  return (
    <div className='registro-insumos'>
      <IconButton
        onClick={() => navigate('/ModulosRegistros')}
        className='back-button'
      >
        <ArrowBackIcon sx={{ fontSize: 40, color: '#46707e' }} />
      </IconButton>

      <Box className='title'>
        <Typography variant="h4">Registro de Insumos</Typography>
      </Box>

      <Box className='data-grid-container'>
        <Button variant="contained" onClick={handleOpenModal} className='add-button'>
          Registrar Cambio de Insumo
        </Button>
        <DataGrid 
          columns={columns}
          rows={records}
          getRowId={(row) => row.id} // Para que el DataGrid use el campo `id` como identificador
          disableColumnFilter
          disableDensitySelector
          disableColumnSelector
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50, 100]}
        />
      </Box>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className='modal-content'>
          <Box>
            <Typography variant="h6" className='modal-header'>
              Registrar Insumo
            </Typography>
          </Box>
          <Box sx={{ marginTop: '20px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="date"
                  value={date}
                  onChange={handleDateChange}
                  label="Fecha"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  value={selectedItem}
                  onChange={(event, newValue) => setSelectedItem(newValue || '')}
                  options={['Etiquetas', 'Tinta']}
                  renderInput={(params) => <TextField {...params} label="Insumo" fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  value={selectedPrinter}
                  onChange={(event, newValue) => setSelectedPrinter(newValue || '')}
                  options={['Impresora 1', 'Impresora 2', 'Impresora 3']}
                  renderInput={(params) => <TextField {...params} label="Impresora" fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Operador"
                  value={operator}
                  onChange={(event) => setOperator(event.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
          <Box className='modal-footer'>
            <Button onClick={handleCloseModal} sx={{ color: 'red' }}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              className='generate-button-insumos'
              sx={{
                backgroundColor: '#46707e',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#3b5c6b',
                },
              }}
              onClick={handleCreateRecord} // Guardar registro
            >
              Guardar
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default RegistroInsumos;