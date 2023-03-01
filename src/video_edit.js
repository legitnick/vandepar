import ffmpeg from "fluent-ffmpeg";
import * as mf from "./myFiles.js";

export default async function edit(){
  addAssets();
  stitchVandA();//this is some weird-case, but I think it's better readability
}

async function stitchVandA(){
  const audio_name = await mf.getRandomMusic();
  const video_name = await  mf.html_arr_used().length?  mf.html_arr_used()[0]:null;

  console.log(audio_name+"\nv:\n"+video_name);
  if(video_name&&audio_name)
    await ffmpeg()
      .input(audio_name)
      .inputOptions('-stream_loop -1')
      .input("bin/video/"+ video_name)
      .outputOptions(['-map 1:v', '-map 0:a', '-c:v copy','-shortest' ])
      .saveToFile("bin/video_complete/"+video_name)
  return video_name;

}

async function convertToTS(){

  const video_name = await  mf.video_w_mus_arr().length?  mf.video_w_mus_arr()[0]:null;
  if(!video_name) return 0;//reject() 
  await ffmpeg()
    .on('start', function(cmdline) {
      console.log('Command line: ' + cmdline);
    })
    .on('progress', function(progress) {
      console.info(`Processing : ${progress.percent} % done`);
    })
    .input("bin/video_complete/"+video_name)
    .videoCodec('copy')
    .saveToFile("bin/video_complete/"+video_name.split(".")[0]+".ts");
  return 1;
}

async function addAssets(){
  convertToTS();
  concat();
}

async function concat(){
  const video_name = mf.video_w_mus_ts_arr().length?  mf.video_w_mus_ts_arr()[0]:null;
// this piece of code repeated three times, so might wanna make a function 

  ffmpeg()
    .on('start', function(cmdline) {
      console.log('Command line: ' + cmdline);
    })
    .on('progress', function(progress) {
      console.info(`Processing ${outName}: ${progress.percent} % done`);
    })
    .input(`"concat:bin/video_complete/${video_name.split(".")[0]}.ts|bin/video/assets/intro60.ts"`)
    .outputOption('-strict -2')     // I have an issue with experimental codecs, it is a solution
    .videoCodec('copy')
  .saveToFile("output2.mp4");
}
edit();//tmp
