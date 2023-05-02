import React, { useState } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import './App.css';
import { VideoPreview } from './components/VideoPreview';
import { SubtitleEditor } from './components/SubtitleEditor';

function App() {
  //1. Upload video
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // access properties of 'file' state
    console.log(file.name);
    console.log(file.type);
    console.log(file.size);
  };

  const [message, setMessage] = useState('Click Start to transcode');
  const [progress, setProgress] = useState(0);
  const [startTrim, setStartTrim] = useState(0);
  const [endTrim, setEndTrim] = useState(100);
  const [duration, setDuration] = useState(0);
  
  //2. Transcode video
  const [videoSrc, setVideoSrc] = useState('');
  const [ffmpeg, setFFmpeg] = useState(
    createFFmpeg({
      log: true,
    })
  );

  const doTranscode = async () => {
    setMessage('Loading ffmpeg-core.js');
    await ffmpeg.load();
    setFFmpeg(ffmpeg);
    setMessage('Start transcoding');
    console.log(ffmpeg.isLoaded());
    ffmpeg.FS('writeFile', 'test.avi', await fetchFile(URL.createObjectURL(file)));
    let files = ffmpeg.FS('readdir', '/');
    console.log(files);
    const info = await ffmpeg.run('-i', 'test.avi', 'test.mp4');
    console.log(info);
    setMessage('Complete transcoding');
    const data = ffmpeg.FS('readFile', 'test.mp4');
    setVideoSrc(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })));
  };

  const [subSize, setSubSize] = useState(30);
  const [subColor, setSubColor] = useState('#ffffff');
  const [subtitles, setSubtitles] = useState([]);
  const [selectedLine, setSelectedLine] = useState(undefined);

  const addSubtitle = async () => {
    //convert subtitle list to string for srt file
    let srt = '';
    for (let i = 0; i < subtitles.length; i++) {
      srt += `${i + 1}\n${formatTime(subtitles[i].start)},000 --> ${formatTime(subtitles[i].end)},000\n${subtitles[i].text}\n\n`;
    }
    ffmpeg.FS('writeFile', 'sub.srt', await fetchFile(URL.createObjectURL(new Blob([srt], { type: 'text/srt' }))));
    ffmpeg.FS('writeFile', 'arail.ttf', await fetchFile("http://localhost:3000/arail.ttf"));
    ffmpeg.FS('writeFile', 'arailbd.ttf', await fetchFile("http://localhost:3000/arailbd.ttf"));
    ffmpeg.FS('writeFile', 'arial.ttf', await fetchFile("http://localhost:3000/arial.ttf"));
    ffmpeg.FS('writeFile', 'arialbd.ttf', await fetchFile("http://localhost:3000/arialbd.ttf"));
    ffmpeg.FS('writeFile', 'arialbi.ttf', await fetchFile("http://localhost:3000/arialbi.ttf"));
    ffmpeg.FS('writeFile', 'ariali.ttf', await fetchFile("http://localhost:3000/ariali.ttf"));
    ffmpeg.FS('writeFile', 'ARIALN.TTF', await fetchFile("http://localhost:3000/ARIALN.TTF"));
    ffmpeg.FS('writeFile', 'ARIALNB.TTF', await fetchFile("http://localhost:3000/ARIALNB.TTF"));
    ffmpeg.FS('writeFile', 'ARIALNBI.TTF', await fetchFile("http://localhost:3000/ARIALNBI.TTF"));
    ffmpeg.FS('writeFile', 'ARIALNI.TTF', await fetchFile("http://localhost:3000/ARIALNI.TTF"));
    ffmpeg.FS('writeFile', 'ariblk.ttf', await fetchFile("http://localhost:3000/ariblk.ttf"));
    console.log(URL.createObjectURL(new Blob([srt], { type: 'text/srt' })));
    let files = ffmpeg.FS('readdir', '/');
    console.log(files);
    //add subtitle to bottom of the video
    await ffmpeg.run('-i', 'test.mp4', '-vf', `subtitles=sub.srt:fontsdir=/:force_style='Fontsize=${subSize},PrimaryColour=&H${subColor.slice(1)},y=H-4,align=center'`, 'sub.mp4');
    console.log(`subtitles=sub.srt:force_style='Fontsize=${subSize},PrimaryColour=&H${subColor.slice(1)}'`)
    const data = ffmpeg.FS('readFile', 'sub.mp4');
    setVideoSrc(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })));
  };

  const doTrim = async () => {
    let files = ffmpeg.FS('readdir', '/');
    console.log(files);
    await ffmpeg.run('-ss', `${formatTime(startTrim * duration / 100)}`, '-i', 'test.mp4', '-to', `${formatTime((endTrim - startTrim) * duration / 100)}`, '-c', 'copy', 'trimmed.mp4');
    setMessage('Video trimmed successfully!');
    files = ffmpeg.FS('readdir', '/');
    console.log(files);
    const data = ffmpeg.FS('readFile', 'trimmed.mp4');
    setVideoSrc(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })));
  };

  const handleStartTrimChange = (event) => {
    setStartTrim(event.target.value);
  };

  const handleEndTrimChange = (event) => {
    setEndTrim(event.target.value);
  };

  // seconds to 00:00:00
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time - hours * 3600) / 60);
    const seconds = Math.floor(time - hours * 3600 - minutes * 60);
    return `${hours}:${minutes}:${seconds}`;
  };

  // useEffect(() => {
  //   const updateProgress = (progress) => {
  //     setProgress(progress.ratio);
  //   };
  //   ffmpeg.setProgressCallback(updateProgress);
  // }, [ffmpeg]);




  return (
    <div className="App">
      <br />
      <VideoPreview videoSrc={videoSrc} setDuration={setDuration} subtitles={subtitles} subColor={subColor} subSize={subSize}></VideoPreview>
      <br />
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      <button onClick={doTranscode}>Load Video</button>
      <p>{message}</p>
      <br/>
      <SubtitleEditor subSize={subSize} setSubSize={setSubSize} subColor={subColor} setSubColor={setSubColor} subtitles={subtitles} setSubtitles={setSubtitles} selectedLine={selectedLine} setSelectedLine={setSelectedLine}/>
      <br />
      <input type="range" min="0" max="100" value={startTrim} onChange={handleStartTrimChange} />
      <input type="range" min="0" max="100" value={endTrim} onChange={handleEndTrimChange} />
      <br />
      <button onClick={doTrim}>Trim Video</button>
      <button onClick={addSubtitle}>Add Subtitle</button>
      <p>{progress.toFixed(2) * 100}%</p>
    </div>
  );
}


export default App;