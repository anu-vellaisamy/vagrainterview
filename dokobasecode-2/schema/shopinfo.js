let mongoose = require("mongoose");
let shopinfoSchema = mongoose.Schema(
    {
        name: { type: String, required: true},
        domain: { type: String, required: true},
    },    
    { timestamps: true, versionKey: false }
);

let shopinfo = mongoose.model("shopinfo", shopinfoSchema);
module.exports = shopinfo;
