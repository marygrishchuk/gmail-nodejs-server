const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const nodemailer = require("nodemailer");
const app = express()

let port = process.env.PORT || 8080

app.use(cors())
app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())

let smtp_login = process.env.SMTP_LOGIN
let smtp_password = process.env.SMTP_PASSWORD

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: smtp_login,
        pass: smtp_password,
    },
})

app.post('/sendMessage', async (req, res) => {
    let {name, email, messageText} = req.body
    try {
        let info = await transporter.sendMail({
            from: `"${name}" <${email}>`, // sender address
            to: "mary.grishchuk1@gmail.com", // list of receivers
            subject: "New message from portfolio 'Contact me' form", // Subject line
            html: `<div><b>Name:</b> ${name}</div>
                   <div><b>Email:</b> ${email}</div>
                   <div><b>Message:</b> ${messageText}</div>`, // html body
        })
        console.log(info)
        res.send('ok')
    } catch (error) {
        console.warn(error)
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})