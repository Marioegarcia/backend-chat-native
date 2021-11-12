const { Schema, model } = require('mongoose');

const AmigosSchema = Schema({
    solicitante: { type: Schema.Types.ObjectId, ref: 'Usuario'},
    destinatario: { type: Schema.Types.ObjectId, ref: 'Usuario'},
    status: {
      type: Number,
      enums: [
          0,    //'agregar',
          1,    //'solicitada',
          2,    //'pendiente',
          3,    //'amigos'
      ]
    }
  }, {timestamps: true})





module.exports = model( 'Amigos', AmigosSchema );