const mongoose = require("../mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("../bcrypt");

const messageSchema = new Schema({
    handle: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

const chatRoomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    messages: [messageSchema]
});

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true
    }
});

const auctionSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
    price: {
        type: Number,
        min: 0.01,
        required: true
    },
    type: {
        type: String,
        enum: ["Bid", "Buy"]
    },
    seller: {
        type: String,
        required: true
    },
    buyer: {
        type: String,
        default: ""
    },
    bidders: [{ type: String }],
    timeLeft: {
        type: Number,
        min: 1
    },
    status: {
        type: String,
        enum: ["OnSale", "Sold", "Ignored"]
    }
});

// bez poniższej wtyczki nie dostaniemy sensownego sygnału
// błędu przy naruszeniu „unikatowości” nazwy użytkownika
const uniqueValidator = require("mongoose-unique-validator");
// ale z nią – już wszystko będzie jak należy
userSchema.plugin(uniqueValidator);

userSchema.methods.isValidPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const Message = mongoose.model("Message", messageSchema);
const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema, "chatRooms");
const User = mongoose.model("User", userSchema);
const Auction = mongoose.model("Auction", auctionSchema);

// mały „postprocessing” błędów mongoosowych
const processErrors = (err) => {
    const msg = {};
    for (const key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

module.exports = {
    Message,
    ChatRoom,
    User,
    Auction,
    processErrors
};
