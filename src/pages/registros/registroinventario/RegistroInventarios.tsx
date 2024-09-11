import React, { useState } from 'react';
import { Box, Typography, IconButton, Button, Modal, TextField, Grid, Autocomplete } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DataGrid, GridToolbar,GridRowSelectionModel } from '@mui/x-data-grid';
import './registroinventarios.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'; 
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2'; 

interface InventarioRegistro {
  id: number;
  fechaInventario: string;
  formatoEtiqueta: string;
  operador: string;
  ubicacion: string;
}

const RegistroInventarios: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [date, setDate] = useState('');
  const [inventoryType, setInventoryType] = useState('');
  const [operator, setOperator] = useState('');
  const [location, setLocation] = useState('');
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [records, setRecords] = useState<InventarioRegistro[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]); // Estado para guardar las filas seleccionadas
  const navigate = useNavigate();

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExcelFile(event.target.files ? event.target.files[0] : null);
  };

  const handleLoadRecords = async () => {
    if (!date) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, selecciona una fecha.',
      });
      return;
    }

    try {
      const response = await axios.get(`http://172.16.10.31/api/InventarioRegistros?fecha=${date}`);
      setRecords(response.data);
      
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Registros cargados exitosamente.',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al cargar los registros.',
      });
      console.error('Error al cargar los registros:', error);
    }
  };

  const handleCreateRecord = async () => {
    if (!date || !inventoryType || !operator || !location || !excelFile) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa todos los campos y selecciona un archivo.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('fechaInventario', date);
    formData.append('formatoEtiqueta', inventoryType);
    formData.append('operador', operator);
    formData.append('ubicacion', location);
    formData.append('nombreArchivo', excelFile.name);
    formData.append('excelArchivo', excelFile);

    try {
      const response = await axios.post('http://172.16.10.31/api/InventarioRegistros', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Registro de inventario creado exitosamente.',
      });

      handleCloseModal();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al crear el registro.',
      });

      console.error('Error al crear el registro de inventario:', error);
    }
  };

  const downloadFile = async (fileId: number) => {
    try {
      const response = await axios.get(`http://172.16.10.31/api/InventarioRegistros/${fileId}/download`, {
        responseType: 'blob',
      });
  
      const contentDisposition = response.headers['content-disposition'];
      const fileName = contentDisposition
        ? contentDisposition.split('filename=')[1]?.trim()
        : `archivo_${fileId}.xlsx`;
  
      saveAs(response.data, fileName);
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al descargar el archivo.',
      });
    }
  };

  // Nueva función para descargar múltiples archivos
  const downloadSelectedFiles = async () => {
    if (selectedIds.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, selecciona al menos un registro para descargar.',
      });
      return;
    }

    try {
      // Descargar archivos uno por uno
      for (const id of selectedIds) {
        await downloadFile(id);
      }

      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Archivos descargados exitosamente.',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al descargar los archivos.',
      });
    }
  };

  const deleteRecord = async (id: number) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://172.16.10.31/api/InventarioRegistros/${id}`);
          Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success');
          setRecords((prevRecords) => prevRecords.filter(record => record.id !== id));
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al eliminar el registro.',
          });
          console.error('Error al eliminar el registro:', error);
        }
      }
    });
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
          
          {/* Botón para descargar archivos seleccionados */}
          {selectedIds.length > 0 && (
            <Button 
              variant="contained" 
              onClick={downloadSelectedFiles} 
              className='download-selected-button'
              sx={{
                marginLeft: 2, // Puedes ajustar el espaciado si es necesario
                backgroundColor: '#46707e',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#3b5c6b',
                },
              }}
            >
              Descargar Archivos Seleccionados
            </Button>
          )}
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
                  options={['BIOFLEX', 'DESTINY', 'QUALITY', 'VASO', 'DIGITAL']}
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
              <Autocomplete
                options={[
                  'PT1-C01', 'PT1-C02', 'PT1-C03', 'PT1-C04', 'PT1-C05', 'PT1-C06', 
                  'PT1-C07', 'PT1-C08', 'PT1-EMBARQUES', 'PT1-PAS01', 'PT1-PAS04', 
                  'PT1-PAS05', 'PT1-PAS06', 'PT1-PAS08', 'PT1-RAA-L1', 'PT1-RB-L1', 
                  'PT1-RB-L2', 'PT1-RD-L1', 'PT1-RD-L2', 'PT1-RE-L1', 'PT1-RE-L2', 
                  'PT1-REPROCESOS', 'PT1-RF-L1', 'PT1-RF-L2', 'PT1-RG-L1', 'PT1-RG-L2', 
                  'PT1-RH-L1', 'PT1-RH-L2', 'PT1-RR-L1', 'PT1-RR-L2', 'PT1-RS-L1', 
                  'PT1-RS-L2', 'PT1-RU-L1', 'PT1-RU-L2', 'PT1-RV-L1', 'PT1-RV-L2', 
                  'PT1-RZ-L1', 'PT1-RZ-L2', 'PT1-UBICACIÓN-DE-SISTEMA'
                ]}
                value={location}
                onChange={(event, newValue) => setLocation(newValue || '')}
                renderInput={(params) => (
                  <TextField {...params} label="Ubicación" fullWidth />
                )}
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
            { field: 'fechaInventario', headerName: 'Fecha', width: 150 },
            { field: 'formatoEtiqueta', headerName: 'Formato', width: 150 },
            { field: 'operador', headerName: 'Operador', width: 200 },
            { field: 'ubicacion', headerName: 'Ubicación', width: 150 },
            {
              field: 'id',
              headerName: 'Archivo',
              width: 150,
              renderCell: (params) => (
                <Button variant="outlined" onClick={() => downloadFile(params.value)}>
                  Descargar
                </Button>
              ),
            },
            {
              field: 'delete',
              headerName: 'Acciones',
              width: 150,
              renderCell: (params) => (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => deleteRecord(params.row.id)}
                  startIcon={<DeleteIcon />}
                >
                  Eliminar
                </Button>
              ),
            },
          ]}
          rows={records}
          checkboxSelection // Habilita la selección múltiple
          onRowSelectionModelChange={(ids: GridRowSelectionModel) => setSelectedIds(ids as number[])} // Corrige el evento y añade el tipo adecuado
          disableColumnFilter
          disableDensitySelector
          disableColumnSelector
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          columnVisibilityModel={{}}
          pageSizeOptions={[5, 10, 25, 50, 100]}
        />
      </Box>

      {/* Botón para descargar archivos seleccionados */}
      {selectedIds.length > 0 && (
        <Button 
          variant="contained" 
          onClick={downloadSelectedFiles} 
          className='download-selected-button'
          sx={{
            marginTop: 2,
            backgroundColor: '#46707e',
            color: 'white',
            '&:hover': {
              backgroundColor: '#3b5c6b',
            },
          }}
        >
          Descargar Archivos Seleccionados
        </Button>
      )}
    </div>
  );
};

export default RegistroInventarios;