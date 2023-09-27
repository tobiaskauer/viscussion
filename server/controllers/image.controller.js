const db = require("../models");
const Image = db.images;
const Trace = db.traces;
var sizeOf = require("image-size");

exports.create = (req, res) => {
  if (!req.file) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  let dim = sizeOf(req.file.path);
  // Create a Tutorial
  const image = {
    title: req.body.title,
    source: req.body.source,
    url: req.file.path,
    width: dim.width,
    height: dim.height,
  };

  Image.create(image)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  //const title = req.query.title;
  //var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  Image.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Image.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find image with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving image with id=" + id,
      });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  console.log(req.params);
  Image.update(
    { visible: req.body.visible },
    { where: { id: +req.params.id } }
  ).then((result) => {
    console.log(result);
  });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  if (!req.params.id) {
    res.status(400).send({
      message: "please pass an image id!",
    });
    return;
  }

  Image.destroy({
    where: {
      id: req.params.id,
    },
  }).then((u) => {
    res.status(200).send({ message: `deleted ${req.params.id}... hopefully` });
    Trace.destroy({
      where: { image: req.params.id },
    });
  });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {};
