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

app.get('/', (req, res) => {
    res.send("Hello! I'm an email sending server :)")
})

app.post('/sendMessage', async (req, res) => {
    let {name, email, messageText} = req.body
    try {
        //notifying sender that the message is received:
        let senderNotifiedInfo = await transporter.sendMail({
            from: `"no-reply" <mary.grishchuk1@gmail.com>`, // sender address
            to: `${email}`, // list of receivers
            subject: "Thank you for your message to Mary Grishchuk", // Subject line
            html: `<p>Dear ${name},</p>
                   <p><span>Thank you for your message to Mary Grishchuk. </span>
                   She will get in touch with you as soon as she reads it.</p>
                   <p>Have a great day!</p>
                   <p><span>** Please kindly note: Do not reply to this email. </span>
                   This email is sent from an unattended mailbox. Replies will not be read.</p>`, // html body
            dsn: {
                id: 'message_id',
                return: 'headers',
                notify: ['failure', 'delay'],
                recipient: 'mary.grishchuk1@gmail.com'
            }
        })
        //sending form data to myself including information about notifying the sender:
        let mailSentToMeInfo = await transporter.sendMail({
            from: `"${name}" <${email}>`, // sender address
            to: "mary.grishchuk1@gmail.com", // list of receivers
            subject: "New message from portfolio 'Contact me' form", // Subject line
            html: `<div><b>Name:</b> ${name}</div>
                   <div><b>Email:</b> ${email}</div>
                   <div><b>Message:</b> ${messageText}</div>
                   <div><b>Information about notifying the sender:</b> ${senderNotifiedInfo.envelope}</div>`,//html body
            dsn: {
                id: 'message_id',
                return: 'headers',
                notify: ['failure', 'delay'],
                recipient: 'mary.grishchuk1@gmail.com'
            }
        })
        console.log(mailSentToMeInfo)
        res.send('ok')
    } catch (error) {
        res.send('Failure to send. error: ' + error)
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})