import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { Icon, Pull } from "zarm";
import BillItem, { BillListItem } from "../../components/BillItem/BillItem";
import CustomIcon from "../../components/CustomIcon/CustomIcon";
import Empty from "../../components/Empty/Empty";
import PopupAddBill, { PopupAddBillRef } from "../../components/PopupAddBill/PopupAddBill";
import PopupDate, { PopupDateRef } from "../../components/PopupDate/PopupDate";
import PopupType, { PopupTypeRef } from "../../components/PopupType/PopupType";
import { LOAD_STATE, REFRESH_STATE, getBillList } from "../../utils";

import styles from "./style.module.less";

const Home = () => {
  const [currentTime, setCurrentTime] = useState<string>(
    dayjs().format("YYYY-MM")
  ); // 当前筛选时间
  const [list, setList] = useState<Array<BillListItem>>([]); // 账单列表
  const [page, setPage] = useState<number>(1); // 分页
  const [totalPage, setTotalPage] = useState(0); // 分页总数
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal); // 下拉刷新状态
  const [loading, setLoading] = useState(LOAD_STATE.normal); // 上拉加载状态

  const typeRef = useRef<PopupTypeRef>(); // 账单类型 ref
  const [currentSelect, setCurrentSelect] = useState<{id?: number, name?: string}>({}); // 当前筛选类型

  const monthRef = useRef<PopupDateRef>(); // 月份筛选 ref

  const [totalExpense, setTotalExpense] = useState<number>(0); // 总支出
  const [totalIncome, setTotalIncome] = useState<number>(0); // 总收入

  useEffect(() => {
    getBillData(); // 初始化
  }, [page, currentSelect, currentTime]);

  // 获取账单方法
  const getBillData = async () => {
    const { data } = await getBillList(page, currentTime, currentSelect.id);
    // 下拉刷新，重制数据
    if (page == 1) {
      setList(data.list);
    } else {
      setList(list.concat(data.list));
    }
    setTotalExpense(data.totalExpense.toFixed(2));
    setTotalIncome(data.totalIncome.toFixed(2));
    setTotalPage(data.totalPage);
    // 上滑加载状态
    setLoading(LOAD_STATE.success);
    setRefreshing(REFRESH_STATE.success);
  };

  // 请求列表数据
  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading);
    if (page != 1) {
      setPage(1);
    } else {
      getBillData();
    }
  };

  const loadData = () => {
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading);
      setPage(page + 1);
    }
  };

  // 添加账单弹窗
  const toggle = () => {
    typeRef.current && typeRef.current.show()
  };

  // 筛选类型
  const select = (item: React.SetStateAction<{ id?: number | undefined; name?: string | undefined; }>) => {
    setRefreshing(REFRESH_STATE.loading);
    // 触发刷新列表，将分页重制为 1
    setPage(1);
    setCurrentSelect(item)
  }

  // 选择月份弹窗
  const monthToggle = () => {
    monthRef.current && monthRef.current.show()
  };

  // 筛选月份
  const selectMonth = (item: React.SetStateAction<string>) => {
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    setCurrentTime(item)
  };

  const addRef = useRef<PopupAddBillRef>(); // 添加账单 ref
  // 添加账单
  const addToggle = () => {
    addRef.current && addRef.current.show();
  };

  return (
    <div className={styles.home}>
      <div className={styles.header}>
        <div className={styles.dataWrap}>
          <span className={styles.expense}>
            总支出：<b>¥ {totalExpense}</b>
          </span>
          <span className={styles.income}>
            总收入：<b>¥ {totalIncome}</b>
          </span>
        </div>
        <div className={styles.typeWrap}>
          <div className={styles.left}>
            <span className={styles.title} onClick={toggle}>
            { currentSelect.name || '全部类型' } <Icon className={styles.arrow} type="arrow-bottom" />
            </span>
          </div>
          <div className={styles.right}>
            <span className={styles.time} onClick={monthToggle}>
              {currentTime}
              <Icon className={styles.arrow} type="arrow-bottom" />
            </span>
          </div>
        </div>
      </div>
      <div className={styles.contentWrap}>
        {list.length ? (
          <Pull
            animationDuration={200}
            stayTime={400}
            refresh={{
              state: refreshing,
              handler: refreshData,
            }}
            load={{
              state: loading,
              distance: 200,
              handler: loadData,
            }}
          >
            {list.map((item, index) => (
              <BillItem bill={item} key={index} />
            ))}
          </Pull>
        ) : <Empty />}
      </div>
      <PopupType ref={typeRef} onSelect={select} />
      <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} />
      <PopupAddBill ref={addRef} onReload={refreshData} />
      <div className={styles.add} onClick={addToggle}><CustomIcon type='tianjia' /></div>
    </div>
  );
};

export default Home;
