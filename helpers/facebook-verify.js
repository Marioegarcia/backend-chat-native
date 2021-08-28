const axios = require('axios');

const facebookVerify = async( accessToken = '' ) => {

    const { data } = await axios({
        url: 'https://graph.facebook.com/me',
        method: 'get',
        params: {
          fields: ['id', 'email', 'name','picture' ].join(','),
          access_token: accessToken,
        },
      });
        
    const { email:correo,name:nombre,picture:img } = data;

    
    return { 
        correo,
        nombre,
        img
     };

}


module.exports = {
    facebookVerify
}

