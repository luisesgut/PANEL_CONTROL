import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.scss';
import { Login } from './pages/login/Login';
import { Dashboard } from './pages/dashboard/Dashboard';
import NavBar from './components/navbar/NavBar';
import ModulosCatalogo from './pages/catalogo/moduloscatalgo/ModulosCatalogo';
import EtiquetadoBFX_produccion from './pages/impresion/impresion produccion/etiquetadobfx_produccion/EtiquetadoBFX__produccion';
import EtiquetadoDestiny_produccion from './pages/impresion/impresion produccion/etiquetadodestiny_produccion/EtiquetadoDestiny_produccion';
import EtiquetadoQuality_produccion from './pages/impresion/impresion produccion/etiquetadoquality_produccion/EtiquetadoQuality_produccion';
import EtiquetadoVaso_produccion from './pages/impresion/impresion produccion/etiquetadoVaso_produccion/EtiquetadoVaso_produccion';
import ModulosImpresion_produccion from './pages/impresion/impresion produccion/modulosimpresion_produccion/ModulosImpresion_produccion';
import ProductoBioflex from './pages/catalogo/catalogobfx/CatalogoBFX';
import ProductoDestiny from './pages/catalogo/catalogodestiny/CatalogoDestiny';
import Area from './pages/catalogo/catalogoarea/CatalogoArea';
import Maquina from './pages/catalogo/catalogomaquina/CatalogoMaquina';
import Operadores from './pages/catalogo/catalogooperador/CatalogoOperador';
import Turno from './pages/catalogo/catalogoturno/CatalgoTurno';
import Ordenes from './pages/catalogo/catalogoordenes/CatalogoOrdenes';
import ProductoQuality from './pages/catalogo/catalogoquality/CatalogoQuality';

import Footer from './components/footer/Footer';
import CatalogoVaso from './pages/catalogo/catalogovaso/CatalogoVaso';
import MoudulosConsultas from './pages/impresion/reentarimado/modulos-reentarimado/MoudulosReentarimado';
import ConsultaBFX from './pages/consultas/consultasbfx/ConsultaBFX';
import ConsultaDestiny from './pages/consultas/consultasdestiny/ConsultaDestiny';
import ConsultaQuality from './pages/consultas/consultasquality/ConsultaQuality';
import ConsultaVaso from './pages/consultas/consultasvaso/ConsultaVaso';
import ReentarimadoBFX from './pages/impresion/reentarimado/reentarimado-bfx/reentarimado-bfx';
import MoudulosReentarimado from './pages/impresion/reentarimado/modulos-reentarimado/MoudulosReentarimado';
import ModulosImpresion from './pages/impresion/modulosimpresion/ModulosImpresion';
import ModulosRegistros from './pages/registros/modulosregistros/ModulosRegistros';
import RegistroInsumos from './pages/registros/registroinsumos/RegistroInsumos';
import RegistroInventarios from './pages/registros/registroinventario/RegistroInventarios';
import ImpresionMP from './pages/impresion/impresionmp/ImpresionMP';



const Entradas = () => <div>Entradas</div>;
const Salidas = () => <div>Salidas</div>;
const Ubicacion = () => <div>Ubicación</div>;
const Antenas = () => <div>Antenas</div>;
const ReentarimadoDestiny = () => <div>Reentarimado Destiny</div>;
const ReentarimadoQuality = () => <div>Reentarimado Quality</div>;
const ReentarimadoVaso = () => <div>Reentarimado Vaso</div>;

function App() {
  return (
    <Router>
      <div className="App">
        <div className='nav-bar'>
          <NavBar />
        </div>
        <div className="container-dashboard">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/entradas" element={<Entradas />} />
            <Route path="/ImpresionMP" element={<ImpresionMP />} />
            <Route path="/salidas" element={<Salidas />} />
            <Route path="/ubicacion" element={<Ubicacion />} />
            <Route path="/consultas" element={<MoudulosConsultas />} />
            <Route path="/consultaBFX" element={<ConsultaBFX />} />
            <Route path="/consultaDestiny" element={<ConsultaDestiny />} />
            <Route path="/consultaQuality" element={<ConsultaQuality />} />
            <Route path="/consultaVaso" element={<ConsultaVaso />} />
            <Route path="/Reentarimado" element={<MoudulosReentarimado />} />
            <Route path="/ModulosImpresion" element={<ModulosImpresion />} />
            <Route path="/reentarimadoBFX" element={<ReentarimadoBFX />} />
            <Route path="/reentarimadoDestiny" element={<ReentarimadoDestiny />} />
            <Route path="/reentarimadoQuality" element={<ReentarimadoQuality />} />
            <Route path="/reentarimadoVaso" element={<ReentarimadoVaso />} />
            <Route path="/ModulosRegistros" element={<ModulosRegistros />} />
            <Route path="/Insumos" element={<RegistroInsumos/>} />
            <Route path="/Inventario" element={<RegistroInventarios/>} />
            <Route path="/antenas" element={<Antenas />} />
            <Route path="/catalogos" element={<ModulosCatalogo />} />
            <Route path="/catalogoBioflex" element={<ProductoBioflex />} />
            <Route path="/catalogoDestiny" element={<ProductoDestiny />} />
            <Route path="/catalogoQuality" element={<ProductoQuality />} />
            <Route path="/catalogoVaso" element={<CatalogoVaso />} />
            <Route path="/catalogoArea" element={<Area />} />
            <Route path="/catalogoMaquina" element={<Maquina />} />
            <Route path="/catalogoOperadores" element={<Operadores />} />
            <Route path="/catalogoTurno" element={<Turno />} />
            <Route path='/catalogoOrdenes' element={<Ordenes />}/>
            <Route path="/ImpresionPT" element={<ModulosImpresion_produccion />} />
            <Route path="/ImpresionTarimaBFX" element={<EtiquetadoBFX_produccion />} />
            <Route path="/ImpresionTarimaDestiny" element={<EtiquetadoDestiny_produccion />} />
            <Route path="/ImpresionTarimaQuality" element={<EtiquetadoQuality_produccion />} />
            <Route path="/ImpresionTarimaVaso" element={<EtiquetadoVaso_produccion />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
