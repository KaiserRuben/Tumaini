const nodemailer = require("nodemailer");

const account = {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
    name: process.env.MAIL_USER
}
const replyTo = process.env.MAIL_REPLYTO


const transporter = nodemailer.createTransport({
    host: "in-v3.mailjet.com",
    port: 587,
    secure: true, // true for 465, false for other ports
    auth: {
        user: account.user, // generated ethereal user
        pass: account.pass, // generated ethereal password
    },
});

function sendMail(toEmail: string, toName: string, subject: string, body: string): any {
    const to = toName.length > 0 ? `"${toName}" <${toEmail}>` : toEmail
    return transporter.sendMail({
        from: `"KultNow Team" <${account.name}>`, // sender address
        to: to, // list of receivers
        replyTo: replyTo, // list of receivers
        subject: subject, // Subject line
        html: body, // html body
    }).then((info: any) => {
        return info
    }).catch((e: any) => console.warn(e))

}

export function sendPwByMail(email: string, toUsername: string, password: string): boolean {
    const html = "<div style=\"margin: 10px;\">\n" +
        "      <div\n" +
        "        style=\"\n" +
        "          width: 100%;\n" +
        "          display: flex; /* align-items: flex-end; */\n" +
        "          flex-direction: row-reverse;\n" +
        "        \"\n" +
        "      >\n" +
        "      </div>" +
        "    <p>" +
        `      Dear ${toUsername},` +
        "    </p>" +
        "    <p>" +
        `       Your new password is <b>${password}</b>.<br />` +
        "       Sign in to change your password to a password of your choice." +
        "   </p>" +
        "   <p>" +
        "      Sincerely,<br /><br />" +
        "      Webadmin" +
        "</p>" +
        "</div>"

    const request = sendMail(email, toUsername, "Your new password.", html)
    return request
        .then(() => {
            console.log(`Email was send to ${email}`)
            return true
        })
        .catch((err: any) => {
            console.log(`Email wasn't send. Error: ${err}`)
            return false
        })

}

export function sendStandardMail(toMail: string, subject: string, message: string): boolean {
    const html = "<div style=\"margin: 10px;\">\n" +
        "      <div\n" +
        "        style=\"\n" +
        "          width: 100%;\n" +
        "          display: flex; /* align-items: flex-end; */\n" +
        "          flex-direction: row-reverse;\n" +
        "        \"\n" +
        "      >\n" +
        "      </div>" +
        "    <p>" +
        message +
        "   </p>" +
        "   <p>" +
        "      KultNow Team" +
        "</p>" +
        "</div>"
    const request = sendMail(toMail, "", subject, html)
    return request
        .then(() => {
            console.log(`Email was send to ${toMail}`)
            return true
        })
        .catch((err: any) => {
            console.log(`Email wasn't send. Error: ${err}`)
            return false
        })
}
