
import {
    Container,
    Row,
    Col
} from 'react-bootstrap';

const footer_element = {
    color: '#fff'
};



const Footer = () => {

    return null;

    return (
        <Container fluid style={{ background: '#000', marginTop: '15px' }}>
            <Row>
                <Col sm={2} xs={2} md={2} lg={1}>
                    <img src="" style={{ width: '75%', margin: '15px' }} />
                    <h3 className='d-none d-'>Bauns</h3>
                </Col>
                <Col>
                    <Row>
                        <Col sm={6} xs={6} md={3} lg={3}>
                            <h5 style={footer_element}>Bauns</h5>
                            <p style={footer_element}>Preguntas</p>
                        </Col>
                        <Col sm={6} xs={6} md={3} lg={3}>
                            <h5 style={footer_element}>PRODUCTOS</h5>
                        </Col>
                        <Col sm={6} xs={6} md={3} lg={3}>
                            <h5 style={footer_element}>NOSOTROS</h5>
                        </Col>
                        <Col sm={12} xs={12} md={12} lg={3}>
                            <h5 style={footer_element}>NUESTROS COLABORADORES</h5>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col className="text-center">
                    <a style={footer_element} href="/terminos-y-condiciones">Términos y Condiciones</a>
                </Col>
            </Row>
        </Container>
    );
};

export default Footer;