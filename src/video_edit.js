import ffmpeg from "fluent-ffmpeg";
import * as mf from "./myFiles.js";

export default async function edit(){
  const video_name = stitchVandA();//this is some weird-case, but I think it's better readability
  //addAssets();
}

async function stitchVandA(){
  const audio_name = await mf.getRandomMusic();
  const video_name = await  mf.html_arr_used().length?  mf.html_arr_used()[0]:null;
  
  console.log(audio_name+"\nv:\n"+video_name);
  if(video_name&&audio_name)
  ffmpeg()
  .input(audio_name)
  .inputOptions('-stream_loop -1')
  .input("bin/video/"+ video_name)
  .outputOptions(['-map 1:v', '-map 0:a', '-c:v copy','-shortest' ])
  .saveToFile("bin/video_complete"+video_name)

}
edit();//tmp
