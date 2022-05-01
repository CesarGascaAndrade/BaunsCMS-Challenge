import React, { Component } from 'react';

import config from '../../config/core';

import cookieman from '../common/cookieman';


import {
    BrowserRouter,
    Routes,
    Route,
    Redirect
  } from "react-router-dom";
  

export default () => {
    cookieman.deleteItem('token');
    window.location.href = '/login';
    return (<div></div>);
};