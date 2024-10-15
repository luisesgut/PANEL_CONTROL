import React, { useState } from 'react';
import { Box, TextField, Button, Typography, IconButton, Autocomplete, Modal, Stepper, Step, StepLabel } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import './productoproducido.scss';

// Interfaz para las filas de la tabla
interface ProductoProducidoRow {
  id: number;
  claveProducto: string;
  nombreProducto: string;
  estatus: number;
  detalles: { orden: string; total: number; unidad: string }[];
}

const steps = ['Producción', 'En Almacén', 'Asignación Ubicación', 'Registrado en SAP', 'Embarcado'];

// Opciones del Autocomplete para claveProducto
const productos = [
  { clave: 'PROD001', nombre: 'Producto A' },
  { clave: 'PROD002', nombre: 'Producto B' },
];

const ProductoProducido: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProducto, setSelectedProducto] = useState<any>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [openModal, setOpenModal] = useState(false);  // Estado para manejar el modal
  const [selectedRow, setSelectedRow] = useState<ProductoProducidoRow | null>(null); // Fila seleccionada

  // Estado de filas
  const [rows, setRows] = useState<ProductoProducidoRow[]>([
    {
      id: 1,
      claveProducto: 'PROD001',
      nombreProducto: 'Producto A',
      estatus: 1,
      detalles: [
        { orden: '18986', total: 1229.9, unidad: 'KGM' },
        { orden: '18986', total: 800, unidad: 'KGM' },
      ],
    },
    {
      id: 2,
      claveProducto: 'PROD001',
      nombreProducto: 'Producto A',
      estatus: 2,
      detalles: [
        { orden: '18986', total: 500, unidad: 'KGM' },
      ],
    },
    {
      id: 3,
      claveProducto: 'PROD001',
      nombreProducto: 'Producto A',
      estatus: 3,
      detalles: [
        { orden: '18987', total: 1500, unidad: 'KGM' },
      ],
    },
    {
      id: 4,
      claveProducto: 'PROD002',
      nombreProducto: 'Producto B',
      estatus: 1,
      detalles: [
        { orden: '18990', total: 1000, unidad: 'PCS' },
        { orden: '18990', total: 1200, unidad: 'PCS' },
      ],
    },
    {
      id: 5,
      claveProducto: 'PROD002',
      nombreProducto: 'Producto B',
      estatus: 2,
      detalles: [
        { orden: '18991', total: 700, unidad: 'PCS' },
      ],
    },
  ]);

  // Método para manejar la apertura del modal con la fila seleccionada
  const handleOpenModal = (row: ProductoProducidoRow) => {
    setSelectedRow(row);
    setOpenModal(true);
  };

  // Método para cerrar el modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRow(null);
  };

  // Calcular la suma total de los "total"
  const calculateTotalSum = () => {
    return selectedRow?.detalles.reduce((acc, detalle) => acc + detalle.total, 0) || 0;
  };

  // Definir las columnas de la tabla principal
  const columns: GridColDef[] = [
    { field: 'claveProducto', headerName: 'Clave Producto', width: 200 },
    { field: 'nombreProducto', headerName: 'Nombre Producto', width: 300 },
    {
      field: 'estatus',
      headerName: 'Estatus',
      width: 150,
      renderCell: (params) => <span>{`Estatus ${params.value}`}</span>,
    },
    {
      field: 'total',
      headerName: 'Total Detalles',
      width: 150,
      renderCell: (params) => {
        const rowTotal = params.row.detalles.reduce((acc: number, detalle: any) => acc + detalle.total, 0);
        return <Typography>{rowTotal.toFixed(2)}</Typography>;
      },
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 150,
      renderCell: (params) => (
        <Button variant="outlined" onClick={() => handleOpenModal(params.row)}>
          Ver Detalles
        </Button>
      ),
    },
  ];

  // Definir las columnas para el DataGrid dentro del modal
  const detailColumns: GridColDef[] = [
    {
      field: 'orden',
      headerName: 'Orden',
      width: 200,
      headerClassName: 'header-bold',  // Clase personalizada para negrita en los headers
      renderCell: (params) => (
        <Typography
          sx={{
            fontWeight: params.row.id === 'total-row' ? 'bold' : 'normal',  // Negrita para la fila del total
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 200,
      headerClassName: 'header-bold',  // Clase personalizada para negrita en los headers
      renderCell: (params) => (
        <Typography
          sx={{
            fontWeight: params.row.id === 'total-row' ? 'bold' : 'normal',  // Negrita para la fila del total
          }}
        >
          {params.value.toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'unidad',
      headerName: 'Unidad de Medida',
      width: 200,
      headerClassName: 'header-bold',  // Clase personalizada para negrita en los headers
      renderCell: (params) => (
        <Typography
          sx={{
            fontWeight: params.row.id === 'total-row' ? 'bold' : 'normal',  // Negrita para la fila del total
          }}
        >
          {params.value}
        </Typography>
      ),
    },
  ];

  return (
    <div className="producto-producido-container">
      <Box sx={{ width: '100%', p: 1, position: 'relative' }}>
        <IconButton
          onClick={() => navigate('/ModulosEntradas')}
          sx={{ position: 'absolute', top: 8, left: 8, zIndex: 10 }}
        >
          <ArrowBackIcon sx={{ fontSize: 40, color: '#46707e' }} />
        </IconButton>
        <Box sx={{ pt: 3, width: '100%', textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
            CONSULTA DE PRODUCTO PRODUCIDO
          </Typography>
        </Box>
      </Box>

      <Box className="filter-box">
        <Autocomplete
          options={productos}
          getOptionLabel={(option) => option.clave}
          onChange={(event, newValue) => setSelectedProducto(newValue)}
          renderInput={(params) => <TextField {...params} label="Selecciona Producto" />}
          sx={{ width: '300px', mr: 2 }}
        />
        <TextField
          label="Fecha Inicio"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: '200px', mr: 2 }}
        />
        <TextField
          label="Fecha Fin"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: '200px', mr: 2 }}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#46707e',
            color: 'white',
            '&:hover': { backgroundColor: '#3b5c6b' },
            height: '56px',
          }}
        >
          Cargar Registros
        </Button>
      </Box>
       {/* Stepper que muestra todos los estados posibles */}
       <Box sx={{ mt: 3 }}>
        <Stepper alternativeLabel activeStep={steps.length - 1}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Box className="data-grid-container">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10, 15, 25]}
          disableRowSelectionOnClick
          hideFooterPagination
          getRowId={(row) => row.id}
        />
      </Box>

     {/* Modal para mostrar los detalles */}
     <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            backgroundColor: 'white',
            p: 4,
            borderRadius: 2,
            width: '80%',
            margin: 'auto',
            mt: 5,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            maxHeight: '90vh',
            overflowY: 'auto',
            '@media (max-width: 768px)': {
              width: '95%',
              padding: 2,
            },
          }}
        >
          <Typography variant="h6" gutterBottom>
            Detalles del Producto: {selectedRow?.claveProducto} 
          </Typography>
          <Stepper alternativeLabel activeStep={selectedRow?.estatus ? selectedRow.estatus - 1 : 0}>
           {steps.map((label, index) => (
             <Step key={index}>
               <StepLabel>{label}</StepLabel>
             </Step>
           ))}
         </Stepper>
          {selectedRow ? (
            <Box sx={{ height: 300 }}>
              <DataGrid
                rows={[
                  ...selectedRow.detalles.map((detalle, index) => ({
                    id: index,
                    ...detalle,
                  })),
                  {
                    id: 'total-row',  // ID especial para la fila del total
                    orden: 'Total:',
                    total: calculateTotalSum(),  // Suma calculada
                    unidad: '',  // Dejar vacío para la unidad en la fila total
                  },
                ]}
                columns={detailColumns}
                pageSizeOptions={[5]}
                hideFooterPagination
                autoHeight
                sx={{
                  '& .header-bold': {
                    fontWeight: 'bold',  // Aplicar negrita a los encabezados
                  },
                }}
              />
            </Box>
          ) : null}
          <Button
            onClick={handleCloseModal}
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: '#46707e',
              color: 'white',
              '&:hover': { backgroundColor: '#3b5c6b' },
            }}
          >
            Cerrar
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ProductoProducido;