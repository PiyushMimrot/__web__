import { formattedHtmlFromError, sendEmail } from "./src/libs/email.js";

export const InstilUser={
    Admin:'admin',
    Student:'student',
    Staff:'staff',
    Teacher:"teacher",
    Parent:'parent'
} as const


const SERVER = process.env.NODE_ENV=="development"?"http://localhost:5173":"http://techtok4u.org/"

export const UPLOAD_PATH = process.env.UPLOAD_PATH ?? "/uploads";

process.on('uncaughtException', function (err) {
    console.log(`uncaughtException::${err}`);
    sendEmail('NodeJS crash report from instil.techtok4u.in(Immediate Attention needed)',
    `Server crashed<br/>uncaughtException:<br/> ${formattedHtmlFromError(err)}`)
    process.exit(-1)
})

process.on('unhandledRejection',function(err){
    console.log('unhandledRejection')
    sendEmail('NodeJS crash report from instil.techtok4u.in',
    `unhandledRejection:<br/>${formattedHtmlFromError(err as any)}`)
})

process.on('SIGTERM',function(err){
    console.log("SIGKTerm");
    sendEmail('NodeJS crash report from instil.techtok4u.in(Immediate Attention needed)',
    `SIGTERM::<br/>${formattedHtmlFromError(err as any)}`)
    process.exit(-1)
})


export { SERVER }
