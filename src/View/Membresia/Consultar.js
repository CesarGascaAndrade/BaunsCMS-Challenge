import React, { Component } from 'react';

import {
    Container,
    Row,
    Col,
    Spinner,
    Alert,
    Table,
    Button,
    Modal,
    Form
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';

import { NotificationContainer, NotificationManager } from 'react-notifications';


import Header from '../Layout/default/header';
import Footer from '../Layout/default/footer';

import { QrReader } from 'react-qr-reader';

import withNavigation from '../common/withNavigation';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import config from '../../config/core';
import cookieman from '../common/cookieman';
import LoadingOverlay from '../common/loadingOverlay';

class Consultar extends Component {
    state = {
        loading: true,
        error: null,
        membresia: null,
        showPuntosModal: false,
        showRedimirPuntosModal: false,
        importe: 0,
        puntos: 0,
        descripcion: ''
    };

    componentDidMount() {

        if (this.state.loading) {
            this.loadMembresiaInfo();
        }
    }

    handleShowModal(show) {
        this.setState({
            ...this.state,
            showPuntosModal: show
        });
    }

    handleShowRedimirPuntosModal(show) {
        this.setState({
            ...this.state,
            showRedimirPuntosModal: show
        });
    }

    loadMembresiaInfo() {
        const url = config.backend + '/membresias/consultar/' + this.props.params.membresia_uuid;
        axios({
            url: url,
            type: 'get',
            headers: {
                token: cookieman.getItem('token')
            },
        }).then(result => {
            console.log(result.data);
            if (result.data.success) {
                this.setState({
                    ...this.state,
                    membresia: result.data.data
                });
            }
            else {
                this.setState({
                    ...this.state,
                    error: result.data.msg
                });
            }
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            this.setState({
                ...this.state,
                loading: false
            });
        });
    }

    abonarPuntos() {
        const url = config.backend + '/membresias/abonar_puntos';
        axios({
            url: url,
            method: 'post',
            headers: {
                token: cookieman.getItem('token')
            },
            data: {
                membresia_uuid: this.props.params.membresia_uuid,
                importe: this.state.importe,
                descripcion: this.state.descripcion
            }
        }).then(response => {
            console.log('abonar puntos', response.data);
            if (response.data.success) {
                this.handleShowModal(false);
                //NotificationManager.success('Bonificación registrada exitosamente','Bonificación exitosa');
                this.setState({
                    ...this.state,
                    loading: true
                });

                setTimeout(() => {
                    this.loadMembresiaInfo();

                }, 500);
               
            }
            else {
                NotificationManager.error(response.data.msg, 'Error en el registro de la bonificacion');
            }
        }).catch(error => {
            NotificationManager.error(error, 'Error en el registro de la bonifición');
        }).finally(() => {

        });
    }

    redimirPuntos() {
        const url = config.backend + '/membresias/redimir_puntos';
        axios({
            url: url,
            method: 'post',
            headers: {
                token: cookieman.getItem('token')
            },
            data: {
                membresia_uuid: this.props.params.membresia_uuid,
                puntos: this.state.puntos,
                descripcion: this.state.descripcion
            }
        }).then(response => {
            if (response.data.success) {
                this.handleShowRedimirPuntosModal(false);
                //NotificationManager.success('Bonificación registrada exitosamente','Bonificación exitosa');
                this.setState({
                    ...this.state,
                    loading: true
                });
                setTimeout(() => {
                    this.loadMembresiaInfo();
                }, 500);

            }
            else {
                NotificationManager.error(response.data.msg, 'Error al redimir puntos');
            }
        }).catch(error => {
            NotificationManager.error(error, 'Error al redimir puntos');
        }).finally(() => {

        });
    }

    render() {
        let vigencia_desde = new Date();
        let vigencia_hasta = new Date();

        if (this.state.membresia !== null) {
            vigencia_desde = new Date(this.state.membresia.vigencia_desde);
            vigencia_hasta = new Date(this.state.membresia.vigencia_hasta);

        }

        const ahora = new Date();

        const vigente = ahora.getTime() < vigencia_hasta.getTime();

        return (
            <>
                {this.state.loading ? <LoadingOverlay /> : null}
                <Header />
                <Container style={{ minHeight: '600px' }}>
                    <Row>
                        <Col>
                            <h1 className="text-center">{this.state.loading ? <Spinner /> : this.state.membresia.nombre}</h1>
                            <h2 className="text-center">Datos de la membresia</h2>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col md={6} sm={12}>
                            <Table striped bordered hover>
                                <tbody>
                                    <tr>
                                        <th>Cliente</th>
                                        <td>
                                            {
                                                this.state.loading ? <Spinner variant="primary" /> : <>{this.state.membresia.cliente_nombre} {this.state.membresia.cliente_primer_apellido} {this.state.membresia.cliente_segundo_apellido}</>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Correo</th>
                                        <td>
                                            {
                                                this.state.loading ? <Spinner variant="primary" /> : this.state.membresia.cliente_correo
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Telefono</th>
                                        <td>
                                            {
                                                this.state.loading ? <Spinner variant="primary" /> : this.state.membresia.cliente_telefono
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Precio</th>
                                        <td>
                                            {
                                                this.state.loading ? <Spinner variant="primary" /> : "$" + this.state.membresia.precio
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Puntos</th>
                                        <td>
                                            {
                                                this.state.loading ? <Spinner variant="primary" /> : this.state.membresia.puntos
                                            }
                                            <Button className="float-end" variant="success" disabled={!vigente} title={vigente ? 'Abonar puntos' : 'Membresía fuera de vigencia'} style={{ marginBottom: 0, marginLeft: '15px' }} onClick={() => {
                                                this.handleShowModal(true);
                                            }}>
                                                <FontAwesomeIcon icon={faCirclePlus} />
                                            </Button>
                                            <Button className="float-end" variant="warning" disabled={!vigente} title={vigente ? 'Redimir puntos' : 'Membresía fuera de vigencia'} style={{ marginBottom: 0 }} onClick={() => {
                                                this.handleShowRedimirPuntosModal(true);
                                            }}>
                                                <FontAwesomeIcon icon={faHandHoldingDollar} />
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Vigencia</th>
                                        <td>
                                            {
                                                this.state.loading ? <Spinner variant="primary" /> :
                                                    <>
                                                        {vigencia_desde.toLocaleDateString()} hasta {vigencia_hasta.toLocaleDateString()}
                                                    </>
                                            }
                                        </td>
                                    </tr>

                                </tbody>
                            </Table>
                        </Col>
                        <Col md={6} sm={12}>
                            <p>Beneficios</p>
                            {
                                this.state.loading ? <Spinner /> :
                                    this.state.membresia.beneficios.length < 1 ?
                                        <p className="text-center">No se han reclamado beneficios</p> :
                                        this.state.membresia.beneficios.map((beneficio, i) => {
                                            return (
                                                <p key={i}>{beneficio.descripcion}</p>
                                            );
                                        })
                            }
                        </Col>
                    </Row>
                </Container>
                <Footer />
                <Modal show={this.state.showPuntosModal} onHide={() => {
                    this.handleShowModal(false)
                }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Registrar puntos</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Importe</Form.Label>
                                <Form.Control type="number" placeholder="¿Cuánto fué?" onChange={(event) => {
                                    this.setState({
                                        ...this.state,
                                        importe: event.target.value
                                    });
                                }} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control as="textarea" rows={3} onKeyUp={(event) => {
                                    this.setState({
                                        ...this.state,
                                        descripcion: event.target.value
                                    });
                                }} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            this.handleShowModal(false)
                        }}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={() => {
                            this.abonarPuntos();
                        }}>
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showRedimirPuntosModal} onHide={() => {
                    this.handleShowRedimirPuntosModal(false)
                }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Redimir puntos</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Cantidad</Form.Label>
                                <Form.Control type="number" placeholder="¿Cuántos puntos?" onChange={(event) => {
                                    this.setState({
                                        ...this.state,
                                        puntos: event.target.value
                                    });
                                }} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control as="textarea" rows={3} onKeyUp={(event) => {
                                    this.setState({
                                        ...this.state,
                                        descripcion: event.target.value
                                    });
                                }} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            this.handleShowRedimirPuntosModal(false)
                        }}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={() => {
                            this.redimirPuntos();
                        }}>
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Modal>
                <NotificationContainer />
            </>
        );
    }
}

export default withNavigation(Consultar);