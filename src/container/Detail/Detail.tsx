import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import qs from "query-string";
import cx from "classnames";
import styles from "./style.module.less";
import { getBillDetail, postBillDelete, typeMap } from "../../utils";
import CustomIcon from "../../components/CustomIcon/CustomIcon";
import dayjs from "dayjs";
import { Modal, Toast } from "zarm";
import PopupAddBill, { BillDetailType, PopupAddBillRef } from "../../components/PopupAddBill/PopupAddBill";


const Detail = () => {
  const location = useLocation(); // 获取 locaton 实例，我们可以通过打印查看内部都有些什么内容。
  const history = useHistory();
  const { id } = qs.parse(location.search);

  const [detail, setDetail] = useState<BillDetailType>({});
  const editRef = useRef<PopupAddBillRef|undefined>();

  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = async () => {
    if (id && typeof id === "string") {
      const { data } = await getBillDetail(id);
      setDetail(data);
    }
  };

  // 删除方法
  const deleteDetail = () => {
    Modal.confirm({
      title: "删除",
      content: "确认删除账单？",
      onOk: async () => {
        const { data } = await postBillDelete({ id });
        Toast.show("删除成功");
        history.goBack();
      },
    });
  };

  return (
    <div className={styles.detail}>
      <Header title="账单详情" />
      <div className={styles.card}>
        <div className={styles.type}>
          {/* 通过 pay_type 属性，判断是收入或指出，给出不同的颜色*/}
          <span
            className={cx({
              [styles.expense]: detail.pay_type == 1,
              [styles.income]: detail.pay_type == 2,
            })}
          >
            {/* typeMap 是我们事先约定好的 icon 列表 */}
            <CustomIcon
              className={styles.iconfont}
              type={detail.type_id ? typeMap[Number(detail.type_id)].icon : "1"}
            />
          </span>
          <span>{detail.type_name || ""}</span>
        </div>
        {detail.pay_type == 1 ? (
          <div className={cx(styles.amount, styles.expense)}>
            -{detail.amount}
          </div>
        ) : (
          <div className={cx(styles.amount, styles.incom)}>
            +{detail.amount}
          </div>
        )}
        <div className={styles.info}>
          <div className={styles.time}>
            <span>记录时间</span>
            <span>{detail.date ? dayjs(new Date(detail.date)).format("YYYY-MM-DD HH:mm") : '--'}</span>
          </div>
          <div className={styles.remark}>
            <span>备注</span>
            <span>{detail.remark || "--"}</span>
          </div>
        </div>
        <div className={styles.operation}>
          <span onClick={deleteDetail}>
            <CustomIcon type="shanchu" />
            删除
          </span>
          <span onClick={() => editRef.current && editRef.current.show()}>
            <CustomIcon type="tianjia" />
            编辑
          </span>
        </div>
      </div>
      <PopupAddBill ref={editRef} detail={detail} onReload={getDetail} />
    </div>
  );
};

export default Detail;
