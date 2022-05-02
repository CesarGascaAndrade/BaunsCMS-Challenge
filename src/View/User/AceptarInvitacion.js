import React, { Component } from 'react';

import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    FloatingLabel,
    Spinner
} from 'react-bootstrap';

import { validate } from 'validate.js';
import jwt_decode from 'jwt-decode';

import axios from 'axios';

import { NotificationContainer, NotificationManager } from 'react-notifications';

import config from '../../config/core';
import cookieman from '../common/cookieman';

import Header from '../Layout/default/header';
import Footer from '../Layout/default/footer';

import withNavigation from '../common/withNavigation';
import loadingOverlay from '../common/loadingOverlay';

class AceptarInvitacion extends Component {
    state = {
        fields: {
            correo: {
                value: '',
                isInvalid: false,
                error: null
            },
            nombre_negocio: {
                value: '',
                isInvalid: false,
                error: null
            },
            nombre: {
                value: '',
                isInvalid: false,
                error: null
            },
            primer_apellido: {
                value: '',
                isInvalid: false,
                error: null
            },
            segundo_apellido: {
                value: '',
                isInvalid: false,
                error: null
            },
            telefono: {
                value: '',
                isInvalid: false,
                error: null
            },
            password: {
                value: '',
                isInvalid: false,
                error: null
            },
            confirm_password: {
                value: '',
                isInvalid: false,
                error: null
            },
        },
        loading: false,
    }

    formConstraints = {
        nombre_negocio: {
            presence: {
                allowEmpty: false
            },
            format: /[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+/,
            length: {
                minimum: 3,
                maximum: 45
            }
        },
        nombre: {
            presence: {
                allowEmpty: false
            },
            format: /[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+/,
            length: {
                minimum: 3,
                maximum: 45
            }
        },
        primer_apellido: {
            presence: {
                allowEmpty: false
            },
            format: /[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*/,
            length: {
                minimum: 3,
                maximum: 45
            }
        },
        segundo_apellido: {
            presence: {
                allowEmpty: false
            },
            format: /[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*/,
            length: {
                minimum: 3,
                maximum: 45
            }
        },
        telefono: {
            presence: {
                allowEmpty: false
            },
            format: /[0-9]*/,
            length: {
                minimum: 10,
                maximum: 10
            }
        },
        password: {
            presence: {
                allowEmpty: false
            },
            length: {
                minimum: 8,
                maximum: 45
            }
        },
        confirm_password: {
            presence: {
                allowEmpty: false
            },
            equality: 'password'
        }
    };

    componentDidMount() {
        const decoded_token = jwt_decode(this.props.searchParams[0].get('t'));

        const newState = { ...this.state };

        const objectKeys = Object.keys(decoded_token);

        objectKeys.forEach(key => {
            if (typeof newState.fields[key] !== 'undefined') newState.fields[key].value = decoded_token[key];
        });


        this.setState(newState);
    }


    setField = (field, value) => {
        const newState = { ...this.state };
        newState.fields[field].value = value;

        this.setState(newState);
    }

    setData = (data) => {
        const newState = {
            ...this.state,
            ...data
        };

        this.setState(newState);
    }

    validateField = (field) => {
        const constraint = {};

        constraint[field] = this.formConstraints[field];

        const data = {};

        data[field] = this.state.fields[field].value;

        if (typeof this.formConstraints[field].equality !== 'undefined') {
            data[this.formConstraints[field].equality] = this.state.fields[this.formConstraints[field].equality].value;
        }

        const validacion = validate(data, constraint);

        const newState = { ...this.state };

        if (typeof validacion !== 'undefined') {

            newState.fields[field].isInvalid = true;
            newState.fields[field].error = (
                <ul>
                    {
                        validacion[field].map(error => {
                            return (<li>{error}</li>);
                        })
                    }
                </ul>
            );

        }
        else {
            newState.fields[field].isInvalid = false;
            newState.fields[field].error = null;

        }
        this.setState(newState);
    }

    sendConfirmacion = () => {
        // validar formulario

        const data = {
            nombre_negocio: this.state.fields.nombre_negocio.value,
            nombre: this.state.fields.nombre.value,
            primer_apellido: this.state.fields.primer_apellido.value,
            segundo_apellido: this.state.fields.segundo_apellido.value,
            telefono: this.state.fields.telefono.value,
            password: this.state.fields.password.value,
            confirm_password: this.state.fields.confirm_password.value
        };

        const validation = validate(data, this.formConstraints);

        if (typeof validation !== 'undefined') {
            // notificar errores 
            Object.keys(data).forEach(field => {
                this.validateField(field);
            });
        }
        else {
            const url = config.backend + '/usuarios/aceptar_invitacion';
            this.setData('loading', true);
            axios.post(url, {
                token: this.props.searchParams[0].get('t'),
                nombre_negocio: this.state.fields.nombre_negocio.value,
                nombre: this.state.fields.nombre.value,
                primer_apellido: this.state.fields.primer_apellido.value,
                segundo_apellido: this.state.fields.segundo_apellido.value,
                telefono: this.state.fields.telefono.value,
                password: this.state.fields.password.value,
                confirm_password: this.state.fields.confirm_password.value,
            }, {
                headers: {
                    token: this.props.searchParams[0].get('t'),
                }
            }).then(response => {


                if (response.data.success) {
                    console.log(response.data);
                    cookieman.setItem('token', response.data.data)

                    window.location.href = '/home';
                }
                else {
                    const newState = { ...this.state };

                    this.setData({
                        ...newState,
                        error: true,
                        loading: false
                    });

                    NotificationManager.error(response.data.msg);
                }
            }).catch(error => {
                this.setData('loading', true);
            });


        }

    }

    render() {
        const login_form = (
            <>
                {this.state.loading ? loadingOverlay() : null}
                <Container id="Step1">
                    <Row className="justify-content-md-center">
                        <Col lg={4} sm={12}>
                            <Card className="m1">
                                <Card.Title className="mt-3 mb-3">
                                    <h2 className="text-center">Aceptar Invitación</h2>
                                </Card.Title>
                                <Card.Body>
                                    <Form>
                                        <Form.Group className="mb-3" controlId="FormNegocio">
                                            <FloatingLabel controlId="NombreNegocio" label="Nombre de tu Negocio" className="mb-3">
                                                <Form.Control
                                                    type="text"
                                                    isInvalid={this.state.fields.nombre_negocio.isInvalid}
                                                    disabled={this.loading}
                                                    placeholder="Negocio"
                                                    value={this.state.fields.nombre_negocio.value}
                                                    onChange={(e) => {
                                                        this.setField('nombre_negocio', e.target.value);
                                                        if (this.state.fields.nombre_negocio.isInvalid) {
                                                            this.validateField('nombre_negocio');
                                                        }
                                                    }}
                                                    onBlur={() => {
                                                        this.validateField('nombre_negocio');
                                                    }} />
                                                <Form.Control.Feedback type="invalid">{this.state.fields.nombre.error}</Form.Control.Feedback>
                                            </FloatingLabel>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="FormNombre">
                                            <FloatingLabel controlId="Nombre" label="Nombre" className="mb-3">
                                                <Form.Control
                                                    type="text"
                                                    isInvalid={this.state.fields.nombre.isInvalid}
                                                    disabled={this.loading}
                                                    placeholder="Nombre(s)"
                                                    value={this.state.fields.nombre.value}
                                                    onChange={(e) => {
                                                        this.setField('nombre', e.target.value);
                                                        if (this.state.fields.nombre.isInvalid) {
                                                            this.validateField('nombre');
                                                        }
                                                    }}
                                                    onBlur={() => {
                                                        this.validateField('nombre');
                                                    }} />
                                                <Form.Control.Feedback type="invalid">{this.state.fields.nombre.error}</Form.Control.Feedback>
                                            </FloatingLabel>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="PrimerApellido">
                                            <FloatingLabel controlId="PrimerApellido" label="Primer Apellido" className="mb-3">
                                                <Form.Control
                                                    type="text"
                                                    isInvalid={this.state.fields.primer_apellido.isInvalid}
                                                    disabled={this.loading}
                                                    placeholder="Primer Apellido"
                                                    value={this.state.fields.primer_apellido.value}
                                                    onChange={(e) => {
                                                        this.setField('primer_apellido', e.target.value);
                                                        if (this.state.fields.nombre.isInvalid) {
                                                            this.validateField('primer_apellido');
                                                        }
                                                    }}
                                                    onBlur={() => {
                                                        this.validateField('primer_apellido');
                                                    }} />
                                                <Form.Control.Feedback type="invalid">{this.state.fields.primer_apellido.error}</Form.Control.Feedback>
                                            </FloatingLabel>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="SegundoApellido">
                                            <FloatingLabel controlId="SegundoApellido" label="Segundo Apellido" className="mb-3">
                                                <Form.Control
                                                    type="text"
                                                    isInvalid={this.state.fields.segundo_apellido.isInvalid}
                                                    disabled={this.loading}
                                                    placeholder="Segundo Apellido"
                                                    value={this.state.fields.segundo_apellido.value}
                                                    onChange={(e) => {
                                                        this.setField('segundo_apellido', e.target.value);

                                                        if (this.state.fields.nombre.isInvalid) {
                                                            this.validateField('segundo_apellido');
                                                        }
                                                    }}
                                                    onBlur={() => {
                                                        this.validateField('segundo_apellido');
                                                    }} />
                                                <Form.Control.Feedback type="invalid">{this.state.fields.segundo_apellido.error}</Form.Control.Feedback>
                                            </FloatingLabel>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="Telefono">
                                            <FloatingLabel controlId="Telefono" label="Teléfono" className="mb-3">
                                                <Form.Control
                                                    type="text"
                                                    isInvalid={this.state.fields.telefono.isInvalid}
                                                    disabled={this.loading}
                                                    placeholder="Teléfono"
                                                    value={this.state.fields.telefono.value}
                                                    onChange={(e) => {
                                                        this.setField('telefono', e.target.value);

                                                        if (this.state.fields.nombre.isInvalid) {
                                                            this.validateField('telefono');
                                                        }
                                                    }}
                                                    onBlur={() => {
                                                        this.validateField('telefono');
                                                    }} />
                                                <Form.Control.Feedback type="invalid">{this.state.fields.telefono.error}</Form.Control.Feedback>
                                            </FloatingLabel>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="FormPassword">
                                            <FloatingLabel controlId="Password" label="Contraseña">
                                                <Form.Control
                                                    type="password"
                                                    isInvalid={this.state.fields.password.isInvalid}
                                                    disabled={this.loading}
                                                    placeholder="Contraseña"
                                                    onChange={e => {
                                                        this.setField('password', e.target.value);

                                                        if (this.state.fields.nombre.isInvalid) {
                                                            this.validateField('password');
                                                        }
                                                    }}
                                                    onBlur={() => {
                                                        this.validateField('password');
                                                    }} />
                                                <Form.Control.Feedback type="invalid">{this.state.fields.password.error}</Form.Control.Feedback>
                                            </FloatingLabel>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="FormConfirmPassword">
                                            <FloatingLabel controlId="ConfirmPassword" label="Confirmar Contraseña">
                                                <Form.Control
                                                    type="password"
                                                    isInvalid={this.state.fields.confirm_password.isInvalid}
                                                    disabled={this.loading}
                                                    placeholder="Confirmar Contraseña"
                                                    onChange={e => {
                                                        this.setField('confirm_password', e.target.value);

                                                        if (this.state.fields.nombre.isInvalid) {
                                                            this.validateField('confirm_password');
                                                        }
                                                    }}
                                                    onBlur={() => {
                                                        this.validateField('confirm_password');
                                                    }} />
                                                <Form.Control.Feedback type="invalid">{this.state.fields.confirm_password.error}</Form.Control.Feedback>
                                            </FloatingLabel>
                                        </Form.Group>
                                        <div className="d-grid gap-2">
                                            <Button variant="primary" disabled={this.loading} type="button" size="lg" onClick={() => {
                                                this.sendConfirmacion();
                                            }}>
                                                {this.loading ? (<Spinner animation="border" variant="light" />) : 'Continuar'}
                                            </Button>

                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
                <NotificationContainer />
            </>
        );

        return (<>
            <Header />
            {login_form}
            <Footer />
        </>);
    }

}

export default withNavigation(AceptarInvitacion);