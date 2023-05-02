import { fetchFile } from '@ffmpeg/ffmpeg';
import { useState } from 'react';

export function ImageUploader({imageUrls, setImageUrls, ffmpeg}) {

    const [files, setFiles] = useState([]);
    
    const handleFileChange = async (e) => {
        setFiles([...files,e.target.files[0]]);
        setImageUrls([...imageUrls,URL.createObjectURL(files[files.length-1])]);
        ffmpeg.FS('writeFile', 'test'+`${files.length-1}` + '.png', await fetchFile(imageUrls[files.length-1]));
    };

    const handleSubmit = (e) => {
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
                <div key={index} style={{display:"inline"}}>
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