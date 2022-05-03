import React, { useEffect, useState } from 'react';
import {
    Row,
    Col,
    Container,
    Button
} from 'react-bootstrap';

import cookieman from '../common/cookieman';
import { Navigate } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';

import axios from 'axios';
import config from '../../config/core';


import Header from '../Layout/default/header';
import Footer from '../Layout/default/footer';
import loadingOverlay from '../common/loadingOverlay';

import withNavigation from '../common/withNavigation';
import validateSession from '../common/validateSession';

const Index = (props) => {
    const [loading, setLoading] = useState(true);
    const [redirect, setRedirect] = useState(false);

    validateSession().then(result => {
    }).catch(error => {
        setRedirect(<Navigate to="/logout" />);
    });
    
    const [article, setArticle] = useState({
        image: '',
        title: '',
        author: {
            name: ''
        },
        category: {
            name: ''
        },
        created_at: ''
    });

    

    useEffect(() => {

        const fetchArticle = async () => {
            const response = await axios.get(config.backend + '/article/' + props.params.slug);

            setArticle(response.data);
            setLoading(false);
        };

        fetchArticle().catch(console.error);

        return true;
    }, []);

    let created_at = new Date(article.created_at);

    return (
        <>
            {loading ? loadingOverlay() : null}
            {redirect}
            <Header />
            <Container>
                <Row>
                    <Col>
                        <h1 className="text-center">{article.title}</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p className="text-end">{article.author.name}<br />{created_at.toDateString()}</p>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={12} md={7} lg={7}>
                        {<div dangerouslySetInnerHTML={{ __html: article.content }}></div>}
                    </Col>
                    <Col xs={12} sm={12} md={5} lg={5}>
                        <img style={{width: '100%'}} src={config.host + article.image.replace('public', 'public/storage')} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h3>Author: {article.author.name}</h3>
                        <p>Category: {article.category.name}</p>
                        <Button variant="red" style={{ borderRadius: 30 }} onClick={() => {
                            setLoading(true);
                            axios.put(config.backend + '/article/' + props.params.slug + '/approve', null, {
                                headers: {
                                    Authorization: 'Bearer ' + cookieman.getItem('token')
                                }
                            }).then(response => {
                                setRedirect((<Navigate to="/home" />));
                            }).catch(error => {
                                NotificationManager.error('Youn can\'t approve this', 'Error');
                                setLoading(false);
                            });
                        }}>Approve this</Button>
                    </Col>
                </Row>
            </Container>
            <Footer />
            <NotificationContainer />
        </>
    );
};

export default withNavigation(Index);