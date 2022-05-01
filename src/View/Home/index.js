import React, { Component } from 'react';

import {
    Container,
    Row,
    Col,
    Card,
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';

import config from '../../config/core';
import cookieman from '../common/cookieman';

import Header from '../Layout/default/header';
import Footer from '../Layout/default/footer';

import CardMembresia from '../Elements/CardMembresia';

import loadingOverlay from '../common/loadingOverlay';

class Home extends Component {
    state = {
        loading: true,
        usuario: null,
        membresias: [],
    };

    componentDidMount() {
        if(!cookieman.checkItem('token')) {
            return window.location.href = '/login';
        }
        
        const url_membresias = config.backend + '/catmembresias';
        
        axios.get(url_membresias, {
            headers: {
                token: cookieman.getItem('token')
            }
        }).then(response => {
            if (response.data.success) {
                this.setState({
                    ...this.state,
                    membresias: response.data.data,
                }); 
            }
            else {
                
            }
        }).catch(error => {
            console.log('error', error);
        }).finally(() => {
            this.setState({
                ...this.state,
                loading: false
            });
        });

    }

    closeModalInvitarCliente() {
        this.setState({
            ...this.state,
            showModalInvitarCliente: false
        });
    }

    componentDidCatch(e) {
        console.log(e);
    }

    render() {

        if (this.state.loading) {
            return (loadingOverlay());
        }

        const membresias_cards = [];

        this.state.membresias.forEach(membresia => {
            membresias_cards.push(
                <CardMembresia
                    id={membresia.id}
                    key={membresia.id}
                    uuid={membresia.uuid}
                    slug={membresia.slug}
                    titulo={membresia.nombre}
                    precio={membresia.precio}
                    descripcion={membresia.descripcion}
                    beneficios={membresia.beneficios}
                    aclaraciones={membresia.aclaraciones} />
            );
        });

        return (
            <>
                <Header></Header>
                <Container fluid={true} style={{minHeight: '600px'}}>
                    <Row className="justify-content-md-center">
                        {membresias_cards}
                        <Col lg={4} sm={4} >
                            <Card style={{
                                height: "250px",
                                marginTop: '15px'
                            }}>
                                <a href="/membresia/nuevo" className="text-center">
                                    <FontAwesomeIcon icon={faCirclePlus} size="6x" style={{ margin: "30px", marginTop: '45px' }} />
                                    <Card.Title className="text-center">Nueva membresía</Card.Title>
                                </a>
                            </Card>
                        </Col>
                    </Row>
                </Container>
                <Footer></Footer>
            </>
        );
    }
}

export default Home;