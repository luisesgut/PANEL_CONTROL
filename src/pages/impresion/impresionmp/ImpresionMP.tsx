import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, TextField, Typography, Modal, Paper, Autocomplete, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import './impresionmp.scss';
import Swal from 'sweetalert2';
import axios, { AxiosError } from 'axios';


interface Operador {
  id: number;
  numNomina: string;
  nombreCompleto: string;
}

interface Printer {
  name: string;
  ip: string;
}

interface Producto {
  claveProducto: string;
  nombreProducto: string;
  unidad: string;
}
const productosMap: { [key: string]: Producto[] } = {
  Bobina: [
  ],
  Caja: [
  ],
  'caja-vaso': [
  ],
  Zipper: [
  ],
  'bobina-cinta': [
  ]
};
// Campos dinámicos mapeados para cada tipo de producto
const camposMap: { [key: string]: string[] } = {
  Bobina: ['Medida', 'Calibre', 'Fecha Producción', 'Piezas'],
  Caja: ['Piezas', 'Tipo de Caja'],
  'caja-vaso': ['Piezas', 'Tipo de Vaso'],
  Zipper: ['Tipo de Zipper', 'Piezas'],
  'bobina-cinta': ['Tipo de Bobina', 'Piezas']
};

const ImpresionMP: React.FC = () => {
  const navigate = useNavigate();
  const [tiposProducto] = useState<string[]>(['Bobina', 'Caja', 'caja-vaso', 'Zipper', 'bobina-cinta']);
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [selectedProductoPT, setSelectedProductoPT] = useState<Producto | null>(null);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [camposDinamicos, setCamposDinamicos] = useState<{ [key: string]: string }>({});
  const [fechaProduccion, setFechaProduccion] = useState<string>('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState<Printer | null>(null);
  const [consecutivo, setConsecutivo] = useState<number>(1);
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [selectedOperador, setSelectedOperador] = useState<Operador | null>(null);
  const [numPiezas, setNumPiezas] = useState<number>(0);  // Estado para piezas
  const [codigosBobina, setCodigosBobina] = useState<string[]>([]);  // Estado para códigos de bobina
  const [pesosBobina, setPesosBobina] = useState<string[]>([]);  // Estado para pesos de bobina
  const [bobinaActual, setBobinaActual] = useState<number>(0);  // Estado para controlar la bobina actual
  const [trazabilidad, setTrazabilidad] = useState<string[]>([]); // Cambiar a arreglo de string
  const handleCodigoBobinaChange = (index: number, valor: string) => {
    const nuevosCodigos = [...codigosBobina];
    nuevosCodigos[index] = valor;
    setCodigosBobina(nuevosCodigos);
  };
  
  const handlePesoBobinaChange = (index: number, valor: string) => {
    const nuevosPesos = [...pesosBobina];
    nuevosPesos[index] = valor;
    setPesosBobina(nuevosPesos);
  };
  
  // Opciones de impresoras
  const printerOptions = [
    { name: "Impresora 1", ip: "172.16.20.56" },
    { name: "Impresora 2", ip: "172.16.20.57" },
    { name: "Impresora 3", ip: "172.16.20.112" }
  ];

  useEffect(() => {

    // Llamada para obtener los operadores usando el endpoint
    axios.get<Operador[]>('http://172.16.10.31/api/Operator/all-operators')
      .then(response => {
        setOperadores(response.data);
      })
      .catch(error => {
        console.error('Error al obtener operadores:', error);
      });
  }, []);

  useEffect(() => {
    fetch('http://172.16.10.31/api/ProductosMP')
      .then(response => response.json())
      .then(data => setProductos(data))
      .catch(error => console.error('Error fetching data: ', error));
  }, []);

  useEffect(() => {
    if (selectedProductoPT) {
      const productoEncontrado = productos.find(producto => producto.claveProducto === selectedProductoPT.claveProducto);
      setSelectedProducto(productoEncontrado || null); // Actualiza el estado de selectedProducto
    } else {
      setSelectedProducto(null); // Resetea si no hay código de producto seleccionado
    }
  }, [selectedProductoPT, productos]);

  const handleGenerateEtiqueta = () => {
    if (!selectedProducto || !selectedOperador) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, selecciona un producto y un operador.',
      });
      return;
    }
    generateTrazabilidad();
    setOpenModal(true);
    setBobinaActual(0); 
  };

  const handleChangeDinamico = (campo: string, valor: string) => {
    setCamposDinamicos((prev) => ({
      ...prev,
      [campo]: valor
    }));
    if (campo === 'Piezas') {
      const num = parseInt(valor) || 0;
      setNumPiezas(num);
      setCodigosBobina(Array(num).fill(''));  
      setPesosBobina(Array(num).fill(''));    
    }
  };

  const generateTrazabilidad = async () => {
    if (!selectedProducto || !selectedTipo) return;
  
    const base = '1';
  
    // Extraer los últimos 3 dígitos del claveProducto
    const productoId = selectedProducto.claveProducto.slice(-3); // Últimos 3 dígitos de claveProducto
  
    // Obtener la fecha actual en formato DDMMYY
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');  // Día
    const month = (today.getMonth() + 1).toString().padStart(2, '0');  // Mes (0 es enero)
    const year = today.getFullYear().toString().slice(-2);  // Últimos 2 dígitos del año
    const fecha = `${day}${month}${year}`;  // Formato DDMMYY
  
    // Generar el prefijo de la trazabilidad (1 + productoId + fecha)
    const prefixTrazabilidad = `${base}${productoId}${fecha}`; // Ejemplo: 1185230924
  
    try {
      // Obtener registros de trazabilidad desde la API
      const response = await axios.get('http://172.16.10.31/api/ProdEtiquetasRFIDMP');
      const registros = response.data;
  
      // Filtrar registros que coincidan con el prefijo de trazabilidad
      const matchingRegistros = registros.filter(
        (registro: { trazabilidad: string }) => registro.trazabilidad.startsWith(prefixTrazabilidad)
      );
  
      let nextConsecutivo = 1;
      if (matchingRegistros.length > 0) {
        const ultimos3Digitos = matchingRegistros.map((registro: { trazabilidad: string }) =>
          parseInt(registro.trazabilidad.slice(-3), 10)
        );
        const maxConsecutivo = Math.max(...ultimos3Digitos);
        nextConsecutivo = maxConsecutivo + 1;
      }
  
      // Verificar si el tipo de producto es 'Bobina'
      if (selectedTipo.toLowerCase() === 'bobina') {
        const piezas = parseInt(camposDinamicos['Piezas'] || '0');
        const trazabilidadesGeneradas = [];
  
        // Generar tantas trazabilidades como piezas, asegurando que el consecutivo sea correcto
        for (let i = 0; i < piezas; i++) {
          const consecutivoStr = (nextConsecutivo + i).toString().padStart(3, '0');  // Consecutivo de 3 dígitos
          const nuevaTrazabilidad = `${prefixTrazabilidad}${consecutivoStr}`;  // Completar la trazabilidad
  
          if (nuevaTrazabilidad.length !== 13) {
            Swal.fire('Error', 'La trazabilidad generada no tiene exactamente 13 dígitos.', 'error');
            return;
          }
  
          trazabilidadesGeneradas.push(nuevaTrazabilidad);
        }
  
        setTrazabilidad(trazabilidadesGeneradas);  // Establecer las trazabilidades generadas
      } else {
        // Para productos diferentes a Bobina, generar solo una trazabilidad
        const consecutivoStr = nextConsecutivo.toString().padStart(3, '0');  // Consecutivo de 3 dígitos
        const trazabilidadUnica = `${prefixTrazabilidad}${consecutivoStr}`;  // Completar la trazabilidad
  
        if (trazabilidadUnica.length !== 13) {
          Swal.fire('Error', 'La trazabilidad generada no tiene exactamente 13 dígitos.', 'error');
          return;
        }
  
        setTrazabilidad([trazabilidadUnica]);  // Solo una trazabilidad
      }
  
    } catch (error) {
      console.error('Error al obtener los registros de trazabilidad:', error);
      Swal.fire('Error', 'Hubo un problema al generar la trazabilidad.', 'error');
    }
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleConfirmEtiqueta = async () => {
    if (!selectedPrinter) {
      Swal.fire({
        icon: 'warning',
        title: 'Impresora no seleccionada',
        text: 'Por favor, selecciona una impresora.',
      });
      return;
    }
  
    if (!selectedProducto || !selectedOperador || !Array.isArray(trazabilidad)) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Por favor, selecciona un producto, operador y genera la trazabilidad.',
      });
      return;
    }
  
    // Formatear la fecha de producción para el envío
    const formattedDate = fechaProduccion ? new Date(fechaProduccion).toISOString() : new Date().toISOString();
  
    // Usar el tipo de producto directamente desde el mapeo y normalizar el texto a minúsculas
    const tipoProductoNormalizado = selectedTipo?.toLowerCase();
  
    let url = '';
    let data: any;
  
    switch (tipoProductoNormalizado) {
      case 'bobina':
        // Impresión múltiple para bobina
        for (let i = 0; i < trazabilidad.length; i++) {
          const codigoBobinaUnico = codigosBobina[i];
          const pesoUnico = parseFloat(pesosBobina[i] || '0');
  
          if (!codigoBobinaUnico || pesoUnico <= 0) {
            Swal.fire('Error', `El código o peso de la bobina ${i + 1} es inválido.`, 'error');
            return;
          }
  
          data = {
            tipoProducto: 'BOBINA',
            claveProducto: selectedProducto.claveProducto.toString(),
            productoNombre: selectedProducto.nombreProducto.toUpperCase(),
            claveOperador: selectedOperador.numNomina,
            medida: camposDinamicos['Medida'] || '',
            calibre: camposDinamicos['Calibre'] || '',
            piezas: numPiezas,
            peso: pesoUnico,
            fechaProduccion: formattedDate,
            codigoBobina: codigoBobinaUnico,
            trazabilidad: trazabilidad[i],
            rfid: `000${trazabilidad[i]}`,
            status: '2',
          };
  
          url = `http://172.16.10.31/api/ProdEtiquetasRFIDMP/bobina?ip=${selectedPrinter.ip}`;
  
          try {
            await axios.post(url, data, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
            Swal.fire('Éxito', `Etiqueta para la bobina ${i + 1} generada correctamente.`, 'success');
          } catch (error) {
            console.error(`Error al generar la etiqueta para la bobina ${i + 1}:`, error);
            Swal.fire('Error', `No se pudo generar la etiqueta para la bobina ${i + 1}.`, 'error');
            return;
          }
        }
        break;
  
      case 'caja':
        data = {
          tipoProducto: 'CAJA',
          claveProducto: selectedProducto.claveProducto.toString(),
          productoNombre: selectedProducto.nombreProducto.toUpperCase(),
          claveOperador: selectedOperador.numNomina,
          tipoCaja: (camposDinamicos['Tipo de Caja'] || '').toUpperCase(), // Ajuste aquí para acceder al campo correcto
          piezas: parseInt(camposDinamicos['Piezas'] || '0'),
          trazabilidad: trazabilidad[0],
          rfid: `000${trazabilidad[0]}`,
          status: '2',
        };
  
        url = `http://172.16.10.31/api/ProdEtiquetasRFIDMP/caja?ip=${selectedPrinter.ip}`;
  
        try {
          console.log('Datos que se envían a la API:', data);  // Añadir log para verificar datos
          await axios.post(url, data, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          Swal.fire('Éxito', `Etiqueta para Caja generada correctamente.`, 'success');
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error('Error al generar la etiqueta para Caja:', error.response?.data || error.message);
          } else {
            console.error('Error desconocido:', error);
          }
          Swal.fire('Error', `No se pudo generar la etiqueta para Caja.`, 'error');
        }
        break;
  
      case 'caja-vaso':
        data = {
          tipoProducto: 'CAJA VASO',
          claveProducto: selectedProducto.claveProducto.toString(),
          productoNombre: selectedProducto.nombreProducto.toUpperCase(),
          claveOperador: selectedOperador.numNomina,
          tipoVaso: (camposDinamicos['Tipo de Vaso'] || '').toUpperCase(), // Ajuste aquí
          piezas: parseInt(camposDinamicos['Piezas'] || '0'),
          trazabilidad: trazabilidad[0],
          rfid: `000${trazabilidad[0]}`,
          status: '2',
        };
  
        url = `http://172.16.10.31/api/ProdEtiquetasRFIDMP/caja-vaso?ip=${selectedPrinter.ip}`;
  
        try {
          await axios.post(url, data, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          Swal.fire('Éxito', `Etiqueta para Caja Vaso generada correctamente.`, 'success');
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error('Error al generar la etiqueta para Caja Vaso:', error.response?.data || error.message);
          } else {
            console.error('Error desconocido:', error);
          }
          Swal.fire('Error', `No se pudo generar la etiqueta para Caja Vaso.`, 'error');
        }
        break;
  
      case 'zipper':
        data = {
          tipoProducto: 'ZIPPER',
          claveProducto: selectedProducto.claveProducto.toString(),
          productoNombre: selectedProducto.nombreProducto.toUpperCase(),
          claveOperador: selectedOperador.numNomina,
          tipoZipper: (camposDinamicos['Tipo de Zipper'] || '').toUpperCase(), // Ajuste aquí para el campo "Tipo de Zipper"
          piezas: parseInt(camposDinamicos['Piezas'] || '0'),
          trazabilidad: trazabilidad[0],
          rfid: `000${trazabilidad[0]}`,
          status: '2',
        };      
  
        url = `http://172.16.10.31/api/ProdEtiquetasRFIDMP/zipper?ip=${selectedPrinter.ip}`;
  
        try {
          await axios.post(url, data, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          Swal.fire('Éxito', `Etiqueta para Zipper generada correctamente.`, 'success');
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error('Error al generar la etiqueta para Zipper:', error.response?.data || error.message);
          } else {
            console.error('Error desconocido:', error);
          }
          Swal.fire('Error', `No se pudo generar la etiqueta para Zipper.`, 'error');
        }
        break;
  
      case 'bobina-cinta':
        data = {
          tipoProducto: 'BOBINA CINTA',
          claveProducto: selectedProducto.claveProducto.toString(),
          productoNombre: selectedProducto.nombreProducto.toUpperCase(),
          claveOperador: selectedOperador.numNomina,
          tipoBobina: (camposDinamicos['Tipo de Bobina'] || '').toUpperCase(), // Ajuste aquí para el campo "Tipo de Bobina"
          piezas: parseInt(camposDinamicos['Piezas'] || '0'),
          trazabilidad: trazabilidad[0],
          rfid: `000${trazabilidad[0]}`,
          status: '2',
        };
  
        url = `http://172.16.10.31/api/ProdEtiquetasRFIDMP/bobina-cinta?ip=${selectedPrinter.ip}`;
  
        try {
          await axios.post(url, data, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          Swal.fire('Éxito', `Etiqueta para Bobina Cinta generada correctamente.`, 'success');
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error('Error al generar la etiqueta para Bobina Cinta:', error.response?.data || error.message);
          } else {
            console.error('Error desconocido:', error);
          }
          Swal.fire('Error', `No se pudo generar la etiqueta para Bobina Cinta.`, 'error');
        }
        break;
  
      default:
        Swal.fire('Error', 'Tipo de producto no encontrado.', 'error');
        return;
    }
  
    handleCloseModal();
  };

  return (
    <div>
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
            <Autocomplete
              value={selectedTipo}
              onChange={(event, newValue) => setSelectedTipo(newValue || null)}
              options={tiposProducto}
              renderInput={(params) => <TextField {...params} label="Tipo de Producto" fullWidth />}
            />

            <Autocomplete
              value={selectedProductoPT} // selectedProductoPT es un objeto Producto
              onChange={(event, newValue) => setSelectedProductoPT(newValue)} // Asignar el objeto Producto seleccionado
              options={productos}
              getOptionLabel={(option) => `${option.claveProducto} - ${option.nombreProducto}`} // Mostrar claveProducto y nombreProducto
              renderInput={(params) => <TextField {...params} label="Código de Producto (PT)" fullWidth />}
            />
            <TextField
              label="Nombre del Producto"
              value={selectedProducto?.nombreProducto || ''} // Aquí se muestra el nombre del producto si está disponible
              fullWidth
              InputProps={{ readOnly: true }} // El campo es de solo lectura
            />

            {/* Cargar campos dinámicos en base al tipo de producto */}
            {selectedTipo && camposMap[selectedTipo]?.map((campo: string) => (
              campo === 'Fecha Producción' ? (
                <TextField
                  key={campo}
                  fullWidth
                  label={campo}
                  type="date"
                  value={fechaProduccion}
                  onChange={(event) => setFechaProduccion(event.target.value)}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              ) : (
                <TextField
                  key={campo}
                  fullWidth
                  label={campo}
                  value={camposDinamicos[campo] || ''}
                  onChange={(event) => handleChangeDinamico(campo, event.target.value)}
                  variant="outlined"
                />
              )
            ))}

            {/* Mostrar los TextFields para los códigos de bobina y pesos */}
            {selectedTipo?.toLowerCase() === 'bobina' && (
              <>
                {Array.from({ length: numPiezas }).map((_, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <TextField
                      label={`Código Bobina ${index + 1}`}
                      value={codigosBobina[index]}
                      onChange={(event) => handleCodigoBobinaChange(index, event.target.value)}
                      fullWidth
                    />
                    <TextField
                      label={`Peso Bobina ${index + 1}`}
                      value={pesosBobina[index]}
                      onChange={(event) => handlePesoBobinaChange(index, event.target.value)}
                      fullWidth
                    />
                  </Box>
                ))}
              </>
            )}

            {/* Autocomplete para Operador */}
            <Autocomplete
              value={selectedOperador}
              onChange={(event, newValue) => setSelectedOperador(newValue || null)}
              options={operadores}
              getOptionLabel={(option) => `${option.numNomina} - ${option.nombreCompleto}`}
              renderInput={(params) => <TextField {...params} label="Operador" fullWidth />}
            />
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
        style={{zIndex: 1050}}
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
            <Typography variant="h6">Vista Previa de la Bobina {bobinaActual + 1}</Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box className="mp-modal-body">
            <Typography><strong>Producto:</strong> {selectedProducto?.nombreProducto}</Typography>
            <Typography><strong>Código Bobina:</strong> {codigosBobina[bobinaActual]}</Typography>
            <Typography><strong>Peso Bobina:</strong> {pesosBobina[bobinaActual]}</Typography>
            {fechaProduccion && (
              <Typography><strong>Fecha de Producción:</strong> {fechaProduccion}</Typography>
            )}
            <Typography><strong>Trazabilidad:</strong> {trazabilidad}</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />

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
                sx={{ width: '38%' }}
              />
            )}
            sx={{ width: '100%', maxWidth: '600px' }}
          />

            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmEtiqueta}
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