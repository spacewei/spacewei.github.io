<?php
/**
 * Created by PhpStorm.
 * User: SPACEY
 * Date: 2016/12/31
 * Time: 0:37
 */
session_start();
ob_clean();
header("Content-Type:application/json;charset=utf-8");
header("Access-Control-Allow-Origin: http://localhost:9090");

function initMysql(){
    //连接数据库
    $dataBaseURL = "localhost";
    $dataBaseUser = "root";
    $dataBasePWD = "root";
    $mysqli = new mysqli($dataBaseURL,$dataBaseUser,$dataBasePWD);

    //选择数据库
    $dataBaseName = "p9Demo";
    $mysqli->select_db($dataBaseName);

    //设置客户端编码字符集
    $mysqli->set_charset('utf8');

    return $mysqli;
}

/*查找商品属性的中文名称和属性下对应参数函数*/
//function goodsProper($propertyId){
    $mysqli = initMysql();
//
//    //执行数据库语句
//    $queryStr = "select * from spec_parameter WHERE propertyId ='{$propertyId}'";
//
//    //得到结果集
//    $resultQuery = $mysqli->query($queryStr);
//
//    //
//    $result = [];
//    $specKey = [];
//    $specValue = [];
//    $proper = [];
//
//    while($rowTemp = $resultQuery->fetch_assoc()){
//        $displayName = $rowTemp['displayName'];
//        $spec = $rowTemp['spec'];
//        unset($rowTemp['propertyId'],$rowTemp['spec'],$rowTemp['displayName']);
//        $rowTemp = array_filter($rowTemp);
//        $rowTemp = array_values($rowTemp);
////        var_dump(array($spec => array("displayName"=>$displayName,"parameter"=>$rowTemp)));
////        array_push($result,array($spec => array("displayName"=>$displayName,"parameter"=>$rowTemp)));
//        array_push($specKey,$spec);
//        array_push($specValue,array("displayName"=>$displayName,"parameter"=>$rowTemp));
//    }
////    var_dump($specKey);
////    var_dump($specValue);
//
//    foreach($specKey as $key => $value){
//        $proper[$value] = $specValue[$key];
//    }
//    var_dump($proper);
//
//    //
////    $result = array("proper"=>$result);
//
//    //关闭数据库连接
////    $mysqli->close();
//
//    //返回结果
////    return $result;
//}

//$goodsID=2;
//$goodsNumber='3';
//$queryPrice = "SELECT price FROM goods_record WHERE goodsID={$goodsID}";
//$queryGoodsName = "SELECT goodsName FROM goods_record WHERE goodsID={$goodsID}";
//$price = $mysqli->query($queryPrice)->fetch_assoc();
//$goodsName = $mysqli->query($queryGoodsName)->fetch_assoc();
//
//$x= $price['price'] * $goodsNumber;
//
//var_dump($price);
//var_dump($goodsName);
//var_dump($x);
//$res = goodsProper(1);
//$resJSON = json_encode($res);

$goodsID=1;
$goodsNumber=222;
$userID='1';

$str0 = 'goodsID,goodsNumber,userID';
$str2 = 'goodsName';
$str3 = 'price';

//执行数据库语句
//注意,要先插入,再update,不能一起拼成字符串同时运行!!!
$queryInsert = "INSERT INTO shop_cart_record({$str0}) VALUES ({$goodsID},{$goodsNumber},{$userID});";
$mysqli->query($queryInsert);
//
$queryGoods = "SELECT goodsName,price FROM goods_record WHERE goodsID={$goodsID}";
$goodsMsg = $mysqli->query($queryGoods)->fetch_assoc();
var_dump($goodsMsg);
$rowTotal = $goodsMsg['price'] * $goodsNumber;
//$queryStr2 = "UPDATE shop_cart_record SET {$str2}={$goodsName['goodsName']},{$str3}={$price['price']},rowTotal={$rowTotal} WHERE (goodsID ={$goodsID} AND userID ='{$userID}')";
$queryUpdate = "UPDATE shop_cart_record SET goodsName='{$goodsMsg['goodsName']}',price={$goodsMsg['price']},rowTotal={$rowTotal} WHERE goodsID ={$goodsID}";
//$queryUpdate = "UPDATE shop_cart_record SET goodsName='aaa',price={$price['price']},rowTotal={$rowTotal} WHERE goodsID ={$goodsID}";
//
//    $queryStr2 = "UPDATE shop_cart_record SET {$str2}=(SELECT {$str2} from goods_record WHERE goodsID ={$goodsID}),{$str3}=(SELECT {$str3} from goods_record WHERE goodsID ={$goodsID}) WHERE (goodsID ={$goodsID} AND userID ='{$userID}');";
$result=$mysqli->query($queryUpdate);

//$queryStr1 = "update shop_cart_record set goodsNumber ='{$goodsNumber}' where goodsID ={$goodsID} AND userID ='{$userID}';";
//$result = $mysqli->query($queryStr1);
var_dump($result);