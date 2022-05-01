//import logo from './logo.svg';
import './App.css';

import React from 'react';
import 'react-bootstrap';

import 'react-notifications/lib/notifications.css';

import Index from './View/Index/index';
import Home from './View/Home/index';
import Login from './View/Usuario/Login';
import Logout from './View/Usuario/Logout';
import AceptarInvitacion from './View/Usuario/AceptarInvitacion';

import MembresiaEmitirQr from './View/Membresia/Emitir/Qr';
import MembresiaLeerQr from './View/Membresia/LeerQr';
import MembresiaConsultar from './View/Membresia/Consultar';
import MembresiaForm from './View/Membresia/Formulario';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/home" element={<Home />} />
        <Route path="/aceptar_invitacion" element={<AceptarInvitacion />} />
        
        <Route path="/membresia/emitir/qr/:membresia" element={<MembresiaEmitirQr/>} />
        <Route path="/membresia/leer_qr" element={<MembresiaLeerQr/>} />
        <Route path="/membresia/:membresia_uuid" element={<MembresiaConsultar/>} />
        <Route path="/membresia/:membresia_uuid/editar" element={<MembresiaForm/>} />
        <Route path="/membresia/nuevo" element={<MembresiaForm/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
