module.exports = (sequelize, Sequelize) => {
    const Trace = sequelize.define("trace", {
      category: {
        type: Sequelize.STRING
      },
      text: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.INTEGER
      },

      x: {
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
      }

    });
  
    return Trace;
  };