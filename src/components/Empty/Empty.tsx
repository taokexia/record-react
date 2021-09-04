import React, { FunctionComponent } from "react";
import PropTypes from "prop-types";
import styles from "./style.module.less";

type EmptyProps = {
    desc?: string;
};

const Empty: FunctionComponent<EmptyProps> = ({ desc }) => {
  return (
    <div className={styles.empty}>
      <img src="//s.yezgea02.com/1619144597039/empty.png" alt="暂无数据" />
      <div>{desc || "暂无数据"}</div>
    </div>
  );
};

export default Empty;
