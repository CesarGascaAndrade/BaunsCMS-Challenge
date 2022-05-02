import {
    Navbar,
    Container,
    Nav,
    NavDropdown,

} from 'react-bootstrap';

import logo from '../../assets/bauns_red.png';

import jwt_decode from 'jwt-decode';

import cookieman from '../../common/cookieman';

const Header = (props) => {
    let session = null;
    let user_name = null;
    if (cookieman.checkItem('token') !== null) {
        session = jwt_decode(cookieman.getItem('token'));
        user_name = cookieman.getItem('user.name');
    }

    if (props.mustHaveSession && !session) {
        window.location.href = '/login';
    }

    return (
        <Navbar bg="white" expand="lg" sticky="top" >
            <Container>
                <Navbar.Brand href="/">
                    <img style={{ width: '192px' }} src={logo} />
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
                                <Nav.Link href="/users">Users</Nav.Link>
                                :
                                null
                        }
                    </Nav>
                    {
                        session != null ?
                            (<NavDropdown menuVariant="dark" title={user_name} className="d-flex">
                                <NavDropdown.Item href="/usuario/configuracion">Settings</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#" onClick={() => {
                                    cookieman.deleteItem('token');
                                    cookieman.deleteItem('user');
                                    window.location.href = '/';
                                }}>Logout</NavDropdown.Item>
                            </NavDropdown>)
                            :
                            (<NavDropdown title="Guest" className="d-flex">
                                <NavDropdown.Item href="/login">Sign In</NavDropdown.Item>
                            </NavDropdown>)
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;