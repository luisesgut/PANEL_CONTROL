import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, TextField, Typography, Modal, Paper, Autocomplete, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import './impresionmp.scss';
import Swal from 'sweetalert2';

// Interfaces
interface Producto {
  id: number;
  nombre: string;
  tipo: string;
}

interface Printer {
  name: string;
  ip: string;
}

// Mapeo de los productos con los campos que requiere cada uno
const productosMap: { [key: string]: Producto[] } = {
  Bobina: [
    { id: 1, nombre: 'Bobina Natural', tipo: 'Bobina' },
    { id: 2, nombre: 'Bobina Metalizada', tipo: 'Bobina' }
  ],
  Caja: [
    { id: 3, nombre: 'Caja de Vaso', tipo: 'Caja' },
    { id: 4, nombre: 'Caja de Zipper', tipo: 'Caja' }
  ],
  Zipper: [
    { id: 5, nombre: 'Zipper A', tipo: 'Zipper' },
    { id: 6, nombre: 'Zipper B', tipo: 'Zipper' }
  ],
  'Bobina de Cinta': [
    { id: 7, nombre: 'Bobina de Cinta A', tipo: 'Bobina de Cinta' },
    { id: 8, nombre: 'Bobina de Cinta B', tipo: 'Bobina de Cinta' }
  ]
};

const camposMap: { [key: string]: string[] } = {
  Bobina: ['Medida', 'Calibre', 'Peso', 'Fecha Producción', 'Código Bobina'],
  Caja: ['Piezas', 'Tipo de Vaso'],
  Zipper: ['Código', 'Tipo de Zipper'],
  'Bobina de Cinta': ['Tipo de Bobina', 'Cantidad']
};

const ImpresionMP: React.FC = () => {
  const navigate = useNavigate();
  const [tiposProducto, setTiposProducto] = useState<string[]>([]);
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null); // Tipo de producto dinámico
  const [productos, setProductos] = useState<Producto[]>([]);
  const [selectedProductoPT, setSelectedProductoPT] = useState<string | null>(null); // Código de producto
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null); // Producto seleccionado
  const [camposDinamicos, setCamposDinamicos] = useState<{ [key: string]: string }>({});
  const [fechaProduccion, setFechaProduccion] = useState<string>(''); // Estado para la fecha de producción
  const [openModal, setOpenModal] = useState(false);
  const [trazabilidad, setTrazabilidad] = useState<string>('');
  const [selectedPrinter, setSelectedPrinter] = useState<Printer | null>(null);
  const [consecutivo, setConsecutivo] = useState<number>(1);

  // Opciones de impresoras
  const printerOptions = [
    { name: "Impresora 1", ip: "172.16.20.56" },
    { name: "Impresora 2", ip: "172.16.20.57" },
    { name: "Impresora 3", ip: "172.16.20.112" }
  ];

  useEffect(() => {
    // Cargar los tipos de producto desde el mapeo
    setTiposProducto(Object.keys(productosMap));
  }, []);

  // Cargar productos según el tipo de producto seleccionado
  useEffect(() => {
    if (selectedTipo) {
      setProductos(productosMap[selectedTipo] || []);
      setSelectedProductoPT(null); // Limpiar la selección del código
      setSelectedProducto(null); // Limpiar la selección del nombre
      setCamposDinamicos({}); // Limpiar campos dinámicos al cambiar de tipo de producto
    }
  }, [selectedTipo]);

  // Cargar producto basado en el código de PT seleccionado
  useEffect(() => {
    if (selectedProductoPT) {
      const productoEncontrado = productos.find(producto => producto.id.toString() === selectedProductoPT);
      setSelectedProducto(productoEncontrado || null);
    }
  }, [selectedProductoPT]);

  // Validación y generación de la etiqueta
  const handleGenerateEtiqueta = () => {
    if (!selectedProducto) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, selecciona un producto.',
      });
      return;
    }

    generateTrazabilidad(); // Generar la trazabilidad
    setOpenModal(true);
  };

  const handleChangeDinamico = (campo: string, valor: string) => {
    setCamposDinamicos((prev) => ({
      ...prev,
      [campo]: valor
    }));
  };

  const generateTrazabilidad = () => {
    const base = '1'; // Indicativo de materia prima (MP)
    const productoId = selectedProducto ? selectedProducto.id.toString().padStart(3, '0') : '000';
    const datos = Object.values(camposDinamicos).join('').replace(/\D/g, ''); // Concatena y limpia los valores
    const fullTrazabilidad = `${base}${productoId}${datos}`.slice(0, 13); // Máximo 13 caracteres antes del consecutivo
    const consecutivoStr = consecutivo.toString().padStart(3, '0'); // Consecutivo de 3 dígitos
    setTrazabilidad(fullTrazabilidad + consecutivoStr);
  };

  const handleCloseModal = () => setOpenModal(false);

  return (
    <div>
      {/* Botón de regreso en el lado izquierdo */}
      <Box className='top-container-mp' sx={{ display: 'flex', justifyContent: 'flex-start', padding: '16px' }}>
        <IconButton onClick={() => navigate('/ModulosImpresion')} className='button-back'>
          <ArrowBackIcon sx={{ fontSize: 40, color: '#46707e' }} />
        </IconButton>
      </Box>

      <div className='impresion-container-mp'>
        <Box className='impresion-card-mp' sx={{ pt: 8 }}>
          <Typography variant="h5" sx={{ textAlign: 'center', mb: 2 }}>
            GENERACIÓN DE ETIQUETA DE MATERIA PRIMA
          </Typography>
          <Box className='impresion-form-mp'>

            {/* Autoselect para Tipo de Producto */}
            <Autocomplete
              value={selectedTipo}
              onChange={(event, newValue) => setSelectedTipo(newValue || null)}
              options={tiposProducto}
              renderInput={(params) => <TextField {...params} label="Tipo de Producto" fullWidth />}
            />

            {/* Autoselect para Código de Producto (PT) */}
            <Autocomplete
              value={selectedProductoPT}
              onChange={(event, newValue) => setSelectedProductoPT(newValue || null)}
              options={productos.map(producto => producto.id.toString())} // Convertir IDs de productos a string
              renderInput={(params) => <TextField {...params} label="Código de Producto (PT)" fullWidth />}
            />

            {/* El nombre del producto cargado automáticamente */}
            <TextField
              label="Nombre del Producto"
              value={selectedProducto?.nombre || ''}
              fullWidth
              InputProps={{ readOnly: true }}
            />

            {/* Cargar campos dinámicos en base al tipo de producto */}
            {selectedTipo && camposMap[selectedTipo]?.map((campo: string) => (
              campo === 'Fecha Producción' ? (
                <TextField
                  key={campo}
                  fullWidth
                  label={campo}
                  type="date" // Campo de tipo fecha
                  value={fechaProduccion}
                  onChange={(event) => setFechaProduccion(event.target.value)} // Guardar la fecha seleccionada
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              ) : (
                <TextField
                  key={campo}
                  fullWidth
                  label={campo} // Mostrar el campo como la etiqueta
                  value={camposDinamicos[campo] || ''} // Usar el campo como clave en camposDinamicos
                  onChange={(event) => handleChangeDinamico(campo, event.target.value)} // Cambiar el valor de los campos dinámicos
                  variant="outlined"
                />
              )
            ))}

          </Box>

          <Box className='impresion-button-mp'>
            <Button 
              variant="contained" 
              onClick={handleGenerateEtiqueta}
              sx={{
                backgroundColor: '#46707e',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#3b5c6b',
                }
              }}
            >
              GENERAR
            </Button>
          </Box>
        </Box>
      </div>

      <Modal 
        open={openModal} 
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Paper 
          className="mp-modal-content"
          sx={{
            width: '90%',
            maxWidth: '600px',
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box className="mp-modal-header">
            <Typography variant="h6">Vista Previa de la Etiqueta</Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ my: 2 }} />  {/* Línea divisoria con margen vertical */}
          <Box className="mp-modal-body">
            <Typography><strong>Producto:</strong> {selectedProducto?.nombre}</Typography>
            {Object.entries(camposDinamicos).map(([campo, valor]) => (
              <Typography key={campo}><strong>{campo}:</strong> {valor}</Typography>
            ))}
            {fechaProduccion && (
              <Typography><strong>Fecha de Producción:</strong> {fechaProduccion}</Typography>
            )}
            <Typography><strong>Trazabilidad:</strong> {trazabilidad}</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />  {/* Línea divisoria con margen vertical */}

          <Box className="mp-modal-footer" sx={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
          <Autocomplete
            value={selectedPrinter}
            onChange={(event, newValue) => setSelectedPrinter(newValue || null)}
            options={printerOptions}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Impresora" 
                sx={{ width: '38%' }}  // Asegura que ocupe todo el ancho disponible
              />
            )}
            sx={{ width: '100%', maxWidth: '600px' }}  // Ajusta el ancho del Autocomplete
          />

            {/* Botón de generar */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateEtiqueta}
              sx={{
                backgroundColor: '#46707e',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#3b5c6b',
                },
                width:'30%'
              }}
            >
              Generar
            </Button>
          </Box>
        </Paper>
      </Modal>
    </div>
  );
};

export default ImpresionMP;