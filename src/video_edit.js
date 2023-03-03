import ffmpeg from "fluent-ffmpeg";
import * as mf from "./myFiles.js";
import Promise from "bluebird";
export default async function edit(){
  await addAssets();
  stitchVandA();//this is some weird-case, but I think it's better readability
}


async function stitchVandA(){
  const audio_name = await mf.getRandomMusic();
  const video_name = await  mf.video_to_mus_arr().first();
  console.log("to add mus:\n"+video_name);

  console.log(audio_name+"\nv:\n"+video_name);
  if(!(video_name&&audio_name))return 1;

  await new Promise((resolve,reject)=>{ 
    ffmpeg().
      on('start', function(cmdline) {
        console.log('Command line: ' + cmdline);
      })
      .on('progress', function(progress) {
        console.info(`Processing : ${progress.percent} % done`);
      })
      .on('error', (err) => {
        console.info(`[ffmpeg] error: ${err.message}`);
        reject(err);
      })
      .on('end', () => {
        console.log('[ffmpeg] finished');
        resolve();
      })
      .input(audio_name)
      .inputOptions('-stream_loop -1')
      .input("bin/video/"+ video_name)
      .outputOptions(['-map 1:v', '-map 0:a', '-c:v copy','-shortest' ])
      .saveToFile("bin/video_complete/"+video_name)
  }
  );

  return video_name;

}

async function convertToTS(){

  const video_name = await  mf.video_to_ts_arr().first();
  console.log("to_ts:\n"+video_name);
  if(!video_name) return 0;//reject() 
  await new Promise((resolve,reject)=>{ 
    ffmpeg()
      .on('start', function(cmdline) {
        console.log('Command line: ' + cmdline);
      })
      .on('progress', function(progress) {
        console.info(`Processing : ${progress.percent} % done`);
      })
      .on('error', (err) => {
        console.info(`[ffmpeg] error: ${err.message}`);
        reject(err);
      })
      .on('end', () => {
        console.log('[ffmpeg] finished');
        resolve();
      })
      .input("bin/video_complete/"+video_name)
      .audioCodec('copy')
      .videoCodec('copy')
      .saveToFile("bin/video_complete/"+video_name.split(".")[0]+".ts")
  });
  return 1;
}

async function addAssets(){
  await concat();
  await convertToTS();
}

async function concat(){
  const video_name = mf.video_to_final_arr().first();
  console.log("final:\n"+video_name);
  if(!video_name) return 0;//reject() 
  // this piece of code repeated three times, so might wanna make a function 

  await new Promise((resolve,reject)=>{ 
    ffmpeg().
      on('start', function(cmdline) {
        console.log('Command line: ' + cmdline);
      })
      .on('progress', function(progress) {
        console.info(`Processing  ${progress.percent} % done`);
      })
      .on('error', (err) => {
        console.info(`[ffmpeg] error: ${err.message}`);
        reject(err);
      })
      .on('end', () => {
        console.log('[ffmpeg] finished');
        resolve();
      })
      .input(`concat:bin/video/assets/intro60.ts|bin/video_complete/${video_name.split(".")[0]}.ts|bin/video/assets/kupla_kd_blue_asset.ts`)
      .videoCodec('copy')
      .audioCodec('copy')
      .saveToFile(`bin/video_final/${video_name.split(".")[0]}.mp4`)
  });
  return 1;
}
