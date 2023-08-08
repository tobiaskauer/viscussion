module.exports = (sequelize, Sequelize) => {
  const Trace = sequelize.define("trace", {
    category: {
      type: Sequelize.STRING,
    },
    text: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.INTEGER,
    },
    score: {
      type: Sequelize.INTEGER,
    },
    redditCommentId: {
      type: Sequelize.STRING,
    },
    author: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.DATE,
    },

    /*x: {
        type: Sequelize.INTEGER
      },
      y: {
        type: Sequelize.INTEGER
      },
      width: {
        type: Sequelize.INTEGER
      },
      height: {
        type: Sequelize.INTEGER
      }*/
  });

  return Trace;
};
