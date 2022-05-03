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
import { Navigate } from 'react-router-dom';

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
import validateSession from '../common/validateSession';


class Formulario extends Component {
    constructor(props) {
        super(props);

        this.state = {
            created_at: '',
            email: '',
            enabled: 0,
            id: 0,
            name: '',
            role: '',
            operation: 'New',
            password: null,
            password_confirmation: null,
            loading: true,
            error: '',
            redirect: null,
            image: '',
            image_file: null,
        };
    }

    componentDidMount() {

        validateSession().then(result => {
        }).catch(error => {
            this.setState({
                ...this.state,
                redirect: (<Navigate to="/logout" />)
            });
        });

        

        if (typeof this.props.params.id != 'undefined') {
            const user_id = this.props.params.id;

            if (typeof user_id != 'undefined') {
                const url = config.backend + '/user/' + user_id;

                axios.get(url, {
                    headers: {
                        Authorization: 'Bearer ' + cookieman.getItem('token')
                    }
                }).then(response => {
                    const user = response.data;

                    this.setState({
                        ...this.state,
                        ...user,
                        loading: false,
                        operation: 'Edit'
                    });
                }).catch(error => {
                    this.setState({
                        redirect: (<Navigate to='/home' />)
                    });
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


    setProp = (prop, value) => {
        const newState = { ...this.state };
        newState[prop] = value;

        this.setState(newState);
    }


    saveUser() {
        //this.setProp('loading', true);

        // validate
        const formData = new FormData();

        formData.append('role', this.state.role);
        formData.append('name', this.state.name);
        formData.append('email', this.state.email);
        formData.append('password', this.state.password);
        formData.append('password_confirmation', this.state.password_confirmation);

        // future upload profile picture
        if (this.state.image_file !== null) {
            formData.append(
                "image",
                this.state.image_file,
                this.state.image_file.name
            );
        }

        if (typeof this.props.params.id != 'undefined') {
            const url = config.backend + '/user/';

            axios.post(url + this.props.params.id, formData, {
                headers: {
                    Authorization: 'Bearer ' + cookieman.getItem('token')
                }
            }).then(response => {
                /*
                this.setState({
                    redirect: (<Navigate to='/home' />)
                });
                */
                this.setState({
                    loading: false
                });
                NotificationManager.success('Saved', 'Success');
            }).catch(error => {
                NotificationManager.error(error.response.data.error, 'Error');
                this.setProp('loading', false);
            });
        }
        else {
            const url = config.backend + '/user/register';

            axios.post(url, formData, {
                headers: {
                    Authorization: 'Bearer ' + cookieman.getItem('token')
                }
            }).then(response => {
                NotificationManager.success('We got a new user', 'Success!');
                this.setState({
                    redirect: (<Navigate to='/users' />)
                });
            }).catch(error => {
                NotificationManager.error(error.response.data.error, 'Error');
                this.setProp('loading',);
            });
        }
    }


    render() {
        const roles = {
            ROLE_WRITER: 'Writer',
            ROLE_REVIEWER: 'Reviewer',
            ROLE_USER: 'Common User',
        };

        const role_options = [
            (<option key={0} value={0}>Choose one</option>)
        ];

        Object.keys(roles).forEach(role => {
            role_options.push((
                <option key={role} value={role}>{roles[role]}</option>
            ));
        });

        return (
            <>
                {this.state.redirect}
                {this.state.loading ? loadingOverlay() : null}
                <Header />
                <Container>
                    <Row style={{ margin: '30px' }}>
                        <Col>
                            <h1 className='text-center'>{this.state.operation} User</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} md={6}>
                            <h3>Data</h3>
                            <Form.Group className='mb-3'>
                                <FloatingLabel htmlFor="Name" label="Name">
                                    <Form.Control type="text" id="Name" placeholder="Name" onChange={e => {
                                        this.setProp('name', e.target.value);
                                    }} value={this.state.name} />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <FloatingLabel htmlFor="Email" label="Email">
                                    <Form.Control type="text" id="Email" placeholder="Email" onChange={e => {
                                        this.setProp('email', e.target.value);
                                    }} value={this.state.email} />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <FloatingLabel htmlFor="Role" label="Role">
                                    <Form.Select id="Role" placeholder="Role" onChange={e => {
                                        this.setProp('role', e.target.value);
                                    }} value={this.state.role} >
                                        {role_options}
                                    </Form.Select>
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <FloatingLabel htmlFor="Password" label="Password">
                                    <Form.Control type="password" id="Password" placeholder="Password" onChange={e => {
                                        this.setProp('password', e.target.value);
                                    }} value={this.state.password} />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <FloatingLabel htmlFor="PasswordConfirmation" label="Password Confirmation">
                                    <Form.Control type="password" id="PasswordConfirmation" placeholder="Password Confirmation" onChange={e => {
                                        this.setProp('password_confirmation', e.target.value);
                                    }} value={this.state.password_confirmation} />
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={6}>
                            <h3>Image</h3>
                            <Form.Group className='mb-3'>
                                <Form.Control type="file" id="Image" placeholder="Image" accept="image/*" onChange={e => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        this.setProp('image_file', e.target.files[0]);
                                    }
                                    console.log(this.state.image);
                                }} />
                            </Form.Group>
                            <p className="text-center">
                                <img style={{ maxWidth: '100%' }} src={
                                    this.state.image_file !== null ? (
                                        URL.createObjectURL(this.state.image_file)
                                    ) : this.state.image !== '' ? config.host + this.state.image.replace('public', 'public/storage') : null
                                } />

                            </p>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px' }}>
                        <Col xs={12} sm={12} md={6}>
                            <div className="d-grid gap-2 mt-1rem">
                                <Button variant="red" style={{ borderRadius: 30 }} size="lg" onClick={e => {
                                    this.saveUser();
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