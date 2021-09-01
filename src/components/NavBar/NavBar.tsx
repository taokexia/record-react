import React, { FunctionComponent, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { TabBar } from "zarm";
import CustomIcon from "../CustomIcon/CustomIcon";
import styles from "./style.module.less";

type NavBar = {
  showNav: boolean;
};

const NavBar: FunctionComponent<NavBar> = ({ showNav }) => {
  const [activeKey, setActiveKey] = useState(useLocation().pathname);
  const history = useHistory();

  const changeTab = (path: string | number | undefined) => {
    if (path) {
      setActiveKey(String(path));
      history.push(String(path));
    }
  };

  return (
    <TabBar
      visible={showNav}
      className={styles.tab}
      activeKey={activeKey}
      onChange={changeTab}
    >
      <TabBar.Item itemKey="/" title="账单" icon={<CustomIcon type="zhangdan"/>}/>
      <TabBar.Item itemKey="/data" title="统计" icon={<CustomIcon type="tongji"/>}/>
      <TabBar.Item itemKey="/user" title="我的" icon={<CustomIcon type="wode"/>}/>
    </TabBar>
  );
};

export default NavBar;
