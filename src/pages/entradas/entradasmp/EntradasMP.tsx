import React, { useState } from 'react';
import { Box, Button, Typography, IconButton, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './entradas.scss';

interface Record {
  id: number;
  claveProducto: string;
  operadorNombre: string;
  fechaCreacion: string;
  productoNombre: string;
  trazabilidad: string;
  calibre: string;
  cantidades: number;
  codigoBobina: string;
  fechaProduccion: string;
  impresora: string;
  peso: number;
  piezas: number;
  rfid: string;
  status: string;
  tipoBobina: string;
  tipoCaja: string;
  tipoVaso: string;
  tipoZipper: string;
  tipoProducto: string;
  medida: string;
}

const EntradasMP: React.FC = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<string>('');  // Fecha de inicio
  const [endDate, setEndDate] = useState<string>('');      // Fecha de fin
  const [records, setRecords] = useState<Record[]>([]);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);

  // Columnas de la tabla
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'claveProducto', headerName: 'Clave Producto', width: 150 },
    { field: 'productoNombre', headerName: 'Producto Nombre', width: 150 },
    { field: 'operadorNombre', headerName: 'Operador', width: 150 },
    { field: 'fechaCreacion', headerName: 'Fecha Creación', width: 200 },
    { field: 'trazabilidad', headerName: 'Trazabilidad', width: 200 },
    { field: 'calibre', headerName: 'Calibre', width: 100 },
    { field: 'cantidades', headerName: 'Cantidades', width: 120 },
    { field: 'codigoBobina', headerName: 'Código Bobina', width: 150 },
    { field: 'fechaProduccion', headerName: 'Fecha Producción', width: 200 },
    { field: 'impresora', headerName: 'Impresora', width: 120 },
    { field: 'peso', headerName: 'Peso', width: 100 },
    { field: 'piezas', headerName: 'Piezas', width: 100 },
    { field: 'rfid', headerName: 'RFID', width: 150 },
    { field: 'status', headerName: 'Status', width: 100 },
    { field: 'tipoBobina', headerName: 'Tipo Bobina', width: 150 },
    { field: 'tipoCaja', headerName: 'Tipo Caja', width: 150 },
    { field: 'tipoVaso', headerName: 'Tipo Vaso', width: 150 },
    { field: 'tipoZipper', headerName: 'Tipo Zipper', width: 150 },
    { field: 'tipoProducto', headerName: 'Tipo Producto', width: 150 },
    { field: 'medida', headerName: 'Medida', width: 100 },
  ];

  const handleLoadRecords = async () => {
    if (startDate && endDate) {
      try {
        // Llamada a la API para obtener los registros filtrados por rango de fechas
        const response = await axios.get<Record[]>(
          `http://172.16.10.31/api/ProdEtiquetasRFIDMP`
        );
        const registrosFiltrados = response.data.filter((record: Record) => {
          const fechaCreacion = new Date(record.fechaCreacion);
          const fechaInicio = new Date(startDate);
          const fechaFin = new Date(endDate);
          return fechaCreacion >= fechaInicio && fechaCreacion <= fechaFin;
        });

        setRecords(registrosFiltrados); // Establecer los registros filtrados en el estado
      } catch (error) {
        console.error('Error al cargar los registros:', error);
      }
    } else {
      console.error('Por favor, selecciona un rango de fechas.');
    }
  };

  const handleExportToExcel = () => {
    const selectedRecords = records.filter((record) => selectionModel.includes(record.id));

    if (selectedRecords.length === 0) {
      console.error('No se han seleccionado registros.');
      return;
    }

    // Crear el archivo Excel a partir de los registros seleccionados
    const worksheet = XLSX.utils.json_to_sheet(selectedRecords);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registros');

    // Obtener la semana actual del año
    const currentWeek = Math.ceil(
      ((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 86400000 +
        new Date().getDay() +
        1) /
        7
    );

    // Generar el nombre del archivo con la semana actual
    const fileName = `Altas SAP - Semana ${currentWeek}.xlsx`;

    // Exportar el archivo Excel
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="entradas-container">
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconButton
          onClick={() => navigate('/ModulosEntradas')}
          sx={{ alignSelf: 'flex-start', m: 1, color: '#46707e' }}
        >
          <ArrowBackIcon sx={{ fontSize: 40 }} />
        </IconButton>
        <Typography variant="h5" sx={{ mt: 3, mb: 2, textAlign: 'center' }}>
          ENTRADAS MP
        </Typography>

        <Box className="filter-box" sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Date picker para la fecha de inicio */}
          <TextField
            label="Fecha Inicio"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            sx={{ width: 200, mr: 2 }}
          />
          {/* Date picker para la fecha de fin */}
          <TextField
            label="Fecha Fin"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            sx={{ width: 200, mr: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleLoadRecords}
            sx={{ backgroundColor: '#46707e', '&:hover': { backgroundColor: '#3b5c6b' } }}
          >
            Cargar Registros
          </Button>
        </Box>

        <Box className="data-grid-container" sx={{ marginTop: 2 }}>
          <DataGrid
            rows={records}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5,10,25,50,100]}
            checkboxSelection
            onRowSelectionModelChange={(newSelectionModel) => setSelectionModel(newSelectionModel)}
            rowSelectionModel={selectionModel}
          />
        </Box>

        <Button
          variant="contained"
          onClick={handleExportToExcel}
          sx={{ mt: 3, backgroundColor: '#46707e', '&:hover': { backgroundColor: '#3b5c6b' } }}
        >
          Descargar Excel
        </Button>
      </Box>
    </div>
  );
};

export default EntradasMP;