import { fetchFile } from '@ffmpeg/ffmpeg';
import { useState } from 'react';

export function ImageUploader({imageUrls, setImageUrls, ffmpeg}) {

    const [file1,setFile1] = useState(null);
    const [files, setFiles] = useState([]);


    const handleFileChange1 = (e) => {
        console.log(e.target.files[0]);
        setFile1(e.target.files[0]);
        console.log(file1);
    };

    const handleSubmit1 = async (e) => {
        e.preventDefault();
        setFiles([...files,file1]);
        setImageUrls([...imageUrls,URL.createObjectURL(files[files.length-1])]);
        ffmpeg.FS('writeFile', 'test'+`${files.length-1}` + '.png', await fetchFile(URL.createObjectURL(files[files.length-1])));
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
        <form onSubmit={handleSubmit1}>
            <input type="file" onChange={handleFileChange1} />
            <button type="submit">Upload</button>
        </form>
        </>
    )
}