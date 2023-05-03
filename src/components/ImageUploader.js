import { fetchFile } from '@ffmpeg/ffmpeg';
import { useState } from 'react';

export function ImageUploader({imageUrls, setImageUrls, ffmpeg}) {

    let file = null;
    const [files, setFiles] = useState([]);

    const splitUrl = (url) => {
        let splitUrl = url.split('/');
        return splitUrl[splitUrl.length-1];
    }

    const handleFileChange = async(e) => {
        // console.log(e.target.files[0]);
        file = e.target.files[0];
        setFiles([...files,file]);
        let url = URL.createObjectURL(file);
        console.log(url);
        setImageUrls([...imageUrls,url]);
        ffmpeg.FS('writeFile', `${splitUrl(url)}.png`, await fetchFile(String(url)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // access properties of 'file' state
        console.log(files[files.length-1].name);
        console.log(files[files.length-1].type);
        console.log(files[files.length-1].size);
    };


    return (
        <>
        <div style={{display:"flex",alignItems:"center"}}>
            {imageUrls.map((url,index) => (
                <div key={index} style={{display:"inline", margin:'auto',maxWidth:"60%"}}>
                    <img src={url} alt="placeholder" style={{maxWidth:"50px",height:"auto"}} /><p>{index}</p>
                </div>
            ))}
        </div>
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} />
            <button type="submit">Upload</button>
        </form>
        </>
    )
}