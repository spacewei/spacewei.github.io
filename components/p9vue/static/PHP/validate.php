<?php
session_start();
ob_clean();
header("content-type:image/png;charset=utf-8");
//header("Content-Type:application/json;charset=utf-8");
//header("Access-Control-Allow-Origin: http://localhost:9090");
include 'mysqlconn.php';
/**
 * Created by PhpStorm.
 * User: SPACEY
 * Date: 2016/10/8
 * Time: 17:17
 */
$code = "";
for($i=0;$i<4;$i++){
    $code .=rand(0,9);
}

$img = imagecreatetruecolor(64,20);
$red = imagecolorallocate($img,0xFF,0x00,0x00);
$white = imagecolorallocate($img,0xFF,0xFF,0xFF);
imagefill($img,0,0,$white);

$_SESSION['validate'] = $code;
//$_SESSION['validate']='testV';
//sessionRepeat(session_id(1),$_SESSION['validate']);

imagestring($img,5,10,0,$code,$red);

for($i=0;$i<10;$i++){
    imagesetpixel($img,rand(0,64),rand(0,20),$red);
}
for($i=0;$i<5;$i++){
    imageline($img,rand(0,64),rand(0,20),rand(0,64),rand(0,20),$red);
}
//session_destroy();
imagepng($img);
imagedestroy($img);

//echo json_encode(array("test"=>$_SESSION['validate']));