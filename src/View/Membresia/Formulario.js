import React, { Component } from 'react';

import {
    Container,
    Row,
    Col,
    Button,
    FloatingLabel,
    Form,
    FormControl,
    InputGroup,
    Card
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faSave, faClose } from '@fortawesome/free-solid-svg-icons';

import { NotificationContainer, NotificationManager } from 'react-notifications';

import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import Header from '../Layout/default/header';
import Footer from '../Layout/default/footer';

import withNavigation from '../common/withNavigation';

import axios from 'axios';
import config from '../../config/core';
import cookieman from '../common/cookieman';
import loadingOverlay from '../common/loadingOverlay';

const Beneficio = (props) => {
    return (
        <Card>
            <div style={{ marginTop: '15px' }}>
                <Button variant='light' className='float-end' onClick={props.deleteBeneficio}>
                    <FontAwesomeIcon icon={faClose} />
                </Button>
            </div>
            <Card.Body>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Descripción</InputGroup.Text>
                    <FormControl
                        placeholder="Descripción"
                        aria-label="Descripcion"
                        value={props.descripcion}
                        onChange={e => {
                            props.updateBeneficio(props.id, 'descripcion', e.target.value);
                        }}
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Usos por periodo</InputGroup.Text>
                    <FormControl
                        placeholder="Usos por periodo"
                        aria-label="Usos por periodo"
                        value={props.max_uses}
                        type='number'
                        onChange={e => {
                            props.updateBeneficio(props.id, 'max_uses', e.target.value);
                        }}
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Valor</InputGroup.Text>
                    <FormControl
                        placeholder="Valor"
                        aria-label="Valor"
                        value={props.valor}
                        onChange={e => {
                            props.updateBeneficio(props.id, 'valor', e.target.value);
                        }}
                    />
                </InputGroup>
            </Card.Body>
        </Card>
    );
};

class Formulario extends Component {


    constructor(props) {
        super(props);

        this.state = {
            operacion: 'Nueva',
            nombre: '',
            descripcion: '',
            precio: 0.0,
            //aclaracionesEditorState: EditorState.createEmpty(),
            aclaraciones: '',
            vigencia_extension: 1,
            vigencia_unidad_temporal: 'month',
            tasa_bonificacion: null,
            beneficios: [],
            loading: true,
            error: null,
        };
    }

    componentDidMount() {
        if (typeof this.props.params.membresia_uuid != 'undefined') {
            const membresia_uuid = this.props.params.membresia_uuid;

            if (typeof membresia_uuid != 'undefined') {
                const url = config.backend + '/catmembresias/' + membresia_uuid;
                axios.get(url, {
                    headers: {
                        token: cookieman.getItem('token')
                    }
                }).then(response => {
                    if (response.data.success) {
                        console.log(response.data.data[0]);

                        const membresia = response.data.data[0];

                        const contentBlock = htmlToDraft(membresia.aclaraciones);
                        const contentState = ContentState.createFromBlockArray(contentBlock);

                        this.setState({
                            ...this.state,
                            operacion: 'Editar',
                            aclaraciones: membresia.aclaraciones,
                            aclaracionesEditorState: EditorState.createWithContent(contentState),
                            descripcion: membresia.descripcion,
                            nombre: membresia.nombre,
                            precio: membresia.precio,
                            slug: membresia.slug,
                            tasa_bonificacion: membresia.tasa_bonificacion,
                            uuid: membresia.uuid,
                            vigencia_extension: membresia.vigencia_extension,
                            vigencia_unidad_temporal: membresia.vigencia_unidad_temporal,
                            beneficios: membresia.beneficios,
                            loading: false,
                        });
                    }
                    else {
                        window.location.href = '/home';
                    }
                }).catch(error => {
                    window.location.href = '/home';
                });
            }
            else {
                this.setProp('loading', false);

            }

        }
        else {
            this.setProp('loading', false);
        }
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            ...this.state,
            aclaracionesEditorState: editorState,
            aclaraciones: draftToHtml(convertToRaw(editorState.getCurrentContent()))
        });
    };


    setProp = (prop, value) => {
        const newState = { ...this.state };
        newState[prop] = value;

        this.setState(newState);
    }

    setVigencia(vigencia) {
        console.log('vigencia', vigencia.extension);
        console.log('vigencia', vigencia.unidad_temporal);


    }

    guardarMembresia(event) {
        this.setProp('loading', true);

        const url = config.backend + '/catmembresias';
        if (typeof this.props.params.membresia_uuid != 'undefined') {
            axios.put(url + '/' + this.props.params.membresia_uuid, {
                nombre: this.state.nombre,
                descripcion: this.state.descripcion,
                precio: this.state.precio,
                aclaraciones: this.state.aclaraciones,
                tasa_bonificacion: this.state.tasa_bonificacion,
                vigencia_extension: this.state.vigencia_extension,
                vigencia_unidad_temporal: this.state.vigencia_unidad_temporal,
                beneficios: this.state.beneficios
            }, {
                headers: {
                    token: cookieman.getItem('token')
                }
            }).then(response => {
                if (response.data.success) {
                    window.location.href = '/home';
                }
                else {
                    this.setProp('loading', false);
                }
            }).catch(error => {
                this.setProp('loading',);
            });
        }
        else {
            axios.post(url, {
                nombre: this.state.nombre,
                descripcion: this.state.descripcion,
                precio: this.state.precio,
                aclaraciones: this.state.aclaraciones,
                tasa_bonificacion: this.state.tasa_bonificacion,
                vigencia_extension: this.state.vigencia_extension,
                vigencia_unidad_temporal: this.state.vigencia_unidad_temporal,
                beneficios: this.state.beneficios
            }, {
                headers: {
                    token: cookieman.getItem('token')
                }
            }).then(response => {
                if (response.data.success) {
                    window.location.href = '/home';
                }
                else {
                    this.setProp('loading', false);
                }
            }).catch(error => {
                this.setProp('loading',);
            });
        }
    }

    deleteBeneficio(id) {
        const beneficios = [...this.state.beneficios];

        beneficios.forEach((beneficio, i) => {
            if (beneficio.id === id) {
                console.log(beneficio);
                console.log(beneficios[i]);
                beneficios[i].deleted = true;
            }
        });

        this.setState({
            ...this.state,
            beneficios: beneficios
        });
    }

    addBeneficio() {
        const beneficios = [...this.state.beneficios];

        beneficios.push({
            id: 'new' + this.state.beneficios.length,
            descripcion: '',
            max_uses: 0,
            valor: null
        });

        this.setState({
            ...this.state,
            beneficios: beneficios
        });
    }

    updateBeneficio(id, campo, valor) {
        const beneficios = [...this.state.beneficios];

        beneficios.forEach((beneficio, i) => {
            if (beneficio.id === id) {
                beneficios[i][campo] = valor;
            }
        });

        this.setState({
            ...this.state,
            beneficios: beneficios
        });
    }

    render() {
        const duraciones_definiciones = [
            {
                extension: 1,
                unidad_temporal: 'day',
                label: 'Diario'
            },
            {
                extension: 1,
                unidad_temporal: 'week',
                label: 'Semanal'
            },
            {
                extension: 15,
                unidad_temporal: 'day',
                label: 'Quincenal'
            },
            {
                extension: 1,
                unidad_temporal: 'month',
                label: 'Mensual'
            },
            {
                extension: 2,
                unidad_temporal: 'month',
                label: 'Bimestral'
            },
            {
                extension: 3,
                unidad_temporal: 'month',
                label: 'Trimestral'
            },
            {
                extension: 4,
                unidad_temporal: 'month',
                label: 'Cuatrimestral'
            },
            {
                extension: 6,
                unidad_temporal: 'month',
                label: 'Semestral'
            },
            {
                extension: 12,
                unidad_temporal: 'month',
                label: 'Anual'
            },

        ];

        const duraciones = [];

        duraciones_definiciones.map((duracion, n) => {
            return duraciones.push(<option key={n} value={`${duracion.extension}_${duracion.unidad_temporal}`} data-extension={duracion.extension} data-unidad_temporal={duracion.unidad_temporal}>{duracion.label}</option>);
        });

        const beneficios = [];

        this.state.beneficios.forEach(beneficio => {
            if (!beneficio.deleted) {
                beneficios.push(
                    <Beneficio
                        id={beneficio.id}
                        key={beneficio.id}
                        descripcion={beneficio.descripcion}
                        max_uses={beneficio.max_uses}
                        valor={beneficio.valor}
                        deleteBeneficio={() => {
                            this.deleteBeneficio(beneficio.id)
                        }}
                        updateBeneficio={(id, campo, valor) => {
                            this.updateBeneficio(id, campo, valor);
                        }}
                    />
                );
            }
        });

        return (
            <>
                {this.state.loading ? loadingOverlay() : null}
                <Header />
                <Container>
                    <Row style={{ margin: '30px' }}>
                        <Col>
                            <h1 className='text-center'>{this.state.operacion} Membresía</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} md={6}>
                            <Form.Group className='mb-3'>
                                <FloatingLabel htmlFor="MembresiaNombre" label="Nombre">
                                    <Form.Control type="text" id="MembresiaNombre" placeholder="¿Cómo se llamará la membresía?" onChange={e => {
                                        this.setProp('nombre', e.target.value);
                                    }} value={this.state.nombre} />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <FloatingLabel htmlFor="MembresiaDescripcion" label="Descripción">
                                    <Form.Control type="text" id="MembresiaDescripcion" placeholder="Describe tu membresía" onChange={e => {
                                        this.setProp('descripcion', e.target.value);
                                    }} value={this.state.descripcion} />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <FloatingLabel htmlFor="MembresiaPrecio" label="Precio">
                                    <Form.Control type="number" id="MembresiaPrecio" placeholder='¿Cuanto cuesta tu membresía?' onChange={e => {
                                        this.setProp('precio', e.target.value);
                                    }} value={this.state.precio} />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <FloatingLabel htmlFor="MembresiaVigenciaExtension" label="Duración">
                                    <Form.Select type="select" id="MembresiaVigenciaExtension" onChange={e => {
                                        const duracion = e.target.value.split('_');
                                        this.setState({
                                            ...this.state,
                                            vigencia_extension: duracion[0],
                                            vigencia_unidad_temporal: duracion[1]
                                        });
                                    }} value={`${this.state.vigencia_extension}_${this.state.vigencia_unidad_temporal}`}>
                                        <option>¿Cuanto dura la membresía?</option>
                                        {duraciones}
                                    </Form.Select>
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <FloatingLabel htmlFor="MembresiaTasaBonificacion" label="% de bonificacion en puntos">
                                    <Form.Control type="number" id="MembresiaTasaBonificacion" placeholder='¿Qué porcentaje de puntos se dará con cada compra?' onChange={e => {
                                        this.setProp('tasa_bonificacion', e.target.value);
                                    }} value={this.state.tasa_bonificacion} />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label htmlFor="MembresiaAclaraciones">Aclaraciones</Form.Label>
                                <Editor
                                    editorState={this.state.aclaracionesEditorState}
                                    toolbarClassName="toolbarClassName"
                                    wrapperClassName="wrapperClassName"
                                    editorClassName="editorClassName"
                                    onEditorStateChange={this.onEditorStateChange}
                                    style={{ height: '150px' }}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={6}>
                            <Row>
                                <Col>
                                    <Form.Label htmlFor="MembresiaNombre">
                                        Beneficios
                                        <Button variant="default" onClick={() => {
                                            this.addBeneficio();
                                        }}><FontAwesomeIcon icon={faPlusCircle} /></Button>
                                    </Form.Label>
                                </Col>
                            </Row>
                            <Row id="ListaBeneficios">
                                {this.state.beneficios.length === 0 ? <p className="text-center">Ninguno</p> : beneficios}
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px' }}>
                        <Col xs={12} sm={12} md={6}>
                            <div className="d-grid gap-2 mt-1rem">
                                <Button variant="primary" size="lg" onClick={e => {
                                    this.guardarMembresia();
                                }}><FontAwesomeIcon icon={faSave} /></Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
                <Footer />
                <NotificationContainer />
            </>
        );
    }
}

export default withNavigation(Formulario);