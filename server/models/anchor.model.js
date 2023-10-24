const db = require("../models");
const Trace = db.traces;

module.exports = (sequelize, Sequelize) => {
  const Anchor = sequelize.define("anchor", {
    traceId: {
      type: Sequelize.INTEGER,
      references: {
        model: Trace,
        key: "id",
      },
    },

    x: {
      type: Sequelize.INTEGER,
    },
    y: {
      type: Sequelize.INTEGER,
    },
    width: {
      type: Sequelize.INTEGER,
    },
    height: {
      type: Sequelize.INTEGER,
    },
  });

  return Anchor;
};
