const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();

//setup server
const app= express();
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=> console.log(`Hello  Server started on port: ${PORT}`));
app.use(express.json());
app.use(cookieParser());
//connect to mongoDB
mongoose.connect(process.env.MDB_CONNECT, {
  useNewUrlParser: true, // Bu seçeneklerin kullanılması önerilir
  useUnifiedTopology: true,  // Bu seçeneklerin kullanılması önerilir
  // Diğer bağlantı seçenekleri
})
  .then(() => {
    console.log('MongoDB bağlantısı başarıyla oluşturuldu');
  })
  .catch((error) => {
    console.error('MongoDB bağlantısı sırasında hata oluştu:', error);
  });

  //setup routes

  app.use("/auth", require("./routers/userRouter"));
  app.use("/customer", require("./routers/customerRouter"));