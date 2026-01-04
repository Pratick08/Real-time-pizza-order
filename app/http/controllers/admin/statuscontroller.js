const Order = require("../../../models/order");
function statuscontroller() {
    return {
        async update(req, res) {
            try {
                let id = { _id: req.body.orderId };
                let newStatus = { status: req.body.status };
                await Order.updateOne(id, newStatus);
                return res.redirect("/admin/order");
            } catch (err) {
                console.error(err);
                return res.redirect("/admin/order");
            }
        }
    }
}
module.exports = statuscontroller;