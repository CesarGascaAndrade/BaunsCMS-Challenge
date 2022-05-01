import {
    Row,
    Col,
    Container,
} from 'react-bootstrap';

import cookieman from '../common/cookieman';
import jwt_decode from 'jwt-decode';

import portada from '../assets/thin-cover.png';
import image1 from '../assets/pexels-photo-7821729.webp';
import image2 from '../assets/pexels-andrea-piacquadio-920382.jpg';

import Header from '../Layout/default/header';
import Footer from '../Layout/default/footer';

const Index = () => {
    let session = null;
    if (cookieman.checkItem('token') !== null) {
        session = jwt_decode(cookieman.getItem('token'));
    }

    return (
        <>
            <Header />
            <Container fluid style={{ padding: 0 }}>
                <img src={portada} style={{ width: '100%' }} />
            </Container>
            <Container>
                <Row style={{ marginTop: '50px', marginBottom: '50px' }}>
                    <Col lg={6} sm={12} >
                        <img style={{ width: '100%' }} src={image1} />
                    </Col>
                    <Col lg={6} sm={12} className='d-flex align-items-center'>
                        <div>
                            <h2 className='text-center'>Obten beneficios en tus visitas con tu profesional de la salud</h2>
                            <p className='text-center'>
                                Con cada visita puedes obtener beneficios como: descuentos, puntos canjeables, regalos en el mes de tu cumpleaños... Entre muchos otros beneficios que tu profesional puede brindar.
                            </p>

                        </div>
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row style={{ marginTop: '50px', marginBottom: '50px' }}>
                    <Col lg={6} sm={12} className='d-flex align-items-center'>
                        <div>
                            <h2 className='text-center'>Lleva tus membresías siempre contigo</h2>
                            <p className='text-center'>
                                En nuestro portal (y próximamente APP) puedes ver el status de tus membresias y el historial de los beneficios, así como los puntos acumulados en cada una.
                            </p>

                        </div>
                    </Col>
                    <Col lg={6} sm={12}>
                        <img style={{ width: '100%' }} src={image2} />
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default Index;