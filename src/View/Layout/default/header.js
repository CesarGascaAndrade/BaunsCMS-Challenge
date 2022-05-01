import {
    Navbar,
    Container,
    Nav,
    NavDropdown,

} from 'react-bootstrap';

import logoWhite from '../../assets/vector/default-monochrome-white.svg';

import jwt_decode from 'jwt-decode';

import cookieman from '../../common/cookieman';

const Header = (props) => {
    let session = null;
    if (cookieman.checkItem('token') !== null) {
        session = jwt_decode(cookieman.getItem('token'));
    }

    if (props.mustHaveSession && !session) {
        window.location.href = '/login';
    }

    return (
        <Navbar variant="dark" bg="dark" expand="lg" sticky="top" >
            <Container>
                <Navbar.Brand href="/">
                    <img style={{ width: '30px' }} src={logoWhite} /> <span>Superks</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {
                            session !== null ?
                                <Nav.Link href="/home">Home</Nav.Link>
                                :
                                null
                        }
                        {
                            session !== null ?
                                <NavDropdown menuVariant='dark' title="Clientes" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/membresia/leer_qr">Leer QR</NavDropdown.Item>
                                </NavDropdown>
                                :
                                null
                        }

                    </Nav>
                    {
                        session != null ?
                            (<NavDropdown menuVariant="dark" title={session.nombre + ' ' + session.primer_apellido} id="basic-nav-dropdown" className="d-flex">
                                <NavDropdown.Item href="/usuario/configuracion">Configuración</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#" onClick={() => {
                                    cookieman.deleteItem('token');
                                    window.location.href = '/';
                                }}>Salir</NavDropdown.Item>
                            </NavDropdown>)
                            :
                            (<NavDropdown title="Cuenta" id="basic-nav-dropdown" className="d-flex">
                                <NavDropdown.Item href="login">Iniciar Sesión</NavDropdown.Item>
                            </NavDropdown>)
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;