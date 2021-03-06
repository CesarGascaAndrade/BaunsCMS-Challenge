import React from 'react'
import {
    Col,
    Card
} from 'react-bootstrap';
import {
    Link
} from 'react-router-dom';


import config from '../../config/core';

export default (props) => {
    
    return (
        <Col xs={12} sm={12} md={4} lg={4} style={{
            marginTop: '15px'
        }}>
            <Card>
                <Card.Img
                    variant="top"
                    src={props.article.image}
                    style={{
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover'
                    }}
                />
                <Card.Body>
                    <Card.Title>{props.article.title}</Card.Title>
                    <p>{props.article.category.name}</p>
                    <Card.Text>
                        {props.article.brief}...
                    </Card.Text>
                    {
                        typeof props.article.slug !== 'undefined' ? <Link className="float-end" to={"article/" + props.article.slug}> See more</Link> : <a>&nbsp;</a>
                    }
                </Card.Body>
            </Card>
        </Col >
    );
}