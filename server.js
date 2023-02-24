const express = require("express")
const app = express()
const db = require('./database')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

var dbEncryption

app.listen(5000, () => {
    console.log("app is listening to 5000");
    db.init()
})

app.get("/", (req,res) => {
    res.render("login.ejs")
})

app.get("/register", (req,res) => {
    res.render("register.ejs")
})

app.post("/register", async (req,res) => {
    if(req.body.password != '') {
        try {
            dbEncryption = await bcrypt.hash(req.body.password, 10)
            await db.register(req.body.username, dbEncryption)
            res.render("login.ejs")    
        } catch (error) {
            console.log(error);
        }
    }
})


app.get("/login", (req,res) => {
    res.render("login.ejs")
})

app.post("/login", async (req,res) => {
    await db.getUser(req.body.username)
    .then(result => {
        var count = Object.keys(result).length
        if (count == 0) {
            // return res.status(400).send('cannot find user')
            return res.render("fail.ejs")
        }
        dbEncryption = result[0].password
    })
    //compare
    try {
        if (await bcrypt.compare(req.body.password, dbEncryption)){
            res.render("start.ejs")
            //create a jwt token save in a string and logged 
            const token = jwt.sign(req.body.username, process.env.TOKEN)
            console.log(token);
        } else {
            res.render("fail.ejs")
        }
    } catch (error) {
        console.log(error);
    }
})