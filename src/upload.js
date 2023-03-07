import { upload } from 'youtube-videos-uploader' //Typescript

// recoveryemail is optional, only required to bypass login with recovery email if prompted for confirmation
const credentials = { email: 'baka@mitai.com', pass: 'abrakadabra'  }

// minimum required options to upload video
//const video1 = { path: './bin/video_complete/1125968.mp4', title: 'title 1', description: 'description 1' }

const onVideoUploadSuccess = (videoUrl) => {
    // ..do something..
}
// Extra options like tags, thumbnail, language, playlist etc
const video2 = { path: './bin/video_complete/1125968.mp4', title: 'title 2', description: 'description 2', thumbnail:'thumbnail.png', language: 'english', tags: ['video', 'github'], playlist: 'playlist name', channelName: 'Channel Name', onSuccess:onVideoUploadSuccess, skipProcessingWait: true, onProgress: (progress) => { console.log('progress', progress) }, uploadAsDraft: false, isAgeRestriction: false, isNotForKid: false,  }



// OR
// This package uses Puppeteer, you can also pass Puppeteer launch configuration
upload (credentials, [ video2], {headless:false}).then(console.error);
