module.exports = templateData => {
  return (
    require("./templates/layout.ejs")({...templateData,
      head: require("./include/head.ejs")(templateData),
      header: require("./include/header.ejs")(templateData),
      footer: require("./include/footer.ejs")(templateData),
      body: require("./templates/" + templateData.htmlWebpackPlugin.options.page + ".ejs")(templateData)
    })
  );
};