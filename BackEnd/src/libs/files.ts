import fs from 'fs'
import { UPLOAD_PATH } from '../../config.js'

type user={
    id:string,
    type:string,
    school:string
}

function IsUserAllowedToAccessFile(user:user,filename:string) {
    return true
}


export function UploadToServer(user:user,file:any) {
    return true
}

export function AllowFileDownload(user:user,filename:string) {
    return true
}

export function DeleteFromServer(user:user,filename:string) {
    return true
}


export function EnsureFoldersExist(paths:string[]) {
    paths.forEach(path => {
        if (!fs.existsSync(`${UPLOAD_PATH}/${path}`)) {
            fs.mkdirSync(`${UPLOAD_PATH}/${path}`, { recursive: true });
        }
    })
}

