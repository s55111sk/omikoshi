//<id='fieldName'>に桁合わせをしたvalueを入れる関数
function updateFieldIfNotNull(fieldName, value, precision = 10) {
    //（id名 , idの場所に入れたい値 , n桁に丸める）
    if (value != null) document.getElementById(fieldName).innerHTML = value.toFixed(precision);
  }
  //httpsじゃないサイトをhttpsにする
  if (location.protocol != "https:") {
    location.href = "https:" + window.location.href.substring(window.location.protocol.length);
  }
  
  function ClickRequestDeviceSensor() {
    music.play();
    //. ユーザーに「許可」を明示させる必要がある
    DeviceOrientationEvent.requestPermission().then(function (response) {
      if (response === "granted") {
        window.addEventListener("deviceorientation", deviceOrientation);
        $("#sensorrequest").css("display", "none");
        $("#cdiv").css("display", "block");
      }
    }).catch(function (e) {
      console.log(e);
    });
    DeviceMotionEvent.requestPermission().then(function (response) {
      if (response === "granted") {
        window.addEventListener("devicemotion", deviceMotion);
        $("#sensorrequest").css("display", "none");
        $("#cdiv").css("display", "block");
      }
    }).catch(function (e) {
      console.log(e);
    });
  }
  
   const music = new Audio('music.mp3');
  //music.volume=0.1;
  music.loop = true;
  music.defaultPlaybackRate = 3.0;
  
  $(function () {
    init();
  });
  
  function init() {
   //初期化
    let ua = navigator.userAgent;
    if (ua.indexOf("iPhone") > 0 || (ua.indexOf("Android") > 0 && ua.indexOf("Mobile") > 0)) {
      $("#model").text("スマートフォン");
    } else if (ua.indexOf("iPad") > 0 || ua.indexOf("Android") > 0) {
      $("#model").text("タブレット");
    } else {
      $("#model").text("PC");
    }
    let canvas = document.getElementById("mycanvas");
    if (!canvas || !canvas.getContext) {
      return false;
    }
    if (window.DeviceMotionEvent) {
      if (DeviceMotionEvent.requestPermission && typeof DeviceMotionEvent.requestPermission === "function") {
        $("#cdiv").css("display", "none");
        let banner = '<div id="sensorrequest" onclick="ClickRequestDeviceSensor();" style="z-index:1; position:absolute; width:100%; background-color:#000; color:#fff;><p style="padding:10px;">センサーの有効化</p></div>';
        $("body").prepend(banner);
      } else {
        window.addEventListener("devicemotion", deviceMotion);
      }
    }
    if (window.TouchEvent) {
      //canvas.addEventListener( "touchstart", touchStart );//キャンバスに指が振れたら
      canvas.addEventListener("touchend", touchEnd); //キャンバスから指が離れたら
    }
  }
  let isTouch = false;
  let motionData = [];
  let bpmData=[];
  
  function peak_select(arrayData) {
    let peak = [];
    peak.push(0);
    peak.push(0);
    for (let i = 4; i < arrayData.length; i++) {
      if (arrayData[i - 4] < arrayData[i - 3] && arrayData[i - 3] < arrayData[i - 2] && arrayData[i - 2] > arrayData[i - 1] && arrayData[i - 1] > arrayData[i]) {
        peak.push(arrayData[i - 2] * 2);
      } else {
        peak.push(0);
      }
    }
    return peak;
  }
  
  function period_serch(arrayData) {
    let period = [];
    let aa = 0,
      sum = 0,
      sum2 = 0;
    for (let i = 0; i < arrayData.length; i++) {
      if (arrayData[i] != 0) {
        aa = i;
        break;
      }
    }
    for (let i = aa; i < arrayData.length; i++, sum++) {
      if (arrayData[i] != 0) {
        period.push(sum + ",");
        sum2 += sum;
        sum = 0;
      }
    }
    if(period.length!=0 && period.length!=1){
        sum2 = sum2 / (period.length - 1);
    }
    sum2 = (sum2 * 0.02);
    if(sum2!=0){
      sum2=1/sum2;
    }
    sum2 *= 60;
    
    bpmData.push(Math.floor(sum2)+",");   
    document.getElementById("Accelerometer_period").innerHTML = period.join(""); //innerHTMLへ入れる時にjoin()で文字列にする
    document.getElementById("Accelerometer_bpm").innerHTML = bpmData.join("");
   return Math.floor(sum2);
  }
  
  function smoothing(arrayData) {
    let smooth = [];
    smooth[0] = 0;
    smooth[1] = 0;
    for (let i = 2; i < arrayData.length; i++) {
      smooth[i] = (arrayData[i - 2] + arrayData[i - 1] + arrayData[i]) / 3;
    }
    return smooth;
  }
  
  function touchEnd(e) {
    e.preventDefault();
    
    fetch('/index.php', { // 第1引数に送り先
    method: 'POST', // メソッド指定
    headers: { 'Content-Type': 'application/json' }, // jsonを指定
    body: JSON.stringify("-1") // json形式に変換して添付
    })
    
    if (motionData && motionData.length > 0) {
      //. グラフ描画
      let labels = [];
      let z_data = [];
      let peak_data = [];
      for (let i = 0; i < motionData.length; i++) {
        let mot = motionData[i];
        labels.push("" + i);
        z_data.push(mot);
      }
      for (let i = 0; i < 25; i++) {
        z_data = smoothing(z_data);
      }
      peak_data = peak_select(z_data);
      let a=period_serch(peak_data);
      let ctx1 = document.getElementById("mychart1");
      let myChart1 = new Chart(ctx1, {
        type: "line",
        data: {
          labels: labels,
          datasets: [{
            label: "z",
            borderWidth: 1,
            backgroundColor: "red",
            borderColor: "red",
            fill: false,
            data: z_data,
          }, {
            label: "",
            borderWidth: 1,
            backgroundColor: "green",
            borderColor: "green",
            fill: false,
            data: peak_data,
          }, ],
        },
        options: {
          legend: {
            labels: {
              boxWidth: 30,
              padding: 20,
            },
            display: true,
          },
          tooltips: {
            mode: "label",
          },
        },
      });
      //motionData = [];//motiondataの初期化
    }
      if (isTouch) {
      isTouch = false;
      document.getElementById("mycanvas").style.backgroundColor = "blue";
      music.muted = true;
      motionData=[];//motionDataの初期化
    } else {
      isTouch = true;
      document.getElementById("mycanvas").style.backgroundColor = "red";
      music.muted = false;
    }
  }
  
  
    
  function deviceMotion(e) {
    e.preventDefault();
    if (isTouch) {
      //updateFieldIfNotNull("Accelerometer_x", event.acceleration.x);
      //updateFieldIfNotNull("Accelerometer_y", event.acceleration.y);
      //updateFieldIfNotNull("Accelerometer_z", event.acceleration.z);
      //updateFieldIfNotNull("Accelerometer_gx", event.accelerationIncludingGravity.x);
      //updateFieldIfNotNull("Accelerometer_gy", event.accelerationIncludingGravity.y);
      //updateFieldIfNotNull("Accelerometer_gz", event.accelerationIncludingGravity.z);
      //updateFieldIfNotNull("Accelerometer_i", event.interval, 2);
      //let js_array = <?php echo $json_lr; ?>
      //updateFieldIfNotNull("lr_session", js_array);
      let motion_z_data=event.acceleration.z;
      if(motion_z_data<1.0){
        motion_z_data=0;
      }
      motionData.push(motion_z_data);
  
    }
    /*
    if(motionData.length%10==0 ){
      let motion_z=[];
      for (let i = 0; i < motionData.length; i++) {
        let mot = motionData[i];
        motion_z.push(mot);
      }
      for (let i = 0; i < 20; i++) {
        motion_z = smoothing(motion_z);
      }
      peak_z = peak_select(motion_z);
      let num_z=0;
      for(let i=0;i<peak_z.length;i++){
        if(peak_z[i]==1){
          num_z++;
        }
      }
      if(num_z>1){
      let a=0;
      a=period_serch(peak_z);
      //bpmData.push(a+",");
      //document.getElementById("Accelerometer_bpm").innerHTML = bpmData.join("");
      motionData=[];
      fetch('/index.php', { // 第1引数に送り先
      method: 'POST', // メソッド指定
      headers: { 'Content-Type': 'application/json' }, // jsonを指定
      body: JSON.stringify(a) // json形式に変換して添付
      })
      }
    }*/
    if(motionData.length>100){
       fetch('/index.php', { // 第1引数に送り先
      method: 'POST', // メソッド指定
      headers: { 'Content-Type': 'application/json' }, // jsonを指定
      body: JSON.stringify(0) // json形式に変換して添付
      })
      motionData=[];
    }
    if(motionData.length>10){
       //. グラフ描画
      //let labels = [];
      let z_data = [];
      let peak_data = [];
      for (let i = 0; i < motionData.length; i++) {
        let mot = motionData[i];
        z_data.push(mot);
      }
      for (let i = 0; i < 15; i++) {
        z_data = smoothing(z_data);
      }
      peak_data = peak_select(z_data);
      let num_z=0;
      for(let i=0;i<peak_data.length;i++){
        if(peak_data[i]!=0){
          num_z++;
        }
      }
      let a_motion=0;
      //num_z=2;
      if(num_z>1){
        music.currentTime = 0;
        music.play();
        
      a_motion=period_serch(peak_data);
      bpmData.push(a_motion+",");
      document.getElementById("Accelerometer_bpm").innerHTML = bpmData.join("");
       motionData=[];
       //music.pleybackRate=3.0;
       //music.playbackRate = 2.0*a_motoin/60.0;
       //music.pleybackRate=2.0*a_motoin/60.0;
       music.defaultPlaybackRate = 0.5;
       //audioElement.playbackRate = 2.0*a*60.0;
      }
      if(a_motion!=0){
      fetch('/index.php', { // 第1引数に送り先
      method: 'POST', // メソッド指定
      headers: { 'Content-Type': 'application/json' }, // jsonを指定
      body: JSON.stringify(a_motion) // json形式に変換して添付
      })
      //document.getElementById("Session_id").innerHTML=$_SESSION['person'];
    }
    }
    
  }