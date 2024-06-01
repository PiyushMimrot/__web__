import email from  'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const ALLOW_EMAILS=process.env.ALLOW_EMAILS=='always';

const transporter =ALLOW_EMAILS?email.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_NAME,
        pass: process.env.GMAIL_APP_PASS
    }
}):null;

export function sendEmail(subject:string,html:string,then?:()=>void) {
    if(!ALLOW_EMAILS) return;
    transporter?.sendMail( {
        from: process.env.GMAIL_NAME,
        subject,
        to: 'abhiramns345@gmail.com',
        html
    },
    function(error, info){
        if (error) {
            console.log('Email sending email', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        if(then) then()
    })
}


export function formattedHtmlFromError(err:Error){

    let fstr='<h2>Error Informations</h2>\n'
    for(let i in err){
        fstr=`${fstr}\n<h3>${i}::</h3>\n\t${(err as any)[i]}\n`
    }

return`
${fstr}

<h3>Error name</h3>
    ${err.name??"Unavilable"}

<h3>Cause</h3>
    ${err.cause??"Unknown"}

<h3>Stacktrace</h3>
    ${err.stack??"Unavilable"}
<br/>
<br/>
<em>This is an automated email send from the server to report errors.</em>
`
}