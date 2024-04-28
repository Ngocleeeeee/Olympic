"use strict";

var express = require("express");

var app = express();

var bodyParser = require("body-parser");

var mysql = require("mysql2");

var cors = require("cors");

var db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "quangmstmc",
  database: "user",
});
app.use(cors());
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
); // get api

app.get("/api/get", function (req, res) {
  var sqlGet = "SELECT * FROM user";
  db.query(sqlGet, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
}); // connect api login

//them phan dang ki
app.post("/api/post", function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var confirmPassword = req.body.confirmPassword;
  var email = req.body.email;

  //Kiểm tra xem tên người dùng, mật khẩu và mật khẩu xác nhận đã được cung cấp chưa
  if (!username || !password || !confirmPassword) {
    res.status(400).json({
      message: "Username, password, and confirm password are required",
    });
    return;
  }

  // Kiểm tra xem mật khẩu và xác nhận mật khẩu khớp
  if (password !== confirmPassword) {
    res.status(400).json({
      message: "Password and confirm password do not match",
    });
    return;
  }

  // Kiểm tra xem tên người dùng đã tồn tại chưa
  var sqlSelect = "SELECT * FROM user WHERE username = ?";
  db.query(sqlSelect, [username], function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({
        message: "Error querying database",
      });
      return;
    }
    if (result.length > 0) {
      res.status(400).json({
        message: "Username already exists",
      });
      return;
    }

    // thêm tk vào database
    var sqlInsert = "INSERT INTO user (username, password) VALUES (?, ?)";
    db.query(sqlInsert, [username, password], function (err, result) {
      if (err) {
        console.log(err);
        res.status(500).json({
          message: "Error inserting user into database",
        });
        return;
      }
      res.status(200).json({
        message: "User created successfully",
      });
    });
  });
});

app.post("/login", function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  var sqlLogin =
    "SELECT * FROM user.user WHERE username = ? AND  password = ? ";
  db.query(sqlLogin, [username, password], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length > 0) {
        res.send(result);
        console.log("dung roi");
      } else {
        res.send({
          message: "Username or password is incorrect",
        });
      }
    }
  });
});
app.get("/", function (req, res) {
  // const sqlInsert =  "INSERT INTO user (id, username, password, email) VALUES ('11','demo2', '2' ,'demo2@demo.com')"
  // db.query(sqlInsert, (err, result)=>{
  //     console.log(err)
  //     console.log(result)
  // })
});
app.listen(5000, function () {
  console.log("listening on port 5000 ");
});
