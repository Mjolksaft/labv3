const express = require("express")
const cors = require("cors")
const app = express()

app.set('view-engine', 'ejs')

app.get('/', (req,res) => {
    res.render('view.ejs')
})