const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    usuario:{ type: String, required: true},
    email:{ type: String, required: true},
    contraseña:{ type: String, required: true},
    filename: {type: String},
    date:{type: Date, default: Date.now},
    tienda:{type: Schema.Types.ObjectId, ref: "Tienda"},
});

UserSchema.methods.encryptPassword = async (contraseña) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(contraseña,salt);
    return hash;
};

UserSchema.methods.matchPassword = async function (contraseña){
    return await bcrypt.compare(contraseña, this.contraseña);
};


module.exports = mongoose.model('User',UserSchema);
