import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IconButton, Box, Typography, Modal, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid, GridToolbar, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import './catalogovaso.scss';

interface RowData {
  id: number;
  area: string;
  fecha: string;
  claveProducto: string;
  nombreProducto: string;
  claveOperador: string;
  operador: string;
  turno: string;
  pesoTarima: number;
  pesoBruto: number;
  pesoNeto: number;
  piezas: number;
  trazabilidad: string;
  orden: string;
  rfid: string;
  status: number;
  uom: string | null;
  amountPerBox: number;
  boxes: number;
  totalAmount: number;
  prodEtiquetaRFIDId: number;
}

interface Printer {
  id: number;
  name: string;
  ip: string;
}

const printers: Printer[] = [
  { id: 1, name: 'Impresora 1', ip: '172.16.20.56' },
  { id: 2, name: 'Impresora 2', ip: '172.16.20.57' },
  { id: 3, name: 'Impresora 3', ip: '172.16.20.112' }
];

const CatalogoVaso: React.FC = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);

  useEffect(() => {
    axios.get('http://172.16.10.31/api/Vaso')
      .then(response => {
        setRows(response.data.map((item: any) => ({
          id: item.id,
          area: item.area,
          fecha: item.fecha,
          claveProducto: item.claveProducto,
          nombreProducto: item.nombreProducto,
          claveOperador: item.claveOperador,
          operador: item.operador,
          turno: item.turno,
          pesoTarima: item.pesoTarima,
          pesoBruto: item.pesoBruto,
          pesoNeto: item.pesoNeto,
          piezas: item.piezas,
          trazabilidad: item.trazabilidad,
          orden: item.orden,
          rfid: item.rfid,
          status: item.status,
          uom: item.uom,
          amountPerBox: item.prodVasos.amountPerBox,
          boxes: item.prodVasos.boxes,
          totalAmount: item.prodVasos.totalAmount,
          prodEtiquetaRFIDId: item.prodVasos.prodEtiquetaRFIDId
        })));
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handlePreviewClick = (row: RowData) => {
    setSelectedRow(row);
    setOpenModal(true);
  };

  const handlePrintClick = (row: RowData) => {
    showPrinterSelection(row);
  };
  const handleDeleteClick = (row: RowData) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Seguro que quieres eliminar la trazabilidad: ${row.trazabilidad}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://172.16.10.31/api/Vaso/${row.trazabilidad}`)
          .then(response => {
            Swal.fire(
              'Eliminado!',
              'La etiqueta ha sido eliminada.',
              'success'
            );
            // Remueve la fila eliminada del estado
            setRows(rows.filter(r => r.trazabilidad !== row.trazabilidad));
          })
          .catch(error => {
            Swal.fire(
              'Error!',
              'Hubo un problema al eliminar la etiqueta.',
              'error'
            );
            console.error('Error al eliminar la etiqueta:', error);
          });
      }
    });
  };
  

  const showPrinterSelection = (row: RowData) => {
    Swal.fire({
      title: 'Seleccionar Impresora',
      input: 'select',
      inputOptions: printers.reduce((options, printer) => {
        options[printer.id] = printer.name;
        return options;
      }, {} as Record<number, string>),
      inputPlaceholder: 'Selecciona una impresora',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      preConfirm: (selectedPrinterId) => {
        const selectedPrinter = printers.find(printer => printer.id === Number(selectedPrinterId));
        if (!selectedPrinter) {
          Swal.showValidationMessage('Por favor, selecciona una impresora');
        }
        return selectedPrinter;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const selectedPrinter = result.value as Printer;
        const postData = {
          area: row.area,
          claveProducto: row.claveProducto,
          nombreProducto: row.nombreProducto,
          claveOperador: row.claveOperador,
          operador: row.operador,
          turno: row.turno,
          pesoTarima: row.pesoTarima,
          pesoBruto: row.pesoBruto,
          pesoNeto: row.pesoNeto,
          piezas: row.piezas,
          trazabilidad: row.trazabilidad,
          orden: row.orden,
          rfid: row.rfid,
          status: row.status,
          fecha: row.fecha,
          postExtraVasoDto: { // Change the key here
            prodEtiquetaRFIDId: row.prodEtiquetaRFIDId,
            amountPerBox: row.amountPerBox,
            boxes: row.boxes,
            totalAmount: row.totalAmount
          },
        };

        axios.post(`http://172.16.10.31/api/Vaso/PrintVasoLabel?ip=${selectedPrinter.ip}`, postData)
          .then(response => {
            console.log('Impresión iniciada:', response.data);
            Swal.fire('Éxito', 'Impresión iniciada correctamente', 'success');
          })
          .catch(error => {
            console.error('Error al imprimir:', error);
            Swal.fire('Error', 'Hubo un error al iniciar la impresión', 'error');
          });
      }
    });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'area', headerName: 'Area', width: 150 },
    { field: 'fecha', headerName: 'Fecha', width: 200 },
    { field: 'claveProducto', headerName: 'Clave Producto', width: 150 },
    { field: 'nombreProducto', headerName: 'Nombre Producto', width: 200 },
    { field: 'claveOperador', headerName: 'Clave Operador', width: 150 },
    { field: 'operador', headerName: 'Operador', width: 200 },
    { field: 'turno', headerName: 'Turno', width: 100 },
    { field: 'trazabilidad', headerName: 'Trazabilidad', width: 200 },
    { field: 'orden', headerName: 'Orden', width: 100 },
    { field: 'rfid', headerName: 'RFID', width: 200 },
    { field: 'prodEtiquetaRFIDId', headerName: 'ID RFID', width: 200 },
    { field: 'status', headerName: 'Status', width: 100 },
    { field: 'amountPerBox', headerName: 'Amount Per Box', width: 150 },
    { field: 'boxes', headerName: 'Boxes', width: 100 },
    { field: 'totalAmount', headerName: 'Total Amount', width: 150 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      sortable: false,
      filterable: false,
      width: 200,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handlePreviewClick(params.row)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton onClick={() => handlePrintClick(params.row)}>
            <PrintIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(params.row)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];
  

  return (
    <div className='catalogo-vaso'>
      <IconButton onClick={() => navigate('/catalogos')} className="back-button">
        <ArrowBackIcon sx={{ fontSize: 40, color: '#46707e' }} />
      </IconButton>
      <Typography variant="h4" className="title">
        CATALOGO ETIQUETADO VASO
      </Typography>
      <div className="data-grid-container">
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
          pageSizeOptions={[5, 10, 25, 50, 100]}
          pagination
          className="MuiDataGrid-root"
        />
      </div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Paper className="vaso-modal-content">
          <Box className="vaso-modal-header">
            <Typography variant="h6">Vista Previa de la Etiqueta</Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          {selectedRow && (
            <Box className="vaso-modal-body">
              <div className="row">
                <Typography><strong>Área:</strong> {selectedRow.area}</Typography>
              </div>
              <div className="row">
                <Typography><strong>Fecha:</strong> {selectedRow.fecha}</Typography>
              </div>
              <div className="row">
                <Typography><strong>Clave Producto:</strong> {selectedRow.claveProducto}</Typography>
              </div>
              <div className="row">
                <Typography><strong>Nombre Producto:</strong> {selectedRow.nombreProducto}</Typography>
              </div>
              <div className="row">
                <Typography><strong>Clave Operador:</strong> {selectedRow.claveOperador}</Typography>
              </div>
              <div className="row">
                <Typography><strong>Operador:</strong> {selectedRow.operador}</Typography>
              </div>
              <div className="row">
                <Typography><strong>Turno:</strong> {selectedRow.turno}</Typography>
              </div>
              <div className="row">
                <Typography><strong>Peso Tarima:</strong> {selectedRow.pesoTarima}</Typography>
              </div>
              <div className="row">
                <Typography><strong>Peso Bruto:</strong> {selectedRow.pesoBruto}</Typography>
              </div>
              <div className="row">
                <Typography><strong>Peso Neto:</strong> {selectedRow.pesoNeto}</Typography>
              </div>
              <div className="row">
                <Typography><strong>Piezas:</strong> {selectedRow.piezas}</Typography>
              </div>
              <div className="row">
                <Typography><strong>RFID:</strong> {selectedRow.rfid}</Typography>
              </div>
              <div className="row">
                <Typography><strong>Amount Per Box:</strong> {selectedRow.amountPerBox}</Typography>
              </div>
              <div className="row">
                <Typography><strong>Boxes:</strong> {selectedRow.boxes}</Typography>
              </div>
              <div className="row">
                <Typography><strong>Total Amount:</strong> {selectedRow.totalAmount}</Typography>
              </div>
            </Box>
          )}
        </Paper>
      </Modal>
    </div>
  );
};

export default CatalogoVaso;