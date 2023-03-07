const db = require("../models");
const Trace = db.traces;
const Op = db.Sequelize.Op;

// Create and Save a new Tutoria
exports.create = (req, res) => {

    // Validate request
    if (!req.body.x) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    // Create a Tutorial
    const trace = {
      category: req.body.category,
      text:req.body.text,
      image:req.body.image,
      x: req.body.x,
      y: req.body.y,
      width:req.body.width,
      height:req.body.height,

    };
 
    // Save Tutorial in the database
    Trace.create(trace)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial."
        });
      });
  };

// Retrieve all Tutorials from the database.
exports.findImageTraces = (req, res) => {
  const image = req.params.image;
    
    Trace.findAll({
      where: {
        image: image, //image id
        width: {[Op.gt]: 0}, //width > 0
        height: {[Op.gt]: 0},
      },
      attributes: ["id", "category", "text", "image", "x", "y", "width", "height","createdAt"]
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      });
  };

exports.findAll = (req, res) => {
  Trace.findAll({
    attributes: ["id", "category", "text", "image", "x", "y", "width", "height","createdAt"]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  
};