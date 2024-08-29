import React, { useState } from 'react';
import { Box, Typography, IconButton, Button, Modal, TextField, Grid, Autocomplete } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './registroinventarios.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'; 
import DeleteIcon from '@mui/icons-material/Delete'; 

const RegistroInventarios: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [date, setDate] = useState('');
  const [inventoryType, setInventoryType] = useState('');
  const [operator, setOperator] = useState('');
  const [location, setLocation] = useState('');
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExcelFile(event.target.files ? event.target.files[0] : null);
  };

  const handleLoadRecords = () => {
    // Lógica para cargar registros basada en la fecha seleccionada
  };

  const handleCreateRecord = () => {
    // Lógica para crear un nuevo registro de inventario
  };

  const downloadFile = async (fileId: string) => {
    try {
      const response = await axios.get(`tu_endpoint_para_descargar/${fileId}`, {
        responseType: 'blob', // Esto asegura que el archivo se maneje correctamente
      });

      const fileName = response.headers['content-disposition'].split('filename=')[1]; // Obtén el nombre del archivo
      saveAs(response.data, fileName);
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
    }
  };

  return (
    <div className='registro-inventarios'>
      <IconButton
        onClick={() => navigate('/ModulosRegistros')}
        className='back-button'
      >
        <ArrowBackIcon sx={{ fontSize: 40, color: '#46707e' }} />
      </IconButton>

      <Box className='title'>
        <Typography variant="h4">Registro de Inventarios</Typography>
      </Box>

      <Box className='actions-container'>
        <Box className='date-filter-box'>
          <Box className='date-filter'>
            <TextField
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              label="Fecha"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <Button onClick={handleLoadRecords} variant="contained" className='load-button'>
              Cargar Registros
            </Button>
          </Box>
        </Box>
        <Box className='create-record-box'>
          <Button variant="contained" onClick={handleOpenModal} className='add-button'>
            Crear Registro de Inventario
          </Button>
        </Box>
      </Box>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className='modal-content'>
          <Typography variant="h6" className='modal-header'>Crear Registro de Inventario</Typography>
          <Box className='modal-body' sx={{ marginTop: '20px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  value={inventoryType}
                  onChange={(event, newValue) => setInventoryType(newValue || '')}
                  options={['Formato 1', 'Formato 2', 'Formato 3']}
                  renderInput={(params) => <TextField {...params} label="Formato de Etiqueta" fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  label="Fecha de Inventario"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Operador"
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Ubicación"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                  className='upload-button'
                  sx={{
                    backgroundColor: '#46707e',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#3b5c6b',
                    },
                  }}
                >
                  Subir Archivo Excel
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
                {excelFile && (
                  <Box
                    display="flex"
                    alignItems="center"
                    mt={2}
                    p={2}
                    sx={{
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      backgroundColor: '#f5f5f5',
                    }}
                  >
                    <InsertDriveFileIcon sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="body1">{excelFile.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {`${(excelFile.size / 1024).toFixed(2)} KB`}
                      </Typography>
                    </Box>
                    <IconButton
                      sx={{ ml: 'auto' }}
                      onClick={() => setExcelFile(null)}
                      color="error"
                      aria-label="remove file"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
          <Box className='modal-footer'>
            <Button onClick={handleCloseModal} sx={{ color: 'red' }}>Cancelar</Button>
            <Button onClick={handleCreateRecord} variant="contained" className='generate-button'
              sx={{
                backgroundColor: '#46707e',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#3b5c6b',
                },
              }}>
              Guardar
            </Button>
          </Box>
        </Box>
      </Modal>

      <Box className='data-grid-container'>
        <DataGrid
          columns={[
            { field: 'date', headerName: 'Fecha', width: 150 },
            { field: 'inventoryType', headerName: 'Formato', width: 150 },
            { field: 'operator', headerName: 'Operador', width: 200 },
            { field: 'location', headerName: 'Ubicación', width: 150 },
            {
              field: 'excelFile',
              headerName: 'Archivo',
              width: 150,
              renderCell: (params) => (
                <Button variant="outlined" onClick={() => downloadFile(params.value)}>
                  Descargar
                </Button>
              ),
            },
          ]}
          rows={records}
          disableColumnFilter
          disableDensitySelector
          disableColumnSelector
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          columnVisibilityModel={{}}
          pageSizeOptions={[5, 10, 25, 50, 100]}
        />
      </Box>
    </div>
  );
};

export default RegistroInventarios;
