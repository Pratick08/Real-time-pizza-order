function placeorder(req,res,next)
{
    if(req.session.cart){
        return next();
    }
    return res.redirect("/")
}
module.exports=placeorder;