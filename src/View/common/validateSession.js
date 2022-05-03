import cookieman from './cookieman';
import axios from 'axios';

import config from '../../config/core';

export default async () => {
    const url = config.backend + '/user';
    const response = await axios({
        url: url,
        type: 'get',
        headers: {
            Authorization: 'Bearer ' + cookieman.getItem('token')
        },
    });


    return response.data;
}