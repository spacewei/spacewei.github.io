<?php
/**
 * Created by PhpStorm.
 * User: SPACEY
 * Date: 2016/10/12
 * Time: 21:43
 */
session_start();
ob_clean();
header("Content-Type:application/json;charset=utf-8");
header("Access-Control-Allow-Origin: http://localhost:9090");
header("Access-Control-Allow-Credentials:true");
include 'mysqlconn.php';

/*加入购物车*/
function pushShopCart($goodsNumber){
    $goodsID = addslashes($_SESSION['currentGoodsID']);
    $userID = $_SESSION['loginUserID'];

    //执行数据库复制函数
    $result = shopCartMysql($goodsID, $goodsNumber, $userID);

    $resultArray = array("result" => $goodsID.$goodsNumber.$userID);
    return $resultArray;
}

/*将选中的商品信息从商品数据库复制到购物车数据库*/
function shopCartMysql($goodsID,$goodsNumber,$userID){
    $mysqli = initMysql();
    $strInsert = 'goodsID,goodsNumber,userID';
    $strSelect = 'goodsName,price';

    //执行数据库语句,注意!!!要先插入,再update,不能一起拼成字符串同时运行!!!
    $queryInsert = "INSERT INTO shop_cart_record({$strInsert}) VALUES ({$goodsID},{$goodsNumber},{$userID});";
    $mysqli->query($queryInsert);
    //从商品库查询商品信息,目前只用到名称和价格
    $querySelect = "SELECT {$strSelect} FROM goods_record WHERE goodsID={$goodsID};";
    $goodsMsg = $mysqli->query($querySelect)->fetch_assoc();
    //计算购买此类商品的总价
    $rowTotal = $goodsMsg['price'] * $goodsNumber;
    //更新购物车中商品的价格,名称,总价,再更新购买数量
    $queryUpdate = "UPDATE shop_cart_record SET goodsName='{$goodsMsg['goodsName']}',price={$goodsMsg['price']},rowTotal={$rowTotal},goodsNumber={$goodsNumber} WHERE goodsID ={$goodsID} AND userID='{$userID}';";
    $result=$mysqli->query($queryUpdate);

    //关闭数据库连接
    $mysqli->close();

    //返回结果
    return $result;
}

/*购物车页面初始化(显示其中商品信息)函数*/
function initShopCart(){
    $mysqli = initMysql();

    $queryStr ="select * from shop_cart_record;";

    $resultQuery = $mysqli->query($queryStr);

    $array =array();

    while($resultArray=$resultQuery->fetch_assoc()){
        $resultJson = json_encode($resultArray);
        array_push($array,$resultJson);
    }

    //关闭数据库连接
    $mysqli->close();

    $arrayJson = json_encode($array);
    return $arrayJson;
}

/*点击删除,删除一项商品*/
function deleteThisGoods($thisGoodsID,$loginUserID){
    $mysqli = initMysql();

    $queryStr ="delete from shop_cart_record where goodsID ={$thisGoodsID} and userID ='{$loginUserID}';";

    $result =  $mysqli->query($queryStr);

    //关闭数据库连接
    $mysqli->close();

    return $result;
}

if(isset($_SESSION['loginUserID']) || isset($_COOKIE['loginUserID'])){
    switch ($_POST['shopCartFlag']) {
        case 'pushShopCart' :
            $goodsNumber = addslashes($_POST['goodsNumber']);
            $resultArray = pushShopCart($goodsNumber);
            echo json_encode($resultArray);
            break;
        case 'initShopCart' :
            $arrayJson = initShopCart();
            echo $arrayJson;
            break;
        case 'deleteGoodsClass' :
            echo deleteThisGoods($_POST['thisGoodsID'],$_SESSION['loginUserID']);
            break;
    }
}else{
    $resultArray = array("result" => "fail");
    echo json_encode($resultArray);
}