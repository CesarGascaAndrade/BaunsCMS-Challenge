import React, { Component } from 'react';

import {
    Container,
    Row,
    Col,
    Spinner
} from 'react-bootstrap';

import { useNavigate, useParams } from "react-router-dom";

import axios from 'axios';

import config from '../../../config/core';
import cookieman from '../../common/cookieman';

import Header from '../../Layout/default/header';
import Footer from '../../Layout/default/footer';

import QRCode from "react-qr-code";

export const withNavigation = (Component) => {
    return props => (<Component {...props} navigate={useNavigate()} params={useParams()} />);
}


class Qr extends Component {
    state = {
        loading: true,
        usuario: null,
        token: '',
        qr: null
    };

    componentDidMount() {

        const url = config.backend + '/catmembresias/crear_instancia/' + this.props.params.membresia;

        axios.get(url, {
            headers: {
                token: cookieman.getItem('token')
            }
        }).then(response => {
            console.log(response);
            if (response.data.success) {
                this.setState({
                    ...this.state,
                    token: response.data.data,
                    loading: false
                });
            }
        });
    }

    emitir() {

    }

    render() {
        return (
            <>
                <Header></Header>
                <Container>
                    <Row>
                        <Col>
                            <p>&nbsp;</p>
                            <p className="text-center">
                                Pide a tu cliente que escanee este código QR con su celular para recibir la membresía
                            </p>
                            <div className="text-center">
                                {this.state.loading ? <Spinner animation="border" size="xl" /> : <QRCode value={this.state.token} />}
                            </div>
                        </Col>
                    </Row>
                </Container>
                <Footer></Footer>
            </>
        );
    }
}

export default withNavigation(Qr);