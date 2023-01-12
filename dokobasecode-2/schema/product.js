let mongoose = require("mongoose");
let productSchema = mongoose.Schema(
    {
        id: { type: Number, required: true},
        title: { type: String, required: true},
        status: { type: String, required: true},
        variants: { type: Array, required: true},
        images: { type: Array, required: true},
        created_at: { type: String, required: true}
    },    
    { timestamps: true, versionKey: false }
);

let product = mongoose.model("product", productSchema);
module.exports = product;
