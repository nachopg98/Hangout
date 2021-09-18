const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/hangout',{
    useCreateIndex: true,
    useNewUrlParser:true,
    useFindAndModify:false,
    useUnifiedTopology: true
})
  .then(db => console.log("DB connceted"))
  .catch(err => console.error(err));