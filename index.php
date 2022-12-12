<?php
date_default_timezone_set('Asia/Tokyo'); // タイムゾーンを日本にセット
session_start();
/*
if (empty($_GET['change'])) {
  $_GET['change'] = 'change';
}
if (empty($_SESSION['person'])) {
  $_SESSION['person'] = 'Left';
}*/
// ユーザーアイコンが押された時
if (isset($_GET['person'])) {
  $_SESSION['person'] = $_GET['person'];
} else {
  // ユーザーアイコンも押されず、切り替えアイコンも押されていない時(=初めてページに訪れた時)
  if (empty($_GET['change']) && empty($_SESSION['person'])) {
    $_SESSION['person'] = 'Left';
    // 以下切り替えアイコンが押された時にアクティブのユーザーではない方に切り替える処理
  } elseif ($_GET['change'] === 'change' && $_SESSION['person'] === "Right") {
    $_SESSION['person']  = 'Left'; //現在2なら1をアクティブに
  } elseif ($_GET['change'] === 'change' && $_SESSION['person'] === "Left") {
    $_SESSION['person']  = 'Right'; //現在1なら2をアクティブに
  }
  if (empty($_SESSION['person'])) {
    $_SESSION['person'] = 'Left';
    // 以下切り替えアイコンが押された時にアクティブのユーザーではない方に切り替える処理
  }
}
$time = 1;

$raw = file_get_contents('php://input'); // POSTされた生のデータを受け取る
$data = json_decode($raw); // json形式をphp変数に変換
$res = $data; // やりたい処理
/*
$lr_session="r";
if ($_SESSION['person'] === 'Left') {
  $lr_session = "Left";
} elseif ($_SESSION['person'] === 'Right') {
  $lr_session = "Right";
}
$json_lr = json_encode($le_session);
*/
if($data=="-1"){
  file_put_contents("sample.js", "");
}else{
date_default_timezone_set('Asia/Tokyo'); // タイムゾーンを日本にセット

$chat = [];
if ($_SESSION['person'] === 'Left') {
  $chat["person"] = "Left";
  $param_json = json_encode($chat["person"]); //JSONエンコード
} elseif ($_SESSION['person'] === 'Right') {
  $chat["person"] = "Right";
}
$chat["time"] = date("H:i:s");
//$chat["bpm"] = '"'.floor($res).'"';

$chat["bpm"] = '' . (floor($res)) . '';
$json = json_encode($chat);
$json = $json . ',';
if (date("s")%10!=0) {
  file_put_contents("sample.js", $json, FILE_APPEND);
} else {
  //$time=date(i);
  file_put_contents("sample.js", "");
}
}

?>

<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <title>graph demo</title>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
  <script type="text/javascript" src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
  <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.3.0/css/bootstrap.min.css" rel="stylesheet" />
  <script src="//cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js"></script>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    #mycanvas {
      border: 1px solid #333;
      background-color: #ffcccc;
    }
  </style>
</head>

<body>
  <!--
   <iframe
      width="960"
      height="600"
      src="https://object-storage.tyo1.conoha.io/v1/nc_df3bdbc45bc04950b558834f5728517a/unityroom_production/game/30840/webgl/play.html"
      frameborder="0"
      allowfullscreen
    ></iframe>
    -->
  <main class="main">
    <div class="chat-system">
      <h2 class="text-center"><i class="far fa-comments"></i></h2>
      <form method="get" action="index.php">
        <div class="change-person flex-box">
                    <input type="submit" id="person1" name="person" value="Left">
          <label for="person1"></label>
          <input type="submit" id="person2" name="person" value="Right">
          <label for="person2"></label>
          <!-- <input type="submit" id="change" name="change" value="change">
            <label for="change">
              <i class="fas fa-people-arrows"></i></label>
         -->
        </div>
      </form>
    </div>
  </main>
  <!--
  <span id="lr_session">0</span>
  -->
  <h2>
        <div class="chat-area" id="chat-area">
        <?php echo $_SESSION['person']; ?>
      </div></h2>
      <!--
  <h2>加速度</h2>
  <ul>
    <li>X-axis: <span id="Accelerometer_gx">0</span><span> m/s<sup>2</sup></span></li>
    <li>Y-axis: <span id="Accelerometer_gy">0</span><span> m/s<sup>2</sup></span></li>
    <li>Z-axis: <span id="Accelerometer_gz">0</span><span> m/s<sup>2</sup></span>
    </li>
  </ul>
-->
  <h2>加速度（重力を除く）</h2>
  <ul>
    <li>X-axis： <span id="Accelerometer_x">0</span><span> m/s<sup>2</sup></span></li>
    <li>Y-axis： <span id="Accelerometer_y">0</span><span> m/s<sup>2</sup></span></li>
    <li>Z-axis： <span id="Accelerometer_z">0</span><span> m/s<sup>2</sup></span></li>
    <li>Data Interval： <span id="Accelerometer_i">0</span><span> s</span></li>
    <li>周期： <span id="Accelerometer_period">0</span><span> s</span></li>
    <li>BPM： <span id="Accelerometer_bpm" method="bpm">0</span><span> b/m</span></li>
    <li>機種：<span id="model"></span></li>
  </ul>
  <div class="container">
    <canvas id="mychart1" style="position: relative; width: 90%; height: 30%"></canvas>

    <div id="cdiv">
      <canvas width="400%" height="200%" id="mycanvas"></canvas>
    </div>
  </div>
  <script src="main.js"></script>
</body>
</html>