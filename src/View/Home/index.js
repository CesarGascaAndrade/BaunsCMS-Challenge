import React, { Component } from 'react';

import {
    Container,
    Row,
    Col,
    Table,
    Button
} from 'react-bootstrap';

import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';

import config from '../../config/core';
import cookieman from '../common/cookieman';

import Header from '../Layout/default/header';
import Footer from '../Layout/default/footer';

import CardArticle from '../Elements/CardArticle';

import loadingOverlay from '../common/loadingOverlay';

class Home extends Component {
    state = {
        loading: true,
        articles: []
    };

    componentDidMount() {
        if (!cookieman.checkItem('token')) {
            return window.location.href = '/login';
        }

        const url = config.backend + '/articles';

        axios.get(url, {
            headers: {
                token: cookieman.getItem('token')
            }
        }).then(response => {
            this.setState({
                ...this.state,
                articles: response.data,
            });
        }).catch(error => {
            console.log('error', error);
        }).finally(() => {
            this.setState({
                ...this.state,
                loading: false
            });
        });

    }

    render() {

        if (this.state.loading) {
            return (loadingOverlay());
        }

        const rows = [];

        this.state.articles.forEach((article) => {

            rows.push((
                <tr>
                    <td>{article.id}</td>
                    <td><Link to={"/article/" + article.slug + "/edit"}>{article.title}</Link></td>
                    <td>{article.category.name}</td>
                    <td>{article.author.name}</td>
                    <td className="text-center">{article.created_at}</td>
                    <td className="text-center">{article.updated_at}</td>
                    <td className="text-center">{article.approved == 1 ? 'Yes' : <Link to={"/article/" + article.slug + "/review"}>Review</Link>}</td>
                </tr>
            ));
        });

        return (
            <>
                <Header></Header>
                <Container style={{ minHeight: '600px' }}>
                    <Row>
                        <Col>
                            <Link className="float-end" to="/article/new">
                                <Button style={{borderRadius: 30}} variant="red">Add article</Button>
                            </Link>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Table>
                                <thead>
                                    <tr>
                                        <td>#</td>
                                        <td>Title</td>
                                        <td>Category</td>
                                        <td>Author</td>
                                        <td className="text-center">Created at</td>
                                        <td className="text-center">Updated at</td>
                                        <td className="text-center">Approved</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
                <Footer></Footer>
            </>
        );
    }
}

export default Home;