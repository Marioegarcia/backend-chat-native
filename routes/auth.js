const { Router } = require('express');
const { check } = require('express-validator');

const passportFacebook = require('../helpers/facebook-verify');
const { validarCampos, validarJWT } = require('../middlewares');


const { login, googleSignin, validarTokenUsuario,facebookSignin } = require('../controllers/auth');


const router = Router();

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login );

router.post('/google',[
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignin );

router.post('/facebook',[
    check('accessToken', 'El token es necesario').not().isEmpty(),
    validarCampos
], facebookSignin );





router.get('/',[
    validarJWT
], validarTokenUsuario );



module.exports = router;