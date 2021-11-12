const { response } = require("express");

const Usuario = require("../models/usuario");
const Amigos = require("../models/amigos");
const { Schema,Types, } = require("mongoose");
// const { generarJWT } = require('../helpers');

const amigosSend = async (req, res = response) => {

  const { userEnvia, userRecibe } = req.body;
   

  const docA = await Amigos.findOneAndUpdate(
    { solicitante: userEnvia, destinatario: userRecibe },
    { $set: { status: 1 } },
    { upsert: true, new: true }
  );
  const docB = await Amigos.findOneAndUpdate(
    { destinatario: userEnvia, solicitante: userRecibe },
    { $set: { status: 2 } },
    { upsert: true, new: true }
  );


  await Usuario.findOneAndUpdate(
    { _id: userEnvia },
    { $push: { amigos: docA._id } }
  );
  await Usuario.findOneAndUpdate(
    { _id: userRecibe },
    { $push: { amigos: docB._id } }
  );


  await Usuario.findOneAndUpdate( { _id: userEnvia },{nuevo:false} );

  res.json({
    msg: req.body,
  });
};


const solicitudAmigos = async (req, res = response) => {
  const { id } = req.params;
    

  let amigos = await Usuario.aggregate([
    { "$lookup": {
      "from": Amigos.collection.name,
      "let": { "amigos": "$amigos" },
      "pipeline": [
        { "$match": {
          "destinatario": Types.ObjectId(id),
          "$expr": { "$in": [ "$_id", "$$amigos" ] }
        }},
        { "$project": { "status": 1 } }
      ],
      "as": "friends"
    }},
    { "$addFields": {
      "friendsStatus": {
        "$ifNull": [ { "$min": "$friends.status" }, 0 ]
      }
    }},
    {$match:{friendsStatus:3    }}
  ])

  let pendientes = await Usuario.aggregate([
    { "$lookup": {
        "from": Amigos.collection.name,
        "let": { "amigos": "$amigos" },
        "pipeline": [
          { "$match": {
            "destinatario": Types.ObjectId(id),
            "$expr": { "$in": [ "$_id", "$$amigos" ] }
          }},
          { "$project": { "status": 1 } }
        ],
        "as": "friends"
      }},
      { "$addFields": {
        "friendsStatus": {
          "$ifNull": [ { "$min": "$friends.status" }, 0 ]
        }
      }},
      {$match:{friendsStatus: 2}}
  ]);

  let solicitudes = await Usuario.aggregate([
    { "$lookup": {
        "from": Amigos.collection.name,
        "let": { "amigos": "$amigos" },
        "pipeline": [
          { "$match": {
            "destinatario": Types.ObjectId(id),
            "$expr": { "$in": [ "$_id", "$$amigos" ] }
          }},
          { "$project": { "status": 1 } }
        ],
        "as": "friends"
      }},
      { "$addFields": {
        "friendsStatus": {
          "$ifNull": [ { "$min": "$friends.status" }, 0 ]
        }
      }},
      {$match:{friendsStatus: 1}}
  ]);



  res.json({
    solicitudes,
    pendientes,
    amigos
    // msg:'hola'
  });
};

const aceptarSolicitud = async (req, res = response) => {
  const { id } = req.params;
  const { userRecibe } = req.body;

  // requester/solicitante    recipient/Destinatario

  await Amigos.findOneAndUpdate(
    { solicitante: id, destinatario: userRecibe },
    { $set: { status: 3 } }
  );

  await Amigos.findOneAndUpdate(
    { destinatario: id, solicitante: userRecibe },
    { $set: { status: 3 } }
  );

  await Usuario.findOneAndUpdate(
    {_id:id}, 
    { $set:{couple: true} }
  );
  await Usuario.findOneAndUpdate(
    {_id:userRecibe}, 
    { $set:{couple: true} }
  );

  await Usuario.findOneAndUpdate( { _id: id },{nuevo:false} );
  await Usuario.findOneAndUpdate( { _id: userRecibe },{nuevo:false} );
  
  res.json({
    total: "aceptado",
    userRecibe,
    id,
  });

  
};

const deleteAmigos = async (req,res = response) => {
  const { id } = req.params;
  const {destinatario,solicitante } = await Amigos.findOne({_id:id});

  
  await Usuario.findOneAndUpdate(
    {_id:destinatario}, 
    { $set:{couple: false} }
  );
  await Usuario.findOneAndUpdate(
    {_id:solicitante}, 
    { $set:{couple: false} }
  );

  await Usuario.findOneAndUpdate(
    {_id:destinatario}, 
    { $unset:{amigos: 1} }
  );
  await Usuario.findOneAndUpdate(
    {_id:solicitante}, 
    { $unset:{amigos: 1} }
  );

  await Amigos.findOneAndDelete({destinatario: destinatario});
  await Amigos.findOneAndDelete({destinatario: solicitante});

  await Usuario.findOneAndUpdate( { _id: destinatario },{nuevo:true} );
  await Usuario.findOneAndUpdate( { _id: solicitante },{nuevo:true} );

  res.json({
    total: "Eliminado",
    destinatario,solicitante
  });
}
module.exports = {
  amigosSend,
  solicitudAmigos,
  aceptarSolicitud,
  deleteAmigos
};
