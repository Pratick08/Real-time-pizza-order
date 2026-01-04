const User = require("../../models/user")
const bcrypt = require("bcrypt");
const passport = require("passport")
function authsController() {
    function _getRedirectUrl(req){
        return req.user.role==="admin"?"/admin/order":"/customer/order";
    }
    return {
        register(req, res) {
            res.render("auths/register")
        },
        async postRegister(req, res) {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                req.flash('error', 'All fields are Require')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect("/register")
            }
            // if email already exist 
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                req.flash('error', 'Email Already Exists')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect("/register")
            }
            // hash password
            const hashPassword = await bcrypt.hash(password, 10);  //hash(data , salt)
            // create user 
            const user = new User({
                name,
                email,
                password: hashPassword
            })
            user.save().then((user) => {
                return res.redirect("/login")
            }).catch((err) => {
                req.flash('error', 'Something went wrong')
                return res.redirect("/register")

            })

        },
        login(req, res) {
            res.render("auths/login")
        },
        postLogin(req, res, next) {
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    req.flash('error', info.message);
                    return next(err);
                }
                if (!user) {
                    req.flash('error', info.message)
                    return res.redirect('/login');
                }
                req.login(user, (err) => {
                    if (err) {
                        req.flash('error', info.message);
                        return next(err);
                    }
                    return res.redirect(_getRedirectUrl(req));
                })
            })(req, res, next)
        },
        logout(req, res) {
            req.logout((err) => {

            })
            return res.redirect("/login");
        }
    }
}
module.exports = authsController;
