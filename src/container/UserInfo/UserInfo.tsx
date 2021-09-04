import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { FilePicker, Button, Toast, Input } from "zarm";
import Header from "../../components/Header/Header";
import { getUserInfo, host, postUserUpdate } from "../../utils";

import styles from "./style.module.less";

const UserInfo = () => {
  const history = useHistory(); // 路由实例
  const [user, setUser] = useState({}); // 用户
  const [avatar, setAvatar] = useState(""); // 头像
  const [signature, setSignature] = useState(""); // 个签
  const token = sessionStorage.getItem("token"); // 登录令牌

  useEffect(() => {
    getUserInfoData(); // 初始化请求
  }, []);

  // 获取用户信息
  const getUserInfoData = async () => {
    const { data } = await getUserInfo();
    setUser(data);
    setAvatar(data.avatar);
    setSignature(data.signature);
  };

  const handleSelect = (file: any) => {
    console.log("file", file);
    if (file && file.file.size > 200 * 1024) {
      Toast.show("上传头像不得超过 200 KB！！");
      return;
    }
    let formData = new FormData();
    formData.append("file", file.file);
    // 通过 axios 设置  'Content-Type': 'multipart/form-data', 进行文件上传
    axios({
      method: "post",
      url: `${host}/api/upload`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token,
      },
    }).then((res) => {
      // 返回图片地址
      setAvatar(res.data);
    });
  };

  // 编辑用户信息方法
  const save = async () => {
    const { data } = await postUserUpdate({
      signature,
      avatar,
    });

    Toast.show("修改成功");
    // 成功后回到个人中心页面
    history.goBack();
  };

  return (
    <>
      <Header title="用户信息" />
      <div className={styles.userinfo}>
        <h1>个人资料</h1>
        <div className={styles.item}>
          <div className={styles.title}>头像</div>
          <div className={styles.avatar}>
            <img className={styles.avatarUrl} src={avatar} alt="" />
            <div className={styles.desc}>
              <span>支持 jpg、png、jpeg 格式大小 200KB 以内的图片</span>
              <FilePicker
                className={styles.filePicker}
                onChange={handleSelect}
                accept="image/*"
              >
                <Button className={styles.upload} theme="primary" size="xs">
                  点击上传
                </Button>
              </FilePicker>
            </div>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.title}>个性签名</div>
          <div className={styles.signature}>
            <Input
              clearable
              type="text"
              value={signature}
              placeholder="请输入个性签名"
              onChange={(value: any) => setSignature(value)}
            />
          </div>
        </div>
        <Button onClick={save} style={{ marginTop: 50 }} block theme="primary">
          保存
        </Button>
      </div>
    </>
  );
};

export default UserInfo;
