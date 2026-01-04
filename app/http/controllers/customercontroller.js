const Menu = require('../../models/menu')
function customerControllers() {
    return {
        cart(req, res) {
            res.render("customer/cart");
        },
        async update(req, res) {

            let pizzaId = req.body.pizza;
            let pizzaItem = await Menu.findById(pizzaId)
            // console.log(pizzaItem)
            if (!req.session.cart) {
                req.session.cart = {
                    item: {},
                    totalQty: 0,
                    totalPrice: 0,
                }
            }
            let cart = req.session.cart
            // console.log(req.body);
            // check if cart does not exist
            if (!cart.item[pizzaItem._id]) {
                cart.item[pizzaItem._id] = {
                    items: pizzaItem, //object
                    qty: 1
                }
                cart.totalQty = cart.totalQty + 1;
                cart.totalPrice = cart.totalPrice + pizzaItem.price;
            }

            else {
                cart.item[pizzaItem._id].qty = cart.item[pizzaItem._id].qty + 1;
                cart.totalQty = cart.totalQty + 1;
                cart.totalPrice = cart.totalPrice + pizzaItem.price;
            }

            // console.log(pizzaItem);


            // return res.status(200).json({ data: "all ok", pizza: pizzaItem });
            //
            return res.json({ totalQty: req.session.cart.totalQty });
        },
        async delete(req, res) {
            // delete cart
            let pizzaId = req.body.pizza;
            let cart = req.session.cart;
            console.log(cart.totalQty)
            if (cart && cart.item[pizzaId]) {
                let qty = cart.item[pizzaId].qty;
                let price = cart.item[pizzaId].items.price;

                // Update total quantity and total price
                cart.totalQty -= qty;
                cart.totalPrice -= qty * price;

                // Delete the item from the cart
                delete cart.item[pizzaId];
                if (cart.totalQty == 0) {
                    delete req.session.cart
                }
            // return res.status(200).json({ data: "all ok" });

                return res.redirect("/cart");
            }
        },
        async increment(req, res) {
            let pizzaId = req.body.pizzaid;
            let cart = req.session.cart;
            let cartItem = cart.item[pizzaId];
            if (pizzaId === cartItem.items._id) {
                if (cartItem.qty < 10) {
                    cart.totalQty += 1;
                    cart.totalPrice += cartItem.items.price;
                    cartItem.qty += 1;
                    // console.log("trueeee");
                }
            }
            return res.json({totalQty:req.session.cart.totalQty,totalPrice:cart.totalPrice,qty:cartItem.qty,items:cartItem.items });
            // return res.redirect("/cart");
        },
        async decrement(req, res) {
            let pizzaId = req.body.pizzaid;
            let cart = req.session.cart;
            let cartItem = cart.item[pizzaId];
            // console.log(cartItem);
            if (pizzaId === cartItem.items._id) {
                if (cartItem.qty > 1) {
                    cart.totalQty -= 1;
                    cart.totalPrice -= cartItem.items.price;
                    cartItem.qty -= 1;
                    // console.log("trueeee");
                }
                return res.json({totalQty:req.session.cart.totalQty,totalPrice:cart.totalPrice,qty:cartItem.qty,items:cartItem.items});
            }
        }
    }
}
module.exports = customerControllers;