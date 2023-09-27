module.exports = (sequelize, Sequelize) => {
  const Interaction = sequelize.define("interaction", {
    session: { type: Sequelize.STRING },
    image: { type: Sequelize.INTEGER },
    date: { type: Sequelize.DATE },
    patina: { type: Sequelize.STRING },
    action: { type: Sequelize.STRING },
    target: { type: Sequelize.STRING },
  });

  return Interaction;
};
