import {IDonor} from "../models/donor";

const nodemailer = require("nodemailer");

const account = {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
    name: "Tumaini Team",
    email: 'contact@tumaini.be'
}
const replyTo = process.env.MAIL_REPLYTO


const transporter = nodemailer.createTransport({
    host: "in-v3.mailjet.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: account.user, // generated ethereal user
        pass: account.pass, // generated ethereal password
    },
});

function sendMail(toEmail: string, toName: string, subject: string, body: string, fromEmail?: string): any {
    const to = toName.length > 0 ? `"${toName}" <${toEmail}>` : toEmail
    return transporter.sendMail({
        from: `"${account.name}" <${fromEmail ? fromEmail : account.email}>`, // sender address
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


export function sendStandardMail(toMail: string, subject: string, message: string, fromEmail?: string): boolean {
    const html = "<div style=\"margin: 10px;\">\n" +
        "    <p>" +
        message +
        "   </p>" +
        "</div>"
    const request = sendMail(toMail, "", subject, html, fromEmail)
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

export function sendNewDonorMail(donor: IDonor): boolean {
    let spendenOption
    switch (donor.option) {
        case 2:
            spendenOption = "2 (Forestering: 25€ / Monat)"
            break
        case 3:
            spendenOption = "3 (Sponsorship: 200€ / Monat)"
            break
        case 1:
            spendenOption = "1 (Support: 5550 €)"
            break
        default:
            spendenOption = "Just Information"

    }
    const html = "<div style=\"margin: 10px;\">\n" +
        "<p>" +
        "Sehr geehrter Herr Eberlein, <br /> <br /> " +
        "Soeben hat sich ein neuer Spender eingetragen. Seine Daten finden Sie unten. <br /> <br />" +
        "Mit freundlichen Grüßen, <br />" +
        "Ihr Server <br /> <br /> " +
        "</p>" +
        "<table>" +
        "<tr><td><b>Art</b></td><td><b>Daten</b></td></tr>" +
        `<tr><td>Vorname:</td><td>${donor.firstName}</td></tr>` +
        `<tr><td>Nachname:</td><td>${donor.lastName}</td></tr>` +
        `<tr><td>E-Mail:</td><td>${donor.email}</td></tr>` +
        `<tr><td>Telefon:</td><td>${donor.phone}</td></tr>` +
        `<tr><td>Adresse:</td><td>${donor.address}</td></tr>` +
        `<tr><td>Spendenoption:</td><td>${spendenOption}</td></tr>` +
        "</table>" +
        "</div>"
    const request = sendMail('admin@tumaini.be', "Tumaini Admin", "Neuer Spender!", html)
    return request
        .then(() => {
            console.log(`Neuer-Spender-Email was send.`)
            return true
        })
        .catch((err: any) => {
            console.log(`Email wasn't send. Error: ${err}`)
            return false
        })
}
