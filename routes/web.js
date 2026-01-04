const homeController=require("../app/http/controllers/homecontrollers");
const customerController=require("../app/http/controllers/customercontroller");
const authsController=require("../app/http/controllers/authcontroller");
const orderController=require("../app/http/controllers/ordercontroller");
const adminOrderController=require("../app/http/controllers/admin/ordercontroller");
const statusOrderController=require("../app/http/controllers/admin/statuscontroller")
const guest=require("../app/http/middlewares/guest")
const auth=require("../app/http/middlewares/auth")
const admin=require("../app/http/middlewares/admin")
const placeorder=require("../app/http/middlewares/placeorder")

function initRoutes(app)
{
    app.get("/",homeController().index);    
    // app.post("/filter-menu",homeController().filter);    

    // authController:-
    // login
    app.get("/login",guest,authsController().login)
    app.post("/login",authsController().postLogin)

    //register
    app.get("/register",guest,authsController().register);
    app.post("/register",authsController().postRegister);

    //logout
    app.post("/logout",authsController().logout);

    //Customer  routs
    app.get("/cart",customerController().cart);
    app.post("/update-cart",customerController().update);  //update cart
    app.post("/delete-cart",customerController().delete);  //delete cart
    app.post("/decrement-cart",customerController().decrement);  //
    app.post("/increment-cart",customerController().increment);  //delete cart
    // app.post("/inc-Cart",customerController().incCart);  //delete cart
    app.get("/customer/orderPlace",placeorder,orderController().place);
    // app.get("/customer/order-details",orderController().details);
    app.post("/order",auth,orderController().order); //order
    app.get('/customer/order',auth,orderController().index)//order
    app.get('/customer/orders/:id',auth,orderController().show)


    // Admin routs
    app.get('/admin/order',admin,adminOrderController().index)
    app.post('/admin/order/status',admin,statusOrderController().update)
   
}
module.exports=initRoutes;