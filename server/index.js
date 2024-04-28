const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const cors = require('cors')

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'quangmstmc',
    database: 'user',
})

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true}))

// get api
app.get("/api/get", (req, res) => {
    const sqlGet = "SELECT * FROM user"
    db.query(sqlGet, (err, result) => {
        if (err) throw err
        res.send(result)
    })
})

// connect api login
app.post("/login", (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const email = req.body.email
    const sqlLogin = "SELECT * FROM user.user WHERE username = ? AND  password = ? "
    db.query(sqlLogin,[username, password], (err, result) => {
        if (err) {
            console.log(err)
        }else{
            if (result.length > 0) {
                res.send(result)
                console.log('dung roi')
            } else {
                res.send({ message: "Username or password is incorrect" })
            }
        }
    })
})
app.get('/',(req,res)=>{
    // const sqlInsert =  "INSERT INTO user (id, username, password, email) VALUES ('11','demo2', '2' ,'demo2@demo.com')"
    // db.query(sqlInsert, (err, result)=>{
    //     console.log(err)
    //     console.log(result)
    // })
})
app.listen(5000, ()=>{
    console.log('listening on port 5000 ')
})
