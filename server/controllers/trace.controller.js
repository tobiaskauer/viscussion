const db = require("../models");
const { sequelize } = require("../models/index");

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
      parent: req.body.parent,
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
      image: image,
    },
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

exports.upvote = (req, res) => {
  if (!req.params.id) {
    res.status(400).send({
      message: "Trace ID can not be empty!",
    });
    return;
  }
  //Trace.increment("score", {by: 1, where: { id: req.params.id } })
  Trace.update(
    { score: sequelize.literal("score + 1") },
    { where: { id: req.params.id } }
  )
    .then((data) => {
      if (data[0]) {
        console.log("success");
        res.status(200).send(data);
      } else {
        console.log("fail");
        res.status(500).send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while upvoting.",
      });
    });
};

exports.findAll = (req, res) => {
  Trace.findAll({
    include: Anchor,
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

exports.delete = (req, res) => {
  if (!req.params.id) {
    res.status(400).send({
      message: "please pass an image id!",
    });
    return;
  }

  Trace.destroy({
    where: {
      id: req.params.id,
    },
  }).then((u) => {
    res.status(200).send({ message: `deleted ${req.params.id}... hopefully` });
  });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  console.log("foobar", req);
};
