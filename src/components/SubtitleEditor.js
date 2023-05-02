import { useState } from 'react'
import styles from './SubtitleEditor.module.css'

export function SubtitleEditor({ subtitles, selectedLine, setSelectedLine, setSubtitles, subSize, setSubSize, subColor, setSubColor }) {

    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(0);
    const [text, setText] = useState("");

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
        newSubtitles.push({start: start, end: end, text: text});
        newSubtitles = newSubtitles.concat(subtitles.slice(index));
        setSubtitles(newSubtitles);
    }

    const insertSubtitle = (start, end, text) => {
        console.log("insertSubtitle");
        console.log(subtitles);
        let index = findPositionOnEnd(start);
        console.log("index");
        console.log(index);
        if(getStart(index)===undefined){
            console.log("getStart(index)==undefined");
            console.log(subtitles);
            let newSubtitles = [...subtitles, {start: start, end: end, text: text}];
            console.log("after push");
            console.log(newSubtitles);
            console.log(start)
            console.log(end)
            console.log(text)
            setSubtitles(newSubtitles);
            return;
        }else if ( getStart(index) >= end ){
            insertAndConcat(index, start, end, text);
            return;
        }
            
        alert("Subtitle overlaps with another subtitle");
        return;
    }

    const deleteSubtitle = (index) => {
        let newSubtitles = subtitles.slice(0, index);
        newSubtitles = newSubtitles.concat(subtitles.slice(index+1));
        setSubtitles(newSubtitles);
    }


    return (
        <>
            <div>
                <label>Font Size: </label><input type="number" value={subSize} onChange={(event) => setSubSize(event.target.value)}></input>
                <label>Font Color: </label><input type="color" value={subColor} onChange={(event) => setSubColor(event.target.value)}></input>
            </div>
            <div>
                <label>Start Time: </label><input type="number" value={start} onChange={(event) => setStart(parseInt(event.target.value))}></input> 
                <label>End Time: </label><input type="number" value={end} onChange={(event) => setEnd(parseInt(event.target.value))}></input>
                <label>Text: </label><input type="text" value={text} onChange={(event) => setText(event.target.value)}></input>
                <button onClick={_=>insertSubtitle(start, end, text)}>Insert</button>
            </div>
            <div className={styles.container}>

                {   
                    subtitles.map(
                        (subtitle, index) => {
                            return (
                                index == selectedLine ?
                                <div key={index} className={styles.content} style={{color:"blue"}} onClick={() => setSelectedLine(undefined)}>
                                    <p>{subtitle.start + "-" + subtitle.end + ":" + subtitle.text}</p>
                                </div>
                                :
                                <div key={index} className={styles.content} onClick={() => setSelectedLine(index)}>
                                    <p>{subtitle.start + "-" + subtitle.end + ":" + subtitle.text}</p>
                                </div>
                            )
                        }
                    )
                }

            </div>
            <button onClick={_=>deleteSubtitle(selectedLine)}>delete selected subtitle</button>
        </>
    )
}