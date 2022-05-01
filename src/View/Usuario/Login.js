import React, { Component } from 'react';

import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    FloatingLabel,
    Alert
} from 'react-bootstrap';

import axios from 'axios';

import config from '../../config/core';

import cookieman from '../common/cookieman';

import Header from '../Layout/default/header';
import Footer from '../Layout/simple/footer';



class Login extends Component {

    state = {
        email: '',
        password: '',
        verification_code: '',
        loading: true,
        loading_confirmacion: false,
        error: false,
        step: 1
    }
    
    componentDidMount() {
        // validar existencia de token
        if(cookieman.checkItem('token')) {
            window.location.href = 'home';
        }

        this.setState({
            ...this.state,
            loading: false
        });
    }


    setEmail = (email) => {
        const newState = { ...this.state };

        this.setState({
            ...newState,
            email: email
        });
    }

    setPassword = (password) => {
        const newState = { ...this.state };

        this.setState({
            ...newState,
            password: password
        });
    }

    setVerificationCode = (verification_code) => {
        const newState = { ...this.state };

        this.setState({
            ...newState,
            verification_code: verification_code
        });
    }

    setLoading = (loading) => {
        const newState = { ...this.state };

        this.setState({
            ...newState,
            loading: loading
        });
    }

    setError = (error) => {
        const newState = { ...this.state };

        this.setState({
            ...newState,
            error: error
        });
    }

    sendLogin = (email, password) => {
        const url = config.backend + '/usuarios/login';

        axios.post(url, {
            email: email,
            passwrd: password
        }).then(response => {

            this.setLoading(false);
            if (response.data.success) {
                const newState = { ...this.state };

                this.setState({
                    ...newState,
                    step: 2,
                    loading_confirmacion: false
                });
            }
            else {
                const newState = { ...this.state };

                this.setState({
                    ...newState,
                    error: true,
                    loading_confirmacion: false
                });
            }
        }).catch(error => {
            this.setLoading(false);
        });
    }

    sendLoginConfirmation = (verification_code) => {
        const url = config.backend + '/usuarios/confirm_login';

        axios.post(url, {
            email: this.state.email,
            passwrd: this.state.password,
            verification_code: verification_code
        }).then(response => {
            console.log(response.data);
            if(response.data.success) {
                //this.setLoading(false);
                cookieman.setItem('token', response.data.data)
                window.location.href = '/home';
            }
        }).catch(error => {
            this.setLoading(false);
        });
    }

    render() {

        const login_form = (
            <Container id="Step1">
                <Row className="justify-content-md-center">
                    <Col>
                        <h1 className="text-center">&nbsp;</h1>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col lg={4} sm={12}>
                        <Card className="m1">
                            <Card.Title className="mt-3 mb-3">
                                <h2 className="text-center">Inicio de sesión</h2>
                            </Card.Title>
                            <Card.Body>
                                <Form>
                                    <Form.Group className="mb-3" controlId="FormCorreo">
                                        <FloatingLabel controlId="Correo" label="Correo" className="mb-3">
                                            <Form.Control type="email" disabled={this.loading} placeholder="name@example.com" onChange={(e) => {
                                                this.setEmail(e.target.value);
                                            }} />
                                        </FloatingLabel>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="FormPassword">
                                        <FloatingLabel controlId="Password" label="Password">
                                            <Form.Control type="password" disabled={this.loading} placeholder="Password" onChange={e => {
                                                this.setPassword(e.target.value);
                                            }} />
                                        </FloatingLabel>
                                    </Form.Group>
                                    {
                                        (this.state.error) ? (
                                            <Alert variant="danger" >
                                                <Alert.Heading>Error! Verifica tus datos</Alert.Heading>
                                                <p>
                                                    Usuario o contraseña incorrectos
                                                </p>
                                            </Alert>
                                        ) : null
                                    }
                                    <div className="d-grid gap-2">

                                        <Button variant="primary" disables={this.loading} type="button" size="lg" onClick={() => {
                                            //setLoading(true);
                                            this.sendLogin(this.state.email, this.state.password);
                                        }}>
                                            {this.loading ? 'Enviando' : 'Iniciar Sesión'}
                                        </Button>

                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );

        const confirm_login_form = (
            <Container id="Step2">
                <Row className="justify-content-md-center">
                    <Col>
                        <h1 className="text-center">Superks</h1>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col lg={4} sm={12}>
                        <Card className="m1">
                            <Card.Title className="mt-3 mb-3">
                                <h2 className="text-center">Código de confirmación</h2>
                            </Card.Title>
                            <Card.Body>
                                <p>
                                    Hemos enviado un código de confirmación a XXXXX. Ingrésalo a continuación para continuar:
                                </p>
                                <p>¿No recibiste tu código? <span onClick={() => {
                                    this.setState({
                                        ...this.state,
                                        loading_confirmacion: true
                                    });
                                    this.sendLogin(this.state.email, this.state.password);
                                }}>Enviar nuevamente</span></p>
                                <Form>
                                    <Form.Group className="mb-3" controlId="FormVerificationCode">
                                        <FloatingLabel controlId="VerificationCode" label="Código de confirmación" className="mb-3">
                                            <Form.Control type="text" disabled={this.loading} placeholder="XXXXXX" onChange={(e) => {
                                                this.setVerificationCode(e.target.value);
                                            }} />
                                        </FloatingLabel>
                                    </Form.Group>
                                    <div className="d-grid gap-2">

                                        <Button variant="primary" disables={this.loading} type="button" size="lg" onClick={() => {
                                            //setLoading(true);
                                            this.sendLoginConfirmation(this.state.verification_code);
                                        }}>
                                            {this.loading ? 'Enviando' : 'Confirmar'}
                                        </Button>

                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );


        return (<>
            <Header />
            {this.state.step === 1 ? login_form : confirm_login_form}
            <Footer />
        </>);
    }

}



export default Login;