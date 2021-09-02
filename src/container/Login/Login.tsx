import React, { FunctionComponent, useCallback, useRef, useState } from "react";
import { Button, Cell, Checkbox, Input, Toast } from "zarm";
import CustomIcon from "../../components/CustomIcon/CustomIcon";
import Captcha from "react-captcha-code";
import { login, register } from "../../utils";
import cx from "classnames";

import styles from "./style.module.less";
import { useHistory } from "react-router-dom";

const Login: FunctionComponent = () => {
  const history = useHistory();
  const captchaRef = useRef();
  const [username, setUsername] = useState<string | undefined>(""); // 账号
  const [password, setPassword] = useState<string | undefined>(""); // 密码
  const [verify, setVerify] = useState<string | undefined>(""); // 验证码
  const [captcha, setCaptcha] = useState(""); // 验证码变化后存储值
  const [type, setType] = useState("login"); // 登录注册类型

  //  验证码变化，回调方法
  const handleChange = useCallback((captcha) => {
    console.log("captcha", captcha);
    setCaptcha(captcha);
  }, []);

  const onSubmit = async () => {
    if (!username) {
      Toast.show("请输入账号");
      return;
    }
    if (!password) {
      Toast.show("请输入密码");
      return;
    }

    try {
      // 判断是否是登录状态
      if (type == "login") {
        // 执行登录接口，获取 token
        const { data } = await login({
          username,
          password,
        });
        // 将 token 写入 sessionStorage
        sessionStorage.setItem("token", data.token);
        history.push('/');
        Toast.show("登录成功");
      } else {
        if (!verify) {
          Toast.show("请输入验证码");
          return;
        }
        if (verify != captcha) {
          Toast.show("验证码错误");
          return;
        }
        const { data } = await register({
          username,
          password,
        });
        Toast.show("注册成功");
        // 注册成功，自动将 tab 切换到 login 状态
        setType("login");
      }
    } catch (error) {
      Toast.show(error.msg);
    }
  };

  return (
    <div className={styles.auth}>
      <div className={styles.head} />
        <div className={styles.tab}>
          <span
            className={cx({ [styles.avtive]: type == "login" })}
            onClick={() => setType("login")}
          >
            登录
          </span>
          <span
            className={cx({ [styles.avtive]: type == "register" })}
            onClick={() => setType("register")}
          >
            注册
          </span>
      </div>
      <div className={styles.form}>
        <Cell icon={<CustomIcon type="zhanghao" />}>
          <Input
            clearable
            type="text"
            placeholder="请输入账号"
            onChange={(value?: string) => setUsername(value)}
          />
        </Cell>
        <Cell icon={<CustomIcon type="mima" />}>
          <Input
            clearable
            type="password"
            placeholder="请输入密码"
            onChange={(value?: string) => setPassword(value)}
          />
        </Cell>
        {type == "register" ? (
          <Cell icon={<CustomIcon type="mima" />}>
            <Input
              clearable
              type="text"
              placeholder="请输入验证码"
              onChange={(value?: string) => setVerify(value)}
            />
            <Captcha
              ref={captchaRef as any}
              charNum={4}
              onChange={handleChange}
            />
          </Cell>
        ) : null}
      </div>
      <div className={styles.operation}>
        {type == "register" ? (
          <div className={styles.agree}>
            <Checkbox />
            <label className="text-light">
              阅读并同意<a>《掘掘手札条款》</a>
            </label>
          </div>
        ) : null}
        <Button block theme="primary" onClick={onSubmit}>
          {type == "login" ? "登录" : "注册"}
        </Button>
      </div>
    </div>
  );
};

export default Login;
