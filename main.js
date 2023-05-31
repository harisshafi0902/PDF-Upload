const path = require("path");
const express = require("express");
const multer = require("multer");
const app = express();
const PORT = 5000;
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const filePath = path.join(__dirname, "uploads", file.originalname);

    // Check if the file already exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // File does not exist, allow the upload
        cb(null, file.originalname);
      } else {
        // File already exists, reject the upload
        cb(new Error("File already exists."));
      }
    });
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed."));
  }
};

const upload = multer({ storage, fileFilter });

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("homepage");
});

app.post("/upload", upload.single("profileImage"), (req, res, next) => {
  console.log("=====>>>", req);
  if (req.fileExists) {
    // File already exists
    return res.status(409).send("File already exists.");
  }

  if (req.fileExtensionCheck) {
    // Only PDF files are allowed
    return res.status(400).send("Only PDF files are allowed.");
  }

  console.log(req.body);
  console.log(req.file);

  res.redirect("/");
});

app.listen(PORT, () => console.log("Server Started at PORT:5000"));

