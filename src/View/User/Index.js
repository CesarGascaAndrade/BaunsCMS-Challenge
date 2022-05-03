import React, { Component } from 'react';

import {
    Container,
    Row,
    Col,
    Table,
    Button
} from 'react-bootstrap';

import { Link, Navigate } from 'react-router-dom';

import axios from 'axios';

import config from '../../config/core';
import cookieman from '../common/cookieman';

import Header from '../Layout/default/header';
import Footer from '../Layout/default/footer';

import loadingOverlay from '../common/loadingOverlay';
import validateSession from '../common/validateSession';

class Users extends Component {
    state = {
        loading: true,
        users: [],
        redirect: null
    };

    componentDidMount() {
        validateSession().then(result => {
        }).catch(error => {
            this.setState({
                ...this.state,
                redirect: (<Navigate to="/logout" />)
            });
        });

        const url = config.backend + '/users';

        axios.get(url, {
            headers: {
                Authorization: 'Bearer ' + cookieman.getItem('token')
            }
        }).then(response => {
            this.setState({
                ...this.state,
                users: response.data,
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


        this.state.users.forEach(user => {
            rows.push((
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td><Link to={"/user/" + user.id}>{user.name}</Link></td>
                    <td>{user.role}</td>
                    <td className="text-center">{user.enabled == 1 ? 'Enabled' : 'Disabled'}</td>
                    <td className="text-center">{user.created_at}</td>
                    <td className="text-center">{user.updated_at}</td>
                </tr>
            ));
        });

        return (
            <>
                {this.state.redirect}
                <Header></Header>
                <Container style={{ minHeight: '600px' }}>
                    <Row style={{ margin: '30px' }}>
                        <Col>
                            <h1 className='text-center'>Users</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Link className="float-end" to="/user/new">
                                <Button style={{ borderRadius: 30 }} variant="red">Add user</Button>
                            </Link>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Table>
                                <thead>
                                    <tr>
                                        <td>ID</td>
                                        <td>Name</td>
                                        <td>Role</td>
                                        <td className="text-center">Enabled</td>
                                        <td className="text-center">Created at</td>
                                        <td className="text-center">Updated at</td>
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

export default Users;