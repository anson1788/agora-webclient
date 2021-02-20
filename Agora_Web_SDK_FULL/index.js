// create Agora client
var client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

var localTracks = {
  videoTrack: null,
  audioTrack: null
};
var remoteUsers = {};
// Agora client options
var options = {
  appid: null,
  channel: null,
  uid: null,
  token: null
};

var appIdClient= "b8a8f96166e741b4ac725e5668df95d5"
var channelClient = "iosTestClient"
var tokenClient = ""
var script = $("<script />", {
  src: "https://ig41cnoaka.execute-api.ap-east-1.amazonaws.com/production/gettoken?mobile=false",
  type: "text/javascript"
}
);

var onclick = false

document.onkeydown = function(event) {
  if (event.repeat) { return }
  console.log("aa "+  Date.now() + " "+event.code)
  
  if (event.code == 'KeyW' ) {
    ws.send('{"action":"onConnected","type":"controller1"}');
    $("#up").attr('src', "arrow_d.png");
    if(car1!=""){
    
      ws.send('{"action":"directOrder","upL":"true","downL":"false","rightL":"false","leftL":"false","targetL":"'+car1+'"}');
    }
  }
  if (event.code == 'KeyA' ) {
    $("#left").attr('src', "left_d.png");
    ws.send('{"action":"directOrder","upL":"false","downL":"false","rightL":"false","leftL":"true","targetL":"'+car1+'"}');
  }
  if (event.code == 'KeyD' ) {
    $("#right").attr('src', "right_d.png");
    ws.send('{"action":"directOrder","upL":"false","downL":"false","rightL":"true","leftL":"false","targetL":"'+car1+'"}');
  }
  if (event.code == 'KeyS' ) {
    $("#down").attr('src', "down_d.png");
    ws.send('{"action":"directOrder","upL":"false","downL":"true","rightL":"false","leftL":"false","targetL":"'+car1+'"}');
  }  
  if (event.code == 'Enter' ) {
    $("#start").attr('src', "start_d.jpg");
    ws.send('{"action":"getSetup","type":"controller1"}');
  }
}
/*
document.addEventListener('keypress', function(event) {
  if (event.repeat) { return }

  if (event.code == 'KeyW' ) {
    ws.send('{"action":"onConnected","type":"controller1"}');
    $("#up").attr('src', "arrow_d.png");
    if(car1!=""){
    
      ws.send('{"action":"directOrder","upL":"true","downL":"false","rightL":"false","leftL":"false","targetL":"'+car1+'"}');
    }
  }
  if (event.code == 'KeyA' ) {
    $("#left").attr('src', "left_d.png");
    ws.send('{"action":"directOrder","upL":"false","downL":"false","rightL":"false","leftL":"true","targetL":"'+car1+'"}');
  }
  if (event.code == 'KeyD' ) {
    $("#right").attr('src', "right_d.png");
    ws.send('{"action":"directOrder","upL":"false","downL":"false","rightL":"true","leftL":"false","targetL":"'+car1+'"}');
  }
  if (event.code == 'KeyS' ) {
    $("#down").attr('src', "down_d.png");
    ws.send('{"action":"directOrder","upL":"false","downL":"true","rightL":"false","leftL":"false","targetL":"'+car1+'"}');
  }  
  if (event.code == 'Enter' ) {
    $("#start").attr('src', "start_d.jpg");
    ws.send('{"action":"getSetup","type":"controller1"}');
  }

});
*/


document.addEventListener('keyup', function(event) {
  if (event.repeat) { return }
  console.log("key release " + Date.now())
  $("#up").attr('src', "arrow.png");
  $("#left").attr('src', "left.png");
  $("#right").attr('src', "right.png");
  $("#down").attr('src', "down.png");
  $("#start").attr('src', "start.jpg");
  ws.send('{"action":"directOrder","upL":"false","downL":"false","rightL":"false","leftL":"false","targetL":"'+car1+'"}');
});

$("head").append(script);

window.addEventListener('load', (event) => {
  //alert(tokenA)
  options.appid = appIdClient
  options.channel =  channelClient
  options.token = tokenA
  if (options.appid && options.channel) {
    $("#appid").val(options.appid);
    $("#token").val(options.token);
    $("#channel").val(options.channel);
    $("#join-form").submit();
  }
});
// the demo can auto join channel with params in url
$(() => {
  //var urlParams = new URL(location.href).searchParams;
  webSocketConnect()
})
var ws = null
var car1 = ""
function webSocketConnect(){
  if ("WebSocket" in window) {
    //alert("WebSocket is supported by your Browser!");
    ws = new WebSocket("wss://9lq9qnim7i.execute-api.ap-east-1.amazonaws.com/production");		
    ws.onopen = function() {
        // Web Socket is connected, send data using send()
        ws.send('{"action":"onConnected","type":"controller1"}');
       // alert("socket on")
    };

    ws.onmessage = function (evt) { 
        var received_msg = evt.data;
        received_msg =  received_msg.replace("Echo:","")
        received_msg = received_msg.replaceAll("'","\"")
        car1 = JSON.parse(received_msg).car1

        //alert("Message is received... "+  car1);
    };

    ws.onclose = function() { 
        
        // websocket is closed.
        //alert("Connection is closed..."); 
    };
  }
}

$("#join-form").submit(async function (e) {
  e.preventDefault();
  $("#join").attr("disabled", true);
  try {
    /*
    options.appid = appIdClient;
    options.channel = channelClient;
    options.token = tokenClient;
    */
    await join();
    if(options.token) {
      //$("#success-alert-with-token").css("display", "block");
    } else {
     // $("#success-alert a").attr("href", `index.html?appid=${options.appid}&channel=${options.channel}&token=${options.token}`);
      //$("#success-alert").css("display", "block");
    }
  } catch (error) {
    console.error(error);
  } finally {
    $("#leave").attr("disabled", false);
  }
})

$("#leave").click(function (e) {
  leave();
})

async function join() {

  // add event listener to play remote tracks when remote user publishs.
  client.on("user-published", handleUserPublished);
  client.on("user-unpublished", handleUserUnpublished);

  // join a channel and create local tracks, we can use Promise.all to run them concurrently
  [ options.uid, localTracks.audioTrack, localTracks.videoTrack ] = await Promise.all([
    // join the channel
    client.join(options.appid, options.channel, options.token || null),
    // create local tracks, using microphone and camera
  ]);
  
  // play local video track
  //localTracks.videoTrack.play("local-player");
  //$("#local-player-name").text(`localVideo(${options.uid})`);

  // publish local tracks to channel
  //await client.publish(Object.values(localTracks));
  console.log("publish success");
}

async function leave() {
  for (trackName in localTracks) {
    var track = localTracks[trackName];
    if(track) {
      track.stop();
      track.close();
      localTracks[trackName] = undefined;
    }
  }

  // remove remote users and player views
  remoteUsers = {};
  $("#remote-playerlist").html("");

  // leave the channel
  await client.leave();

  $("#local-player-name").text("");
  $("#join").attr("disabled", false);
  $("#leave").attr("disabled", true);
  console.log("client leaves channel success");
}

async function subscribe(user, mediaType) {
  const uid = user.uid;
  // subscribe to a remote user
  await client.subscribe(user, mediaType);
  console.log("subscribe success");
  if (mediaType === 'video') {
    const player = $(`
      <div id="player-wrapper-${uid}">
        <div id="player-${uid}" class="player"></div>
      </div>
    `);
    $("#remote-playerlist").append(player);
    user.videoTrack.play(`player-${uid}`);
  }
  if (mediaType === 'audio') {
    user.audioTrack.play();
  }
}

function handleUserPublished(user, mediaType) {
  const id = user.uid;
  remoteUsers[id] = user;
  subscribe(user, mediaType);
}

function handleUserUnpublished(user) {
  const id = user.uid;
  delete remoteUsers[id];
  $(`#player-wrapper-${id}`).remove();
}