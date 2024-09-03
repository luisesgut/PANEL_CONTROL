  import React, { useState } from 'react';
  import { Box, Typography, IconButton, Button, Modal, TextField, Grid, Autocomplete,  } from '@mui/material';
  import ArrowBackIcon from '@mui/icons-material/ArrowBack';
  import { DataGrid, GridToolbar, GridColumnVisibilityModel } from '@mui/x-data-grid';
  import './registroinsumos.scss';
  import { useNavigate } from 'react-router-dom';

  const RegistroInsumos: React.FC = () => {
    const [openModal, setOpenModal] = useState(false);
    const [date, setDate] = useState('');
    const [selectedItem, setSelectedItem] = useState('');
    const [selectedPrinter, setSelectedPrinter] = useState('');
    const [operator, setOperator] = useState('');
    const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({});
    const navigate = useNavigate();

    const rows = [
      { id: 1, date: '2024-08-29', item: 'Etiquetas', operator: 'John Doe', printer: 'Impresora 1' },
      // Add more rows as needed
    ];

    const columns = [
      { field: 'date', headerName: 'Fecha', width: 150 },
      { field: 'item', headerName: 'Insumo', width: 150 },
      { field: 'operator', headerName: 'Operador', width: 200 },
      { field: 'printer', headerName: 'Impresora', width: 150 },
    ];

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setDate(event.target.value);
    };

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
          <DataGrid columns={columns}
            rows={rows}
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
            pageSizeOptions={[5,10,25,50,100]} />
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
