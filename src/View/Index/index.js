import React, { useEffect, useState } from 'react';
import {
    Row,
    Col,
    Container,
    Card,
    Button
} from 'react-bootstrap';

import cookieman from '../common/cookieman';
import jwt_decode from 'jwt-decode';

import axios from 'axios';
import config from '../../config/core';


import Header from '../Layout/default/header';
import Footer from '../Layout/default/footer';

import CardArticle from '../Elements/CardArticle';

const Index = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {

        const fetchArticles = async () => {
            const response = await axios.get(config.backend + '/articles');

            setArticles(response.data);
        };

        fetchArticles().catch(console.error);

        return true;
    }, []);
        
    
    const el_articles = [];

    articles.forEach(article => {
        if(article.approved) {
            el_articles.push((
                <CardArticle  key={article.id} article={article} />
            ));

        }
    });

    return (
        <>
            <Header />
            <Container>
                <Row style={{ marginTop: '50px', marginBottom: '50px' }}>
                    {el_articles}
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default Index;