import React, { Component } from 'react';

import {
    Container,
    Row,
    Col,
    Card,
    Form,
    FloatingLabel
} from 'react-bootstrap';

import  { Navigate } from 'react-router-dom';

import Button from '../common/Form/Button';

import { NotificationContainer, NotificationManager } from 'react-notifications';

import axios from 'axios';

import config from '../../config/core';

import cookieman from '../common/cookieman';

import Header from '../Layout/default/header';
import Footer from '../Layout/simple/footer';

import LoadingOverlay from '../common/loadingOverlay';


class Login extends Component {

    state = {
        email: '',
        password: '',
        loading: true,
        redirect: null
    }

    componentDidMount() {
        // validar existencia de token
        if (cookieman.checkItem('token')) {
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

    setLoading = (loading) => {
        const newState = { ...this.state };

        this.setState({
            ...newState,
            loading: loading
        });
    }

    sendLogin = (email, password) => {
        const url = config.backend + '/login';

        axios.post(url, {
            email: email,
            password: password
        }).then(response => {
            cookieman.setItem('token', response.data.token);
            cookieman.setItem('user.name', response.data.user.name);
            cookieman.setItem('user.email', response.data.user.email);

            this.setState({
                ...this.state,
                redirect: (<Navigate to="/home" />)
            });

        }).catch(error => {
            NotificationManager.error(error.response.data.error, error.name);
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
                                <h2 className="text-center">Sing In</h2>
                            </Card.Title>
                            <Card.Body>
                                <Form>
                                    <Form.Group className="mb-3" controlId="FormCorreo">
                                        <FloatingLabel controlId="Email" label="Email" className="mb-3">
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
                                    <div className="d-grid gap-2">
                                        <Button variant="red" disables={this.loading} type="button" size="lg" onClick={() => {
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

        return (<>
            {this.state.loading ? <LoadingOverlay /> : null}
            {this.state.redirect}
            <Header />
            {login_form}
            <NotificationContainer />
            <Footer />
        </>);
    }

}



export default Login;