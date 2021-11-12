
const { Router } = require('express');
const { check } = require('express-validator');
const { amigosSend, solicitudAmigos,aceptarSolicitud,deleteAmigos } = require('../controllers/amigosController');




// const {  } = require('../controllers/usuarios');

const router = Router();


router.get('/:id', solicitudAmigos );

router.put('/:id',aceptarSolicitud);

router.post('/' , amigosSend );

router.post('/delete/:id' , deleteAmigos );
// router.delete('/:id' );

// router.patch('/', usuariosPatch );





module.exports = router;