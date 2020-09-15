var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
    name: { type: String, required: true },
    mobile: { type: Number, required: true },
    pincode: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true }
});

module.exports = mongoose.model("Shipping", schema);

//mongoose.model('Product', productDetailSchema);

// const shopDetailmodel = mongoose.model('Shop', shopDetailSchema);
// module.exports = shopDetailmodel;