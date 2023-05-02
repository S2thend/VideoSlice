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
      <p>{progress.toFixed(2) * 100}%</p>
    </div>
  );
}


export default App;