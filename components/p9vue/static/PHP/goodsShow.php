<?php
/**
 * Created by PhpStorm.
 * User: SPACEY
 * Date: 2016/10/11
 * Time: 22:53
 */
session_start();
ob_clean();
header("Content-Type:application/json;charset=utf-8");
header("Access-Control-Allow-Origin: http://localhost:9090");
header("Access-Control-Allow-Credentials:true");

include 'mysqlconn.php';

$specNetwork = addslashes($_POST['spec0']);
$specColor = addslashes($_POST['spec2']);
$specPackage = addslashes($_POST['spec3']);
$specStorage = addslashes($_POST['spec1']);
$propertyId = addslashes($_POST['propertyId']);

$resultProper = [];

/*查找商品的数据库操作函数*/
function goodsMysql($specNetwork,$specColor,$specPackage,$specStorage){
    $mysqli = initMysql();

    //执行数据库语句
    //$str = "goodsID,goodsName,price,stock,monthlySales,evaluate,spec0,spec1,spec2,spec3,specialPrice";
    $queryStr = "select * from goods_record where (spec0='{$specNetwork}' and spec1='{$specStorage}' and spec2='{$specColor}' and spec3='{$specPackage}')";

    //得到结果集
    $resultQuery = $mysqli->query($queryStr);

    //用关联数组输出查询到的结果
    $result = $resultQuery->fetch_assoc();

    //返回结果
    return $result;
}

/*查找商品属性的中文名称和属性下对应参数函数*/
function goodsProper($propertyId){
    $mysqli = initMysql();

    //执行数据库语句
    $queryStr = "select * from spec_parameter WHERE propertyId ='{$propertyId}'";

    //得到结果集
    $resultQuery = $mysqli->query($queryStr);

    //
    $specKey = [];
    $specValue = [];
    $proper = [];

    while($rowTemp = $resultQuery->fetch_assoc()){
        $displayName = $rowTemp['displayName'];
        $spec = $rowTemp['spec'];
        unset($rowTemp['propertyId'],$rowTemp['spec'],$rowTemp['displayName']);
        $rowTemp = array_filter($rowTemp);
        $rowTemp = array_values($rowTemp);
        array_push($specKey,$spec);
        array_push($specValue,array("displayName"=>$displayName,"parameter"=>$rowTemp));
    }

    //
    foreach($specKey as $key => $value){
        $proper[$value] = $specValue[$key];
    }

    //返回结果
    return $proper;
}

/*页面初始化,调用默认的页面商品信息*/
/*接收商品规格选择变化,显示对应商品信息显示*/
if(isset($_POST['specFlag']) || isset($_POST['ready'])){
    /*只有在初始化时,查询spec的对应中文及属性对应的参数*/
    if(isset($_POST['ready'])){
        $resultProper = array("proper" => goodsProper($propertyId));
    }

    //查询goods_record表操作
    $result = goodsMysql($specNetwork,$specColor,$specPackage,$specStorage);

    //
    if(isset($_POST['ready'])){
        $result=array_merge($result,$resultProper);
    }

    //将选择的商品的ID计入session变量
    $_SESSION['currentGoodsID'] = $result['goodsID'];

    //转换成json格式输出
    $resultJson = json_encode($result);
    echo $resultJson;
}

