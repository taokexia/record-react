import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Button, Cell } from "zarm";
import { getUserInfo } from "../../utils";

import styles from "./style.module.less";

type UserInfo = {
  id?: number;
  username?: string;
  signature?: string;
  avatar?: string;
};

const User = () => {
  const history = useHistory();
  const [user, setUser] = useState<UserInfo>({});

  useEffect(() => {
    getUserInfoData();
  }, []);

  // 获取用户信息
  const getUserInfoData = async () => {
    const { data } = await getUserInfo();
    setUser(data);
    // setAvatar(data.avatar);
  };

  // 退出登录
  const logout = async () => {
    sessionStorage.removeItem('token');
    history.push('/login');
  };

  return (
    <div className={styles.user}>
      <div className={styles.head}>
        <div className={styles.info}>
          <span>昵称：{user.username || "--"}</span>
          <span>
            <img
              style={{ width: 30, height: 30, verticalAlign: "-10px" }}
              src="//s.yezgea02.com/1615973630132/geqian.png"
              alt=""
            />
            <b>{user.signature || "暂无个签"}</b>
          </span>
        </div>
        <img
          className={styles.avatar}
          style={{ width: 60, height: 60, borderRadius: 8 }}
          src={user.avatar || ""}
          alt=""
        />
      </div>
      <div className={styles.content}>
        <Cell
          hasArrow
          title="用户信息修改"
          onClick={() => history.push("/userinfo")}
          icon={
            <img
              style={{ width: 20, verticalAlign: "-7px" }}
              src="//s.yezgea02.com/1615974766264/gxqm.png"
              alt=""
            />
          }
        />
        <Cell
          hasArrow
          title="重制密码"
          onClick={() => history.push("/account")}
          icon={
            <img
              style={{ width: 20, verticalAlign: "-7px" }}
              src="//s.yezgea02.com/1615974766264/zhaq.png"
              alt=""
            />
          }
        />
        {/* <Cell
          hasArrow
          title="关于我们"
          onClick={() => history.push("/about")}
          icon={
            <img
              style={{ width: 20, verticalAlign: "-7px" }}
              src="//s.yezgea02.com/1615975178434/lianxi.png"
              alt=""
            />
          }
        /> */}
      </div>
      <Button className={styles.logout} block theme="danger" onClick={logout}>退出登录</Button>
    </div>
  );
};

export default User;
