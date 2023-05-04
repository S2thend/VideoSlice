import { useState } from 'react'
import styles from './ImageFilter.module.css'

export function ImageFilter({ imageUrls, subtitles, setSubtitles }) {

    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(2);
    const [text, setText] = useState(0);
    const [size, setSize] = useState(100);

    const findPositionOnEnd = (start) => {
        if(subtitles.length === 0) return 0;

        let index = 0;
        while (index < subtitles.length && subtitles[index].end <= start) {
            index++;
        }
        return index;
    }

    const getStart = (index) => subtitles[index]?subtitles[index].start:undefined;

    const insertAndConcat = (index, start, end, text) => {   
        let newSubtitles = subtitles.slice(0, index);
        newSubtitles.push({start: start, end: end, text: imageUrls[text], size:size, id: text});
        newSubtitles = newSubtitles.concat(subtitles.slice(index));
        setSubtitles(newSubtitles);
    }

    const insertSubtitle = (start, end, text, size) => {

        let index = findPositionOnEnd(start);
        if(getStart(index)===undefined){
            let newSubtitles = [...subtitles, {start: start, end: end, text: imageUrls[text], size: size, id: text}];
            setSubtitles(newSubtitles);
            return;
        }else if ( getStart(index) >= end ){
            insertAndConcat(index, start, end, text);
            return;
        }
            
        alert("Image overlaps with another image");
        return;
    }


    return (
        <>
            <div>
                <label>Start Time: </label><input type="number" value={start} onChange={(event) => setStart(parseInt(event.target.value))}></input> 
                <label>End Time: </label><input type="number" value={end} onChange={(event) => setEnd(parseInt(event.target.value))}></input>
                <label>Image Id: </label><input type="number" value={text} onChange={(event) => setText(event.target.value)}></input>
                <label>Size: </label><input type="number" value={size} onChange={(event) => setSize(parseInt(event.target.value))}></input>
                <button onClick={_=>insertSubtitle(start, end, text,size)}>Insert</button>
            </div>
            <div className={styles.container}>

                {   
                    subtitles.map(
                        (subtitle, index) => {
                            return (
                                <div key={index} className={styles.content}>
                                    <p>{subtitle.start + "-" + subtitle.end + ":" + subtitle.text}</p>
                                </div>
                            )
                        }
                    )
                }

            </div>
        </>
    )
}