//import logo from './logo.svg';
import './App.css';

import React from 'react';
import 'react-bootstrap';

import 'react-notifications/lib/notifications.css';

import Index from './View/Index/index';
import Home from './View/Home/index';
import Login from './View/User/Login';
import Logout from './View/User/Logout';

import Article from './View/Article/Index';
import ArticleReview from './View/Article/Review';
import ArticleForm from './View/Article/Form';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/home" element={<Home />} />
        
        <Route path="/article/:slug" element={<Article />} />
        <Route path="/article/:slug/edit" element={<ArticleForm />} />
        <Route path="/article/:slug/review" element={<ArticleReview />} />
        <Route path="/article/new" element={<ArticleForm />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
