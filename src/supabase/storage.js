import { supabase } from './config'
import imageCompression from 'browser-image-compression';


const uploadPDF = async (rute, file, fileName, updateUserData) => {

    await supabase
        .storage
        .from(rute)
        .upload(fileName, file, {
            cacheControl: '0',
            contentType: 'application/pdf',
            upsert: false
        })

    const { data } = await supabase
        .storage
        .from(rute)
        .getPublicUrl(fileName)

    console.log(data)

    return updateUserData(rute, { pdfURL: data.publicUrl }, fileName, 'qr')
}


const uploadStorage = async (rute, file, fileName, updateUserData, update) => {
    const options = {
        maxWidthOrHeight: 500,
        maxSizeMB: 1,
        alwaysKeepResolution: true,
        useWebWorker: true,
        maxIteration: 200,
        fileType: 'image/webp'
    }
    const compressedFile = file.type != 'image/gif' ? await imageCompression(file, options) : file

    const imagesRef = `${fileName}.webp`
    console.log(imagesRef)
    if (update === true) {
        const res = await supabase
            .storage
            .from(rute)
            .update(imagesRef, compressedFile, {
                cacheControl: '0',
                upsert: false
            })
        console.log(res)
    } else {
        const res = await supabase
            .storage
            .from(rute)
            .upload(imagesRef, compressedFile, {
                cacheControl: '0',
                upsert: false
            })
        console.log(res)
    }


    const res = await supabase
        .storage
        .from(rute)
        .getPublicUrl(imagesRef)

    console.log(res)

    return updateUserData(rute, { url: res.data.publicUrl }, fileName)
}

export { uploadStorage, uploadPDF }