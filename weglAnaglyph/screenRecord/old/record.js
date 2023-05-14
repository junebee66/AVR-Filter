// let btn = document.querySelector(".record-btn")

// btn.addEventListener("click", async function () {
//   let stream = await navigator.mediaDevices.getDisplayMedia({
//     video: true
//   })

//   //needed for better browser support
//   const mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9") 
//              ? "video/webm; codecs=vp9" 
//              : "video/webm"
//     let mediaRecorder = new MediaRecorder(stream, {
//         mimeType: mime
//     })

//     let chunks = []
//     mediaRecorder.addEventListener('dataavailable', function(e) {
//         chunks.push(e.data)
//     })

//     mediaRecorder.addEventListener('stop', function(){
//       let blob = new Blob(chunks, {
//           type: chunks[0].type
//       })
//       let url = URL.createObjectURL(blob)

//       let video = document.querySelector("video")
//       video.src = url

//       let a = document.createElement('a')
//       a.href = url
//       a.download = 'video.webm'
//       a.click()
//   })

//     //we have to start the recorder manually
//     mediaRecorder.start()
// })



async function startCapture(displayMediaOptions) {
    let captureStream = null;
  
    try {
      captureStream = await navigator.mediaDevices.getDisplayMedia(
        displayMediaOptions
      );
    } catch (err) {
      console.error(`Error: ${err}`);
    }
    return captureStream;
  }


  function startCapture(displayMediaOptions) {
    return navigator.mediaDevices
      .getDisplayMedia(displayMediaOptions)
      .catch((err) => {
        console.error(err);
        return null;
      });
  }

  