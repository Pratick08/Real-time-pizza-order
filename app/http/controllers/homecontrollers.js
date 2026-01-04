const Menu = require("../../models/menu");
function homecontrollers() {
    return {
        async index(req, res) {
            const pizzas = await Menu.find()
            return res.render("home", { pizzas: pizzas });
        }
    }
}
module.exports = homecontrollers;