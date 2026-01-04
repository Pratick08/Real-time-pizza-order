// const mongoose=require("mongoose");
// const Schema= mongoose.Schema;
// const orderSchema=new Schema({
//   customerId: {
//         type: mongoose.Schema.Types.ObjectId, 
//         required:true,
//         ref:'User'
// },
//   item:{ type:Object, required:true},
//   phone:{ type:String, required:true},
//   address:{ type:String, required:true},
//   paymentType:{type:String, default:"cash on delevery"},
//   status:{type:String,default:"order_placed"}
// },{timestamps:true})
// module.exports=mongoose.model("Order",orderSchema);


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    customerId:  { type: mongoose.Schema.Types.ObjectId,required: true, ref: 'User'  },
    item:        { type: Object, required: true },
    name:        { type: String, required: true },
    phone:       { type: String, required: true },
    pin:         { type: String, required: true },
    address:     { type: String, required: true },
    town:        { type: String, required: true },
    state:       { type: String, required: true },
    paymentType: { type: String, default: "cash on delivery"},
    status:      { type: String,  default: "order_placed"  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
