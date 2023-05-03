import styles from './VideoPreview.module.css'
import { useRef,useState } from 'react';

export function VideoPreview({videoSrc,setDuration,subtitles,subColor,subSize,images}){

    const videoRef = useRef(null);

    const handleVideoLoaded = () => {
      console.log(videoRef.current.duration);
      setDuration(videoRef.current.duration);
    };

    const [currentSubtitle, setCurrentSubtitle] = useState("");

    const findLastSubtitle = () => {
        if (subtitles.length === 0) return "";

        for(let i = subtitles.length - 1; i >= 0; i--){
            if(subtitles[i].start <= videoRef.current.currentTime){
                return subtitles[i].end <= videoRef.current.currentTime ? "" : subtitles[i].text;
            }
        }
    }

    const [currentImage, setCurrentImage] = useState("");
    const [currentImageSize, setCurrentImageSize] = useState(100);

    const findLastImage = () => {
        if (images.length === 0) return "";

        for(let i = images.length - 1; i >= 0; i--){
            if(images[i].start <= videoRef.current.currentTime){
                return images[i].end <= videoRef.current.currentTime ? "" : images[i].text;
            }
        }
    }

    const findLastImageSize = () => {
        if (images.length === 0) return 100;

        for(let i = images.length - 1; i >= 0; i--){
            if(images[i].start <= videoRef.current.currentTime){
                return images[i].end <= videoRef.current.currentTime ? 100 : images[i].size;
            }
        }
    }

    const handleUpdate = () => {
        setCurrentSubtitle(findLastSubtitle());
        setCurrentImage(findLastImage());
        setCurrentImageSize(findLastImageSize());
    }


    return(
        <>
            <div className={styles.container} style={{position: "relative"}}>
                <video ref={videoRef} onLoadedMetadata={handleVideoLoaded} src={videoSrc} onTimeUpdate={handleUpdate} controls></video>
                {
                    currentImage === "" ? null : <img src={currentImage} style={{}} alt="placeholder" />
                }
                <div className={styles.subtitle} style={{color:subColor, fontSize:subSize+"px"}}>{currentSubtitle}</div>
            </div>
            <button onClick={()=>{videoRef.current.play()}}>play</button>
        </>
    )
}