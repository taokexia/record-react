// Data/index.jsx
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { Icon, Progress } from "zarm";
import PopupDate, { PopupDateRef } from "../../components/PopupDate/PopupDate";
import { getBillData, typeMap } from "../../utils";
import cx from "classnames";
import styles from "./style.module.less";
import CustomIcon from "../../components/CustomIcon/CustomIcon";

type DataItem = {
  number: number;
  pay_type: number;
  type_id: number;
  type_name: string;
};

let proportionChart: any = null; // 用于存放 echart 初始化返回的实例

const Data = () => {
  const monthRef = useRef<PopupDateRef>();
  const [currentMonth, setCurrentMonth] = useState(dayjs().format("YYYY-MM"));
  const [totalType, setTotalType] = useState("expense"); // 收入或支出类型
  const [totalExpense, setTotalExpense] = useState(0); // 总支出
  const [totalIncome, setTotalIncome] = useState(0); // 总收入
  const [expenseData, setExpenseData] = useState<Array<DataItem>>([]); // 支出数据
  const [incomeData, setIncomeData] = useState<Array<DataItem>>([]); // 收入数据
  const [pieType, setPieType] = useState("expense"); // 饼图的「收入」和「支出」控制

  useEffect(() => {
    getData();
    return () => {
      // 每次组件卸载的时候，需要释放图表实例。clear 只是将其清空不会释放。
      proportionChart?.dispose();
    };
  }, [currentMonth]);

  // 绘制饼图方法
  const setPieChart = (data: Array<DataItem>) => {
    if (window.echarts) {
      // 初始化饼图，返回实例。
      proportionChart = window.echarts.init(
        document.getElementById("proportion")
      );
      proportionChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        // 图例
        legend: {
          data: data.map((item: any) => item.type_name),
        },
        series: [
          {
            name: "支出",
            type: "pie",
            radius: "55%",
            data: data.map((item: any) => {
              return {
                value: item.number,
                name: item.type_name,
              };
            }),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    }
  };

  // 获取数据详情
  const getData = async () => {
    const { data } = await getBillData(currentMonth);

    // 总收支
    setTotalExpense(data.totalExpense);
    setTotalIncome(data.totalIncome);

    // 过滤支出和收入
    const expenseData: Array<DataItem> = data.totalData
      .filter((item: DataItem) => item.pay_type == 1)
      .sort((a: DataItem, b: DataItem) => b.number - a.number); // 过滤出账单类型为支出的项
    const incomeData: Array<DataItem> = data.totalData
      .filter((item: DataItem) => item.pay_type == 2)
      .sort((a: DataItem, b: DataItem) => b.number - a.number); // 过滤出账单类型为收入的项
    setExpenseData(expenseData);
    setIncomeData(incomeData);
    setPieChart(pieType == "expense" ? expenseData : incomeData);
  };

  // 改变收支类型
  const changeTotalType = (type: string) => {
    setTotalType(type);
  };

  // 月份弹窗开关
  const monthShow = () => {
    monthRef.current && monthRef.current.show();
  };

  const selectMonth = (item: string) => {
    setCurrentMonth(item);
  };

  // 切换饼图收支类型
  const changePieType = (type: string) => {
    setPieType(type);
    // 重绘饼图
    setPieChart(type == "expense" ? expenseData : incomeData);
  };

  return (
    <div className={styles.data}>
      <div className={styles.total}>
        <div className={styles.time} onClick={monthShow}>
          <span>{currentMonth}</span>
          <Icon className={styles.date} type="date" />
        </div>
        <div className={styles.title}>共支出</div>
        <div className={styles.expense}>¥{totalExpense}</div>
        <div className={styles.income}>共收入¥{totalIncome}</div>
      </div>
      <div className={styles.structure}>
        <div className={styles.head}>
          <span className={styles.title}>收支构成</span>
          <div className={styles.tab}>
            <span
              onClick={() => changeTotalType("expense")}
              className={cx({
                [styles.expense]: true,
                [styles.active]: totalType == "expense",
              })}
            >
              支出
            </span>
            <span
              onClick={() => changeTotalType("income")}
              className={cx({
                [styles.income]: true,
                [styles.active]: totalType == "income",
              })}
            >
              收入
            </span>
          </div>
        </div>
        <div className={styles.content}>
          {(totalType == "expense" ? expenseData : incomeData).map(
            (item: DataItem) => (
              <div key={item.type_id} className={styles.item}>
                <div className={styles.left}>
                  <div className={styles.type}>
                    <span
                      className={cx({
                        [styles.expense]: totalType == "expense",
                        [styles.income]: totalType == "income",
                      })}
                    >
                      <CustomIcon
                        type={item.type_id ? typeMap[item.type_id].icon : "1"}
                      />
                    </span>
                    <span className={styles.name}>{item.type_name}</span>
                  </div>
                  <div className={styles.progress}>
                    ¥{Number(item.number).toFixed(2) || 0}
                  </div>
                </div>
                <div className={styles.right}>
                  <div className={styles.percent}>
                    <Progress
                      shape="line"
                      percent={
                        Number(
                          (Number(item.number) /
                            Number(
                              totalType == "expense"
                                ? totalExpense
                                : totalIncome
                            )) *
                            100
                        ).toFixed(2) as any
                      }
                      theme="primary"
                    />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
        <div className={styles.structure}>
          <div className={styles.proportion}>
            <div className={styles.head}>
              <span className={styles.title}>收支构成</span>
              <div className={styles.tab}>
                <span
                  onClick={() => changePieType("expense")}
                  className={cx({
                    [styles.expense]: true,
                    [styles.active]: pieType == "expense",
                  })}
                >
                  支出
                </span>
                <span
                  onClick={() => changePieType("income")}
                  className={cx({
                    [styles.income]: true,
                    [styles.active]: pieType == "income",
                  })}
                >
                  收入
                </span>
              </div>
            </div>
            {/* 这是用于放置饼图的 DOM 节点 */}
            <div id="proportion"></div>
          </div>
        </div>
      </div>
      <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} />
    </div>
  );
};

export default Data;
