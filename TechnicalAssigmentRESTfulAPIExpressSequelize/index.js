const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const Port = process.env.PORT || 3004;
const Sequalize = require("sequelize");
const app = express();
const { Hewan } = require("./models/index");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sequalize = new Sequalize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

sequalize
  .authenticate()
  .then(() => {
    console.log("Connection has been succes");
  })
  .then(() => {
    Hewan.sync().then(() => {
      console.log("Table Has been Created");
    });
  })
  .catch((err) => {
    console.log("Unable to Connect", err);
  });

// Get All Data
app.get("/hewan", (req, res) => {
  Hewan.findAll().then((result) => {
    res.json({
      data: result,
    });
  });
});

// Get Data By Id
app.get("/hewan/:id", (req, res) => {
  const hewanId = req.params.id;
  const hewanGet = Hewan.findOne({
    where: {
      id: hewanId,
    },
  })
    .then((result) => {
      res.send({
        result,
      });
    })
    .catch((err) => {
      res.send({
        msg: err.message,
      });
    });
});

// Post Data
app.post("/hewan", async (req, res) => {
  const body = req.body;
  const hewan = {
    nama: body["nama"],
    namaSpesies: body["namaSpesies"],
    umur: body["umur"],
  };

  try {
    await Hewan.create(hewan);
    res.status(201).send({
      msg: "Succes Created",
      data: hewan,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

// Put Data
app.patch("/hewan/:id", async (req, res) => {
  try {
    const hewanId = req.params.id;
    const body = req.body;
    const hewan = {
      nama: body["nama"],
      namaSpesies: body["namaSpesies"],
      umur: body["umur"],
    };

    await Hewan.update(hewan, {
      where: {
        id: hewanId,
      },
    });

    res.status(200).json({
      msg: "Update Succes",
    });
  } catch (error) {
    res.status(500).send({
      msg: error,
    });
  }
});

// Delete Data By Id
app.delete("/hewan/:id", (req, res) => {
  const hewanId = req.params.id;
  const hewanGet = Hewan.destroy({
    where: {
      id: hewanId,
    },
  })
    .then((result) => {
      res.send({
        msg: "Delete Succes",
      });
    })
    .catch((err) => {
      res.send({
        msg: err.message,
      });
    });
});

app.listen(Port, () => {
  console.log("Server is Running on", Port);
});
