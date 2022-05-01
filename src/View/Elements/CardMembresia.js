import React from 'react'
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    FloatingLabel,
    Alert,
    Dropdown
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faListDots, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

export default (props) => {

    const beneficios = [];

    props.beneficios.forEach(beneficio => {
        beneficios.push(
            <li key={beneficio.id}>{beneficio.descripcion}</li>
        );
    });

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <div
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
            style={{ margin: '30px' }}
        >
            {children}

        </div>
    ));

    return (
        <Col lg={4} md={6} sm={12} style={{ marginTop: '15px' }}>
            <Card style={{
                height: "450px"
            }}>
                <Card.Title className="text-center">

                    <Dropdown className="float-end" >
                        <Dropdown.Toggle variant="light" as={CustomToggle}>
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href={`membresia/${props.slug}/editar`}>Editar</Dropdown.Item>
                            <Dropdown.Item href={`membresia/${props.slug}/deshabilitar`}>Deshabilitar</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item href="membresia/emitir/correo">Emitir por correo</Dropdown.Item>
                            <Dropdown.Item href={"membresia/emitir/qr/" + props.slug}>Emitir con código QR</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <h1>{props.titulo}<br />${props.precio}</h1>
                </Card.Title>
                <Card.Body className="d-flex flex-column" style={{ overflow: 'hidden' }}>
                    <div style={{ height: '300px', overflowY: 'scroll' }}>
                        <p>{props.descripcion}</p>
                        <p>Beneficios</p>
                        <ul>
                            {beneficios}
                        </ul>
                        {props.aclaraciones !== null ? (<div dangerouslySetInnerHTML={{ __html: props.aclaraciones }}></div>) : null}
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
}