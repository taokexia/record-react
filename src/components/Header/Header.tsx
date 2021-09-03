import React, { FunctionComponent } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { NavBar, Icon } from "zarm";

import styles from "./style.module.less";

type HeaderProps = {
  title: string;
};

const Header: FunctionComponent<HeaderProps> = ({ title = "" }) => {
  const history = useHistory();
  return (
    <div className={styles.headerWarp}>
      <div className={styles.block}>
        <NavBar
          className={styles.header}
          left={
            <Icon
              type="arrow-left"
              theme="primary"
              onClick={() => history.goBack()}
            />
          }
          title={title}
        />
      </div>
    </div>
  );
};

export default Header;
