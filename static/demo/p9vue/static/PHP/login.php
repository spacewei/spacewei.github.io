<?php
session_start();
ob_clean();
header("Content-Type:application/json;charset=utf-8");
header("Access-Control-Allow-Origin: http://localhost:9090");
header("Access-Control-Allow-Credentials:true");
include 'mysqlconn.php';

/*查找用户的数据库操作函数*/
function userMysql($userName){
    $mysqli = initMysql();

    /*用预处理改造*/
    //改变sql语句,用?代替变量
    $sqlStr = "SELECT userID,user_name,password,user_name_chinese FROM user_record WHERE user_name =?;";

    //建立sql语句的预处理对象
    $stmt = $mysqli->prepare($sqlStr);

    //绑定参数到预处理语句
    $stmt->bind_param('s',$userName);

    $result = null;
    //执行预处理语句
    if($stmt->execute()){
        //绑定结果到变量
        $stmt->bind_result($userID,$userName,$password,$userNameChinese);
        while($stmt->fetch()){
            $result = array("userID"=>$userID,"userName"=>$userName,"password"=>$password,"userNameChinese"=>$userNameChinese);

        }
    }

    //关闭数据库连接
    $mysqli->close();

    //返回结果
    return $result;
}

/*登录验证函数*/
function login(){
    $userName = $_POST['userName'];
//加密输入的密码
    $userPWD = md5($_POST['userPWD']);
    $validate = $_POST['validate'];
//$_POST接收的数据都是字符串!字符串在if中都是true
    $saveLogin = false;
    if($_POST['saveLogin'] == 'true'){
        $saveLogin = true;
    };

//执行数据库查询
    $result = userMysql($userName);

//定义返回的字符串
    $x =array();

//先判断验证码是否正确
    if($validate == $_SESSION['validate']){
        //再判断是否有此用户
        if($result != null){
            //最后判断密码是否匹配
            if(md5($result['password']) != false && $userPWD != false && md5($result['password']) == $userPWD){
                $result['password'] = md5($result['password']);
                $x = array_merge($result,array('flag'=>'true'));
                $_SESSION['loginUserID'] = $result['userID'];
                $_SESSION['loginUserName'] = $result['userName'];
                //假如选择了保持登录3600s
                if($saveLogin){
                    setcookie("loginUserName",$result['userName'],time()+3600);
                    setcookie("loginUserID",$result['userID'],time()+3600);
                }
            }else{
                $x = array_merge($result,array('flag'=>'false','password'=>$result['password']));
                unset($_SESSION['loginUserName']);
                unset($_SESSION['loginUserID']);
            }
        }else{
            $result['userName'] = "无此用户";
            $result['password'] = "无意义";
            $x = array_merge($result, (array('flag' => 'none')));
            unset($_SESSION['loginUserName']);
            unset($_SESSION['loginUserID']);
        }
    }else{
        $x = array('flag'=>'validateFalse','validate'=>$_SESSION['validate']);
        unset($_SESSION['loginUserName']);
        unset($_SESSION['loginUserID']);
    }

//转换成json格式输出
    $xJson = json_encode($x);
    echo $xJson;
}

/*判断是否保存登录*/
function loginSave(){
        //如果之前没有保存用户,显示无保存用户;如果保存了,显示欢迎xx登录
        if(isset($_SESSION['loginUserID'])){
            $x = array_merge(array('flag'=>'keepSession','loginUserName'=>$_SESSION['loginUserName'],'loginUserID'=>$_SESSION['loginUserID']));
        }else if(isset($_COOKIE["loginUserID"])){
            $_SESSION['loginUserName'] = $_COOKIE["loginUserName"];
            $_SESSION['loginUserID'] = $_COOKIE["loginUserID"];
            $x = array_merge(array("flag"=>"keepCookie","loginUserName"=>$_SESSION['loginUserName'],'loginUserID'=>$_SESSION['loginUserID']));
        }else{
            $x = array_merge(array('flag'=>'keepNone'));
        }

        //转换成json格式输出
        $xJson = json_encode($x);
        echo $xJson;
}

/*退出登录*/
function loginOff(){
        unset($_SESSION['loginUserName']);
        unset($_SESSION['loginUserID']);
        setcookie("loginUserName","",time()-3600);
        setcookie("loginUserID","",time()-3600);
        $x = array_merge(array('flag'=>'restore'));

        //转换成json格式输出
        $xJson = json_encode($x);
        echo $xJson;
}

/*执行功能的switch判断*/
if(isset($_POST['loginFlag'])){
    switch ($_POST['loginFlag']){
        case "loginIn":
            login();
            break;
        case "loginOff":
            loginOff();
            break;
        case "ready":
            loginSave();
            break;
    }
}

?>
