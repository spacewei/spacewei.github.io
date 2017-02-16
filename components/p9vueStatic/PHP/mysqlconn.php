<?php
/**
 * Created by PhpStorm.
 * User: SPACEY
 * Date: 2016/10/4
 * Time: 17:48
 */
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

/*储存session*/
function sessionRepeat($sessionId,$sessionValue){
    $mysqli = initMysql();
    $queryStr = "insert into session_record(session_id,session_value) VALUES ('{$sessionId}'.','.'{$sessionValue}'.);";
    $mysqli->query($queryStr);
}

?>