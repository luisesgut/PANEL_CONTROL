import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IconButton, Box, Typography, Modal, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid, GridToolbar, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import './catalogobfx.scss';

interface RowData {
  id: number;
  area: string;
  fecha: string;
  claveProducto: string;
  nombreProducto: string;
  turno: string;
  operador: string;
  pesoBruto: number;
  pesoNeto: number;
  pesoTarima: number;
  piezas: number;
  trazabilidad: string;
  orden: number;
  rfid: string;
  uom: string;
  status: string;
}

const CatalogoBFX: React.FC = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);

  useEffect(() => {
    axios.get('http://172.16.10.31/api/RfidLabel')
      .then(response => setRows(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handlePreviewClick = (row: RowData) => {
    setSelectedRow(row);
    setOpenModal(true);
  };

  const handlePrintClick = (row: RowData) => {
    const postData = {
      area: row.area,
      claveProducto: row.claveProducto,
      nombreProducto: row.nombreProducto,
      claveOperador: row.operador, // Asumiendo que 'claveOperador' puede ser deducido del campo 'operador'
      operador: row.operador,
      turno: row.turno,
      pesoTarima: row.pesoTarima,
      pesoBruto: row.pesoBruto,
      pesoNeto: row.pesoNeto,
      piezas: row.piezas,
      trazabilidad: row.trazabilidad,
      orden: row.orden.toString(),
      rfid: row.rfid,
      status: row.status,
      uom: row.uom, // Asegúrate de que esta propiedad está correctamente definida en tus filas
      fecha: row.fecha // Considera si necesitas transformar el formato de la fecha para el backend
    };
  
    axios.post(`http://172.16.10.31/Printer/BfxPrinterIP?ip=172.16.20.58`, postData)
      .then(response => {
        console.log('Impresión iniciada:', response.data);
        // Puedes manejar la respuesta de éxito aquí, como mostrar un mensaje de éxito.
      })
      .catch(error => {
        console.error('Error al imprimir:', error);
        // Puedes manejar errores aquí, como mostrar un mensaje de error.
      });
  };
  

  const handleCloseModal = () => {
    setOpenModal(false);  
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'area', headerName: 'Área', width: 150 },
    { field: 'fecha', headerName: 'Fecha', width: 150 },
    { field: 'claveProducto', headerName: 'Clave Producto', width: 120 },
    { field: 'nombreProducto', headerName: 'Nombre Producto', width: 200 },
    { field: 'turno', headerName: 'Turno', width: 100 },
    { field: 'operador', headerName: 'Operador', width: 150 },
    { field: 'pesoTarima', headerName: 'Peso Tarima', type: 'number', width: 130 },
    { field: 'pesoBruto', headerName: 'Peso Bruto', type: 'number', width: 130 },
    { field: 'pesoNeto', headerName: 'Peso Neto', type: 'number', width: 130 },
    { field: 'piezas', headerName: 'Piezas', type: 'number', width: 100 },
    { field: 'trazabilidad', headerName: 'Trazabilidad', width: 150 },
    { field: 'orden', headerName: 'Orden', width: 120 },
    { field: 'rfid', headerName: 'RFID', width: 150 },
    { field: 'status', headerName: 'Estado', width: 100 },
    { field: 'uom', headerName: 'UOM', width: 100 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      sortable: false,
      filterable: false,
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handlePreviewClick(params.row)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton onClick={() => handlePrintClick(params.row)}>
            <PrintIcon />
          </IconButton>
        </>
      ),
    },
  ];
  

  return (
    <div className='catalogo-bfx'>
      <IconButton onClick={() => navigate('/catalogos')} sx={{ position: 'absolute', top: 16, left: 16 }}>
        <ArrowBackIcon sx={{ fontSize: 40, color: '#46707e' }} />
      </IconButton>
      <Typography variant="h4" sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
        CATALOGO ETIQUETADO BIOFLEX
      </Typography>
      <DataGrid
        columns={columns}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        slots={{ toolbar: GridToolbar }}
        slotProps={{ toolbar: { showQuickFilter: true } }}
        rows={rows}
        initialState={{
            pagination: {
              paginationModel: {
                pageSize: 25,
              },
            },
        }}
        pageSizeOptions={[5,10,25,50,100]}
        pagination
      />
      <Modal open={openModal} onClose={handleCloseModal}>
        <Paper className="bfx-modal-content">
            <Box className="bfx-modal-header">
                <Typography variant="h6">Vista Previa de la Etiqueta</Typography>
                <IconButton onClick={handleCloseModal}>
                    <CloseIcon />
                </IconButton>
            </Box>
            {selectedRow && (
                <Box className="bfx-modal-body">
                    <div className="row">
                        <Typography><strong>Área:</strong></Typography>
                        <Typography>{selectedRow.area}</Typography>
                    </div>
                    <div className="row">
                        <Typography><strong>Fecha:</strong></Typography>
                        <Typography>{selectedRow.fecha}</Typography>
                    </div>
                    <div className="row">
                        <Typography><strong>Producto:</strong></Typography>
                        <Typography>{selectedRow.nombreProducto}</Typography>
                    </div>
                    <div className="row">
                        <Typography><strong>Orden:</strong></Typography>
                        <Typography>{selectedRow.orden}</Typography>
                    </div>
                    <div className="row">
                        <Typography><strong>Turno:</strong></Typography>
                        <Typography>{selectedRow.turno}</Typography>
                    </div>
                    <div className="row">
                        <Typography><strong>Peso Bruto:</strong></Typography>
                        <Typography>{selectedRow.pesoBruto}</Typography>
                    </div>
                    <div className="row">
                        <Typography><strong>Peso Neto:</strong></Typography>
                        <Typography>{selectedRow.pesoNeto}</Typography>
                    </div>
                    <div className="row">
                        <Typography><strong>Peso Tarima:</strong></Typography>
                        <Typography>{selectedRow.pesoTarima}</Typography>
                    </div>
                    <div className="row">
                        <Typography><strong># Piezas (Rollos, Bultos, Cajas):</strong></Typography>
                        <Typography>{selectedRow.piezas}</Typography>
                    </div>
                    <div className="row">
                        <Typography><strong>Código de Trazabilidad:</strong></Typography>
                        <Typography>{selectedRow.trazabilidad}</Typography>
                    </div>
                    <div className="row">
                        <Typography><strong>RFID:</strong></Typography>
                        <Typography>{selectedRow.rfid}</Typography>
                    </div>
                </Box>
            )}
        </Paper>
    </Modal>

    </div>
  );
};

export default CatalogoBFX;
