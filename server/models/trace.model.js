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
      defaultValue: 0,
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
    createdSeparately: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    parent: {
      type: Sequelize.INTEGER, //next time, use a proper key :)
    },

    /*x: {
        type: Sequelize.INTEGER
      },
      y: {
        type: Sequelize.INTEGER
      },2
      width: {
        type: Sequelize.INTEGER
      },
      height: {
        type: Sequelize.INTEGER
      }*/
  });

  return Trace;
};
