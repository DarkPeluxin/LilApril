const { model, Schema } = require("mongoose");

let LockdownSchema = new Schema({
    GuilID: String,
    ChannelID: String,
    Time: String
})

module.exports = model("Lock", LockdownSchema)