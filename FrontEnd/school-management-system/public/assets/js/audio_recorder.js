
var mediaRecorder=null;
var permissionStatus=null;
var audioName=null;
var audioChunks=[];
 navigator.mediaDevices.getUserMedia({ audio: true })
navigator.permissions.query({name:"microphone"}).then(status=>{
    permissionStatus=status;
    permissionState()
    console.log("permission checking......")
    console.log(permissionStatus.state)
    status.onchange=permissionState}).catch(err=>console.log(err))

function permissionState(){
    if(permissionStatus.state!='granted'){
        Swal.fire("Permission denied","Please turn on microphone permission to record audio","error")
    }
}
function start() {
    console.log("started.....")
    if(permissionStatus.state=='granted'){
         console.log("inside permission state")
         navigator.mediaDevices.getUserMedia({ audio: true })
         .then(stream => {
              console.log("inside stream grand")
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            mediaRecorder.addEventListener("dataavailable",event=> {
                console.log("pumping..")
                audioChunks.push(event.data);});
             mediaRecorder.onstop=e=>{
                 sentToServer(audioChunks)
             }
            Toastify({text: "Audio recording started .....",duration: 3000,newWindow: true,close: true,gravity: "bottom",position: "right", stopOnFocus: true}).showToast();
        });
      
      }
     else permissionState()
}

function sentToServer(){
    const audioBlob = new Blob(audioChunks);
    var formData = new FormData();
    audioName=`${Date.now()}.wav`
    formData.append('filename',audioName );
    formData.append('audio' + '-blob',  audioBlob);
    fetch('audio.php', {
        method: 'POST',
        body: formData
    }).then(res => {
       Toastify({text: "Recording saved succesfully .....",duration: 3000,newWindow: true,close: true,gravity: "bottom",position: "right", stopOnFocus: true}).showToast();
    }).catch(err =>Swal.fire("Cannot save","Failed to save the recorded audio","error"))
}

function stop(){
    mediaRecorder.stop()
}