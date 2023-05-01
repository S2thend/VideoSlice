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
            <video ref={videoRef} onLoadedMetadata={handleVideoLoaded} src={videoSrc} controls style={ {width:"800px",height:"600px"}}></video>
            <div className={styles.container} style={{position: "relative"}}>
                <video controls>
                    <source src={"./1.mp4"} type="video/mp4"/>
                </video>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png" alt="placeholder" />
                <div className={styles.subtitle}>Hello World!</div>
            </div>
        </>
    )
}