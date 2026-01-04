const Order = require("../../models/order")
const moment = require("moment");
function ordercontroller() {
    return {
        order(req, res) {
            const { name,phone,pin,address, town,state} = req.body;
            // console.log(req.session.cart.item);
            if ( !phone ||  !address || !name || !pin || !town || !state ) {
                // req.flash('error', 'All fields are Require');
                req.flash('error', 'Please feelup all the details');
                return res.redirect("/customer/orderPlace");
            }

            if (phone.length < 10) {
                req.flash('error', 'Phone number must be 10 digits');
                return res.redirect("/customer/orderPlace");
            }
            console.log(phone.length);
            // MOST IMPORTENT PART ----->>>>
            const order = new Order({
                customerId: req.user._id,
                item:req.session.cart.item,
                name,
                phone,
                pin,
                address,
                town,
                state
            })
            console.log(order);
            order.save().then((order) => {
                req.flash('success', 'Order place succesfully');
                delete req.session.cart;
                return res.redirect("customer/order");
            }).catch((err) => {
                req.flash('error', 'Something went wrong');
                return res.redirect("/customer/orderPlace");

            })
        },
        async index(req, res) {
            try {
                const orders = await Order.find({ customerId: req.user._id }, null, { sort: { 'createdAt': -1 } });
                const formattedOrders = orders.map(order => ({
                    ...order.toObject(), // Convert Mongoose document to plain JavaScript object
                    formattedTimestamp: moment(order.createdAt).format('hh:mm A')
                }));
                res.render("customer/order", { orders: formattedOrders });
            } catch (error) {
                console.error(error);
                req.flash('error', 'Something went wrong');
                res.redirect("/cart");
            }
        },
        async show(req, res) {
            try {
                const order = await Order.findById(req.params.id);
                if (req.user._id.toString() === order.customerId.toString()) {
                    // console.log(order)
                    return res.render("customer/singleOrder", { order });
                }
            } catch (err) {
                console.error(err);
            }
        },
        async  place(req, res) {
              // console.log(order)
              let cart=req.session.cart;
              // let pizzaItem = await Menu.findById(pizzaId)
              return res.render("customer/orderPlace",{cart});
          },
        //   async details(req,res){
        //     return res.render("customer/order-details");
        //   }

    }
}
module.exports = ordercontroller;