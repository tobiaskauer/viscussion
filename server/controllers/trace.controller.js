const db = require("../models");

const Trace = db.traces;
const Anchor = db.anchors;
const Op = db.Sequelize.Op;

Trace.Anchors = Trace.hasMany(Anchor, {
  foreignKey: "traceId",
});
Anchor.belongsTo(Trace);

// Create and Save a new Tutoria
exports.create = (req, res) => {
  // Validate request
  if (!req.body.image) {
    res.status(400).send({
      message: "Image ID can not be empty!",
    });
    return;
  }

  Trace.create(
    {
      category: req.body.category,
      text: req.body.text,
      image: req.body.image,
      author: req.body.author,
      date: req.body.date,
      score: req.body.score,
      anchors: req.body.anchors,
      redditCommentId: req.body.redditId,
    },
    {
      include: [
        {
          association: Trace.Anchors,
        },
      ],
    }
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findImageTraces = (req, res) => {
  const image = req.params.image;

  Trace.findAll({
    include: Anchor,
    where: {
      image: image, //image id
      //width: { [Op.gt]: 0 }, //width > 0
      //height: { [Op.gt]: 0 },
    } /*,
    attributes: [
      "id",
      "category",
      "text",
      "image",
      "anchor.x",
      "y",
      "width",
      "height",
      "createdAt",
    ],*/,
  })
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

exports.findAll = (req, res) => {
  Trace.findAll({
    attributes: [
      "id",
      "category",
      "text",
      "image",
      "x",
      "y",
      "width",
      "height",
      "createdAt",
    ],
  })
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
exports.findOne = (req, res) => {};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {};
