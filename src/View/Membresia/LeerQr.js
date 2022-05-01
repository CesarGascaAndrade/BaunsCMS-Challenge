import React, { useState } from 'react';
import adapter from 'webrtc-adapter';

import {
    Container,
    Row,
    Col,
    Spinner,
    Alert
} from 'react-bootstrap';


import Header from '../Layout/default/header';
import Footer from '../Layout/default/footer';

import { QrReader } from 'react-qr-reader';

import withNavigation from '../common/withNavigation';
import jwt_decode from 'jwt-decode';

import cookieman from '../common/cookieman';

export default (props) => {
    if(!cookieman.checkItem('token')) {
        return window.location.href = '/login';
    }

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    return (
        <>
            <Header />
            <Container  style={{minHeight: '600px'}}>
                <Row>
                    <Col>
                        <p className="text-center">Escanea el codigo QR de la membresía para consultar su información</p>
                    </Col>
                </Row>
                <Row className="justify-content-md-center" style={{minHeight: '500px'}}>
                    <Col lg={4} sm={12} className="text-center">
                        {
                            loading ?
                                <Spinner animation="border" size="xl" />
                                :
                                <QrReader
                                    constraints={{ facingMode: 'environment' }}
                                    onResult={(result, error) => {
                                        if (!!result) {
                                            const membresia = JSON.parse(result.text);
                                            console.log(result.text);
                                            console.log(membresia);
                                            
                                            setLoading(true);

                                            window.location.href = '/membresia/' + membresia.uuid;
                                        }

                                        if (!!error) {
                                            setLoading(false);
                                        }
                                    }}
                                    style={{
                                        width: '1090%',
                                        maxWidth: '400px'
                                    }}
                                />

                        }
                        {
                            (error) ? (
                                <Alert variant="danger" >
                                    <Alert.Heading>Error!</Alert.Heading>
                                    <p>
                                        {error}
                                    </p>
                                </Alert>
                            ) : null
                        }
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
}