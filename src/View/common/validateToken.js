import cookieman from './cookieman';
import axios from 'axios';

import config from '../../config/core';

export default async () => {
    const url = config.backend + '/usuarios/is_valid_session';
    const response = await axios({
        url: url,
        type: 'get',
        headers: {
            token: cookieman.getItem('token')
        },
    });


    return response.data;
}