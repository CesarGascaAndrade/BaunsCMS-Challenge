import React, { useEffect, useState } from 'react';
import {
    Row,
    Col,
    Container,

} from 'react-bootstrap';

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
            <Container fluid={true}>
                <Row>
                    <Col xs={0} sm={0} md={1}>
                        
                    </Col>
                    <Col>
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
                                <img style={{ width: '100%' }} src={article.image} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h3>Author: {article.author.name}</h3>
                                <p>Category: {article.category.name}</p>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={1}>
                        <img style={{
                            width: '100%',
                            height: '750px',
                            objectFit: 'cover'
                        }} src="https://www.labgamboa.com/wp-content/uploads/2016/10/orionthemes-placeholder-image.jpg" />
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default withNavigation(Index);