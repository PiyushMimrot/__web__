export const InstilUser={
  Admin:'admin',
  Student:'student',
  Staff:'staff',
  Teacher:"teacher",
  Parent:'parent',
  Accountant:"Accountant",
  SupperAdmin :"supperadmin"
} as const


const CONFIG: { [key: string]: string } = {
  production: "https://instil.techtok4u.in/sms",
  dev_deployment: "https://api.techtok4u.org",
  development: "http://localhost:5000"
} as const

if(import.meta.env.VITE_ENV=="production") console.log = function (...args) { };
export const SERVER = CONFIG[import.meta.env.VITE_ENV]





/* 

SHEETJS - XLSX
https://docs.sheetjs.com/docs/getting-started/installation/nodejs/



*/
