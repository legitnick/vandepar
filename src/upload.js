import { upload } from 'youtube-videos-uploader' //Typescript
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
await dotenv.config()

// recoveryemail is optional, only required to bypass login with recovery email if prompted for confirmation
const credentials = { email: process.env.GOOGLE_EMAIL, pass: process.env.GOOGLE_PASSWORD  }

// minimum required options to upload video
//const video1 = { path: './bin/video_complete/1125968.mp4', title: 'title 1', description: 'description 1' }

const onVideoUploadSuccess = (videoUrl) => {
    // ..do something..
}
// Extra options like tags, thumbnail, language, playlist etc
const video2 = { path: './bin/video_complete/1125968.mp4', title: 'title 2', description: 'description 2',  language: 'english', tags: ['video', 'github'], playlist: 'playlist name',  onSuccess:onVideoUploadSuccess, skipProcessingWait: true,  publishType: 'UNLISTED', onProgress: (progress) => { console.log('progress', progress) }, uploadAsDraft: false, isAgeRestriction: false, isNotForKid: false,  }

const upload_YT = ()=>{upload (credentials, [ video2], {headless:false}).then(console.error)};
upload_YT();
export default upload_YT;
