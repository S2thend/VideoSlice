import styles from './VideoPreview.module.css'
import { useRef } from 'react';

export function VideoPreview({videoSrc,setDuration}){

    const videoRef = useRef(null);

    const handleVideoLoaded = () => {
      console.log(videoRef.current.duration);
      setDuration(videoRef.current.duration);
    };

    return(
        <>
            <div className={styles.container} style={{position: "relative"}}>
                <video ref={videoRef} onLoadedMetadata={handleVideoLoaded} src={videoSrc} controls></video>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png" alt="placeholder" />
                <div className={styles.subtitle}>Hello World!</div>
            </div>
        </>
    )
}