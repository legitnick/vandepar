import ffmpeg from "fluent-ffmpeg";
import * as mf from "./myFiles.js";

export default async function edit(){
  await addAssets();
  stitchVandA();//this is some weird-case, but I think it's better readability
}

async function stitchVandA(){
  const audio_name = await mf.getRandomMusic();
  const video_name = await  mf.video_to_mus_arr().first();
  console.log(video_name);

  console.log(audio_name+"\nv:\n"+video_name);
  if(video_name&&audio_name)
    await ffmpeg()
    .on('start', function(cmdline) {
      console.log('Command line: ' + cmdline);
    })
    .on('progress', function(progress) {
      console.info(`Processing : ${progress.percent} % done`);
    })
      .input(audio_name)
      .inputOptions('-stream_loop -1')
      .input("bin/video/"+ video_name)
      .outputOptions(['-map 1:v', '-map 0:a', '-c:v copy','-shortest' ])
      .saveToFile("bin/video_complete/"+video_name)
  return video_name;

}

async function convertToTS(){

  const video_name = await  mf.video_to_ts_arr().first();
  if(!video_name) return 0;//reject() 
  await ffmpeg()
    .on('start', function(cmdline) {
      console.log('Command line: ' + cmdline);
    })
    .on('progress', function(progress) {
      console.info(`Processing : ${progress.percent} % done`);
    })
    .input("bin/video_complete/"+video_name)
    .audioCodec('copy')
    .videoCodec('copy')
    .saveToFile("bin/video_complete/"+video_name.split(".")[0]+".ts");
  return 1;
}

async function addAssets(){
 await concat();
  convertToTS();
}

async function concat(){
  const video_name = mf.video_w_mus_ts_arr().first();
  console.log(video_name);
  if(!video_name) return 0;//reject() 
  // this piece of code repeated three times, so might wanna make a function 

  ffmpeg()
    .on('start', function(cmdline) {
      console.log('Command line: ' + cmdline);
    })
    .on('progress', function(progress) {
      console.info(`Processing  ${progress.percent} % done`);
    })
  //.input(`"concat:bin/video/assets/intro60.ts|"concat:bin/video/assets/intro60.ts`)
    .input(`concat:bin/video_complete/${video_name.split(".")[0]}.ts|bin/video/assets/intro60.ts`)
  .videoCodec('copy')
    .audioCodec('copy')
    .saveToFile("output2.mp4");
}
edit();//tmp
