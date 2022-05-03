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
            approved: 0,
            approved_by: '',
            author: {
                id: 0,
                role_id: 0,
                name: '',
                email: '',
            },
            category: {
                id: 1,
                name: '',
                created_at: ''
            },
            category_id: 0,
            content: '',
            created_at: '',
            id: 0,
            image: '',
            publish_date: '',
            slug: '',
            title: '',
            updated_at: '',
            user_id: 1,
            loading: true,
            error: '',
            contentEditorState: '',
            redirect: null,
            operation: 'New',
            categories: [],
            image_file: null
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

        const url = config.backend + '/categories';
        axios.get(url, {
            headers: {
                token: cookieman.getItem('token')
            }
        }).then(response => {
            const categories = response.data;

            this.setState({
                ...this.state,
                categories: categories
            });
        }).catch(error => {
            console.log(error);
            //window.location.href = '/home';
        });

        if (typeof this.props.params.slug != 'undefined') {
            const article_slug = this.props.params.slug;

            if (typeof article_slug != 'undefined') {
                const url = config.backend + '/article/' + article_slug;
                axios.get(url).then(response => {
                    const article = response.data;

                    const contentBlock = htmlToDraft(article.content);
                    const contentState = ContentState.createFromBlockArray(contentBlock);

                    this.setState({
                        ...this.state,
                        ...article,
                        loading: false,
                        contentEditorState: EditorState.createWithContent(contentState),
                        operation: 'Edit'
                    });
                }).catch(error => {
                    console.log(error);
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

    onEditorStateChange = (editorState) => {
        this.setState({
            ...this.state,
            contentEditorState: editorState,
            content: draftToHtml(convertToRaw(editorState.getCurrentContent()))
        });
    };


    setProp = (prop, value) => {
        const newState = { ...this.state };
        newState[prop] = value;

        this.setState(newState);
    }


    saveArticle(event) {
        this.setProp('loading', true);

        const url = config.backend + '/article/';

        // validate

        const formData = new FormData();

        formData.append('title', this.state.title);
        formData.append('content', this.state.content);
        formData.append('category_id', this.state.category_id);

        if (this.state.image_file !== null) {
            formData.append(
                "image",
                this.state.image_file,
                this.state.image_file.name
            );
        }

        if (typeof this.props.params.slug != 'undefined') {
            const url = config.backend + '/article/';

            axios.post(url + this.props.params.slug, formData, {
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
            const url = config.backend + '/articles';

            axios.post(url, formData, {
                headers: {
                    Authorization: 'Bearer ' + cookieman.getItem('token')
                }
            }).then(response => {
                this.setState({
                    redirect: (<Navigate to='/home' />)
                });
            }).catch(error => {
                NotificationManager.error(error.response.data.error, 'Error');
                this.setProp('loading',);
            });
        }
    }


    render() {

        const categories_select = [
            (<option key={0} value={0}>Choose one</option>)
        ];

        this.state.categories.forEach(category => {
            categories_select.push((
                <option key={category.id} value={category.id}>{category.name}</option>
            ));
        });

        return (
            <>
                {this.state.loading ? loadingOverlay() : null}
                {this.state.redirect}
                <Header />
                <Container>
                    <Row style={{ margin: '30px' }}>
                        <Col>
                            <h1 className='text-center'>{this.state.operation} Article</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} md={6}>
                            <h3>Data</h3>
                            <Form.Group className='mb-3'>
                                <FloatingLabel htmlFor="Title" label="Title">
                                    <Form.Control type="text" id="Title" placeholder="Title" onChange={e => {
                                        this.setProp('title', e.target.value);
                                    }} value={this.state.title} />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <FloatingLabel htmlFor="Category" label="Category">
                                    <Form.Select id="Category" placeholder="Category" onChange={e => {
                                        this.setProp('category_id', e.target.value);
                                    }} value={this.state.category_id} >
                                        {categories_select}
                                    </Form.Select>
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label htmlFor="Content">Content</Form.Label>
                                <Editor
                                    editorState={this.state.contentEditorState}
                                    toolbarClassName="toolbarClassName"
                                    wrapperClassName="wrapperClassName"
                                    editorClassName="editorClassName"
                                    onEditorStateChange={this.onEditorStateChange}
                                    style={{ height: '150px' }}
                                />
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
                                    ) : this.state.image !== '' ? this.state.image : null
                                } />

                            </p>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px' }}>
                        <Col xs={12} sm={12} md={6}>
                            <div className="d-grid gap-2 mt-1rem">
                                <Button variant="red" style={{ borderRadius: 30 }} size="lg" onClick={e => {
                                    this.saveArticle();
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