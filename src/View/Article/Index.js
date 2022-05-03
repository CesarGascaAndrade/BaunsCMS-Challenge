import React, { useEffect, useState } from 'react';
import {
    Row,
    Col,
    Container,

} from 'react-bootstrap';

import { Navigate } from 'react-router-dom';

import cookieman from '../common/cookieman';
import jwt_decode from 'jwt-decode';

import axios from 'axios';
import config from '../../config/core';


import Header from '../Layout/default/header';
import Footer from '../Layout/default/footer';

import withNavigation from '../common/withNavigation';


const Index = (props) => {
    
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
        };

        fetchArticle().catch(console.error);

        return true;
    }, []);

    let created_at = new Date();

    if (false) {
        created_at = new Date(article.created_at);
    }

    return (
        <>
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
                        <img style={{ width: '100%' }} src={config.host + article.image.replace('public', 'public/storage')} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h3>Author: {article.author.name}</h3>
                        <p>Category: {article.category.name}</p>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default withNavigation(Index);