const mongoose = require("../mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("../bcrypt");

const messageSchema = new Schema({
    handle: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
});

const chatRoomSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
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
    name:{
        type: String,
        required: true,
        minlength: 3
    },
    price: {
        type: Number, //number or double?
        required: true,
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

const errorHandler = {};
// mały „postprocessing” błędów mongoosowych
errorHandler.processErrors = (err) => {
    let msg = {};
    for (let key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

module.exports.message = Message;
module.exports.chatRoom = ChatRoom;
module.exports.user = User;
module.exports.auction = Auction;

module.exports.errorHandler = errorHandler;