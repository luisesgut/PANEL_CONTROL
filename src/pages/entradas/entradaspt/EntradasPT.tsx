import React, { useState } from 'react';
import { Box, TextField, Button, Typography, IconButton, Autocomplete } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DataGrid, GridColDef } from '@mui/x-data-grid'; // Usamos solo DataGrid sin GridValueGetter
import '../entradasmp/entradas.scss'; // Use the shared styles

// Interfaz para las filas de la tabla
interface EntradasPTRow {
  id: number;
  claveProducto: string;
  nombreProducto: string;
  claveUnidad: string;
  piezas: number;
  pesoNeto: number;
}

const antennas = [
  { id: 1, name: 'EntradaPT' }, // Actualiza los nombres según los que tienes en tu backend
  { id: 2, name: 'Antenna 2' },
  { id: 3, name: 'Antenna 3' },
];

const EntradasPT: React.FC = () => {
  const navigate = useNavigate();
  const [selectedAntenna, setSelectedAntenna] = useState<any>(null);
  const [date, setDate] = useState('');
  const [records, setRecords] = useState<EntradasPTRow[]>([]); // Usa la interfaz para tipar el estado
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });

  // Función para mostrar "piezas" si la claveUnidad es "MIL", "H87", "XBX", o mostrar "pesoNeto" si no es alguna de esas.
  const formatConditionalValue = (claveUnidad: string, piezas: number, pesoNeto: number) => {
    if (['MIL', 'H87', 'XBX'].includes(claveUnidad)) {
      return piezas;
    }
    return pesoNeto;
  };

  const columns: GridColDef[] = [
    { field: 'claveProducto', headerName: 'Clave Producto', width: 150 },
    { field: 'nombreProducto', headerName: 'Nombre Producto', width: 250 },
    { field: 'claveUnidad', headerName: 'Clave Unidad', width: 150 },
    { 
      field: 'conditionalValue', 
      headerName: 'Cantidad/Peso', 
      width: 150,
      // Renderizamos directamente el valor en lugar de usar valueGetter
      renderCell: (params) => (
        <span>
          {formatConditionalValue(params.row.claveUnidad, params.row.piezas, params.row.pesoNeto)}
        </span>
      )
    }
  ];

  const handleLoadRecords = async () => {
    if (!selectedAntenna || !date) {
      console.log('Antena o fecha no seleccionada');
      return;
    }

    try {
      const response = await fetch(`http://http://172.16.10.31/api/ProdExtraInfo?fechaEntrada=${date}&antena=${selectedAntenna.name}`);
      const data = await response.json();

      // Mapea los datos recibidos al formato que necesita la tabla
      const formattedRecords = data.map((item: any): EntradasPTRow => ({
        id: item.prodExtraInfo.id,
        claveProducto: item.prodExtraInfo.prodEtiquetaRFID.claveProducto,
        nombreProducto: item.prodExtraInfo.prodEtiquetaRFID.nombreProducto,
        claveUnidad: item.claveUnidad,
        piezas: item.prodExtraInfo.prodEtiquetaRFID.piezas,
        pesoNeto: item.prodExtraInfo.prodEtiquetaRFID.pesoNeto,
      }));

      setRecords(formattedRecords); // Actualiza el estado de los registros con los datos formateados
    } catch (error) {
      console.error('Error al cargar los registros:', error);
    }
  };

  return (
    <div className="entradas-container">
      <Box sx={{ width: '100%', p: 1, position: 'relative' }}>
        <IconButton
          onClick={() => navigate('/ModulosEntradas')}
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
          <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
            CONSULTA DE ENTRADAS PT
          </Typography>
        </Box>
      </Box>

      <Box className="filter-box">
        <Autocomplete
          options={antennas}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => setSelectedAntenna(newValue)}
          renderInput={(params) => <TextField {...params} label="Selecciona Antena" />}
          sx={{ width: '300px', mr: 2 }}
        />
        <TextField
          label="Fecha"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: '200px', mr: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleLoadRecords}
          sx={{
            backgroundColor: '#46707e',
            color: 'white',
            '&:hover': { backgroundColor: '#3b5c6b' },
            height: '56px'
          }}
        >
          Cargar Registros
        </Button>
      </Box>

      <Box className="data-grid-container">
        <DataGrid
          rows={records}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel} // Permite cambiar la paginación
          pageSizeOptions={[5, 10, 15, 25]} // Múltiples opciones de tamaño de página
          checkboxSelection
        />
      </Box>
    </div>
  );
};

export default EntradasPT;