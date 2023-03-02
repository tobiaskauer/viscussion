module.exports = (sequelize, Sequelize) => {
    const Image = sequelize.define("image", {
      title:  {type: Sequelize.STRING},
      source: {type: Sequelize.STRING},
      url:    {type: Sequelize.STRING},
      width:  {type: Sequelize.INTEGER},
      height:  {type: Sequelize.INTEGER},
    });
  
    return Image;
  };