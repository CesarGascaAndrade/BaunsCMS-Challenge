import React, { useEffect, useState } from 'react';
import {
    Row,
    Container,
    Form,
    Card
} from 'react-bootstrap';

import axios from 'axios';
import config from '../../config/core';


import Header from '../Layout/default/header';
import Footer from '../Layout/default/footer';

import CardArticle from '../Elements/CardArticle';

const Index = () => {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {

        const fetchArticles = async () => {
            const response = await axios.get(config.backend + '/articles');

            setArticles(response.data);
        };

        const fetchCategories = async () => {
            const response = await axios.get(config.backend + '/categories');

            setCategories(response.data);
        };

        fetchArticles().catch(console.error);
        fetchCategories().catch(console.error);

        return true;
    }, []);


    const el_articles = [];
    const el_categories = [
        (<Form.Check
            key={0}
            inline
            label="All"
            name="all"
            type="checkbox"
            checked={selectedCategories.length == 0}
            onChange={e => {
                emptySelectedCategories();
            }}
        />)
    ];

    function emptySelectedCategories() {
        setSelectedCategories([]);
    }

    function updateCategories(category, checked) {
        if (checked) {
            addCategory(category);
        }
        else {
            removeCategory(category);
        }
    }

    function addCategory(category) {
        const updatedSelectedCategories = [
            ...selectedCategories,
            category
        ];
        setSelectedCategories(updatedSelectedCategories);

    }

    function removeCategory(category) {
        var index = selectedCategories.indexOf(category);
        let updatedSelectedCategories = [...selectedCategories];

        if (index !== -1) {
            updatedSelectedCategories.splice(index, 1);
        }

        setSelectedCategories(updatedSelectedCategories);

    }

    let articles_shown = 0;

    articles.forEach(article => {
        
        if(articles_shown > 10) return false;
        
        if (article.approved) {
            if (selectedCategories.length > 0) {
                if (selectedCategories.indexOf(article.category.name) !== -1) {
                    el_articles.push((
                        <CardArticle key={article.id} article={article} />
                    ));
                    articles_shown = articles_shown + 1;
                }
            }
            else {
                el_articles.push((
                    <CardArticle key={article.id} article={article} />
                ));
                articles_shown = articles_shown + 1;
            }
        }
        
    });

    categories.forEach(category => {
        el_categories.push((
            <Form.Check
                key={category.id}
                inline
                label={category.name}
                name={category.slug}
                value={category.slug}
                type="checkbox"
                checked={selectedCategories.indexOf(category.name) !== -1 ? true : false}
                onChange={e => {
                    updateCategories(category.name, e.target.checked)
                }}
            />
        ));
    });

    return (
        <>
            <Header />
            <Container>
                <Row style={{ marginTop: '50px', marginBottom: '50px' }}>
                    <div className="mb-3">
                        {el_categories}
                    </div>
                </Row>
                <Row style={{ marginTop: '50px', marginBottom: '50px' }}>
                    <CardArticle
                        key={0}
                        article={{
                            title: 'This is an ad',
                            image: 'https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png',
                            content: 'This is an ad desc',
                            brief: 'This is an ad desc',
                            category: {
                                name: 'Ad'
                            }
                        }}
                     />
                    {el_articles}
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default Index;