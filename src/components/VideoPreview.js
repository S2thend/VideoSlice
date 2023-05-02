import styles from './VideoPreview.module.css'
import { useRef,useState } from 'react';

export function VideoPreview({videoSrc,setDuration,subtitles,subColor,subSize}){

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

    const handleSubtitle = () => {
        setCurrentSubtitle(findLastSubtitle());
    }


    return(
        <>
            <div className={styles.container} style={{position: "relative"}}>
                <video ref={videoRef} onLoadedMetadata={handleVideoLoaded} src={videoSrc} onTimeUpdate={handleSubtitle} controls></video>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png" alt="placeholder" />
                <div className={styles.subtitle} style={{color:subColor, fontSize:subSize}}>{currentSubtitle}</div>
            </div>
        </>
    )
}