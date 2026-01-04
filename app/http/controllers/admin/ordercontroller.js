const Order=require("../../../models/order")
function adminOrderController()
{
    return{
        async index(req,res)
        {
             try {
            const orders = await Order.find({ status: { $ne: 'completed' } })
                .sort({ createdAt: -1 })
                .populate('customerId', '-password');
                

            if (req.xhr) {
                return res.json(orders);
            } else {
                return res.render("admin/order", { orders:orders});
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
        }

        }
    }
}
module.exports=adminOrderController;