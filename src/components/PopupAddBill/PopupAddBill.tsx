// PopupAddBill/index.jsx
import React, {
  forwardRef,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { Icon, Input, Keyboard, Popup, Toast } from "zarm";
import styles from "./style.module.less";
import cx from "classnames";
import dayjs from "dayjs";
import PopupDate, { PopupDateRef } from "../PopupDate/PopupDate";
import { getTypeList, postBillAdd, postBillUpdate, typeMap } from "../../utils";
import CustomIcon from "../CustomIcon/CustomIcon";
import { TypeItem } from "../PopupType/PopupType";

export type PopupAddBillRef = {
  show: Function;
  close: Function;
};

export type PopupAddProps = {
  onReload?: Function;
  detail?: BillDetailType;
};

export type BillDetailType = {
  id?: number;
  pay_type?: number;
  type_id?: string|number;
  type_name?: string;
  amount?: string;
  date?: string|number;
  remark?: string;
};

const PopupAddBill = forwardRef<PopupAddBillRef | undefined, PopupAddProps>(
  ({ detail = {}, onReload }, ref) => {
    const id = detail && detail.id; // 外部传进来的账单详情 id
    const [show, setShow] = useState(false); // 内部控制弹窗显示隐藏。
    const [payType, setPayType] = useState("expense"); // 支出或收入类型
    const [remark, setRemark] = useState(""); // 备注
    const [showRemark, setShowRemark] = useState(false); // 备注输入框展示控制
    const dateRef = useRef<PopupDateRef | undefined>();
    const [date, setDate] = useState(new Date()); // 日期
    const [currentType, setCurrentType] = useState<Partial<TypeItem>>({}); // 当前选中账单类型
    const [expense, setExpense] = useState<Array<TypeItem>>([]); // 支出类型数组
    const [income, setIncome] = useState<Array<TypeItem>>([]); // 收入类型数组
    // 通过 forwardRef 拿到外部传入的 ref，并添加属性，使得父组件可以通过 ref 控制子组件。
    if (ref) {
      (ref as MutableRefObject<PopupAddBillRef>).current = {
        show: () => {
          setShow(true);
        },
        close: () => {
          setShow(false);
        },
      };
    }

    useEffect(() => {
      if (detail.id) {
        setPayType(detail.pay_type == 1 ? "expense" : "income");
        setCurrentType({
          id: detail.type_id,
          name: detail.type_name,
        });
        detail.remark && setRemark(detail.remark);
        detail.amount && setAmount(detail.amount);
        setDate((dayjs(Number(detail.date)) as any).$d);
      }
    }, [detail]);

    useEffect(() => {
      const getTypeData = async () => {
        const { data } = await getTypeList();
        const _expense = data.filter((i: { type: number }) => i.type == 1); // 支出类型
        const _income = data.filter((i: { type: number }) => i.type == 2); // 收入类型
        setExpense(_expense);
        setIncome(_income);
        // 没有 id 的情况下，说明是新建账单。
        if (!id) {
          setCurrentType(_expense[0]);
        }
      };
      getTypeData();
    }, []);

    // 切换收入还是支出
    const changeType = (type: string) => {
      setPayType(type);
    };

    // 日期选择回调
    const selectDate = (val: Date) => {
      setDate(val);
    };

    const [amount, setAmount] = useState(""); // 金额
    // 监听输入框改变值
    const handleMoney = (value: string | undefined) => {
      if (value !== undefined) {
        // 点击是删除按钮时
        if (value == "delete") {
          let _amount = amount.slice(0, amount.length - 1);
          setAmount(_amount);
          return;
        }

        // 点击确认按钮时
        if (value == "ok") {
          // 这里后续将处理添加账单逻辑
          addBill();
          return;
        }

        // 当输入的值为 '.' 且 已经存在 '.'，则不让其继续字符串相加。
        if (value == "." && amount.includes(".")) return;
        // 小数点后保留两位，当超过两位时，不让其字符串继续相加。
        if (
          value != "." &&
          amount.includes(".") &&
          amount &&
          amount.split(".")[1].length >= 2
        )
          return;
        // amount += value
        setAmount(amount + value);
      }
    };

    // 添加账单
    const addBill = async () => {
      if (!amount) {
        Toast.show("请输入具体金额");
        return;
      }
      const params: BillDetailType = {
        amount: Number(amount).toFixed(2), // 账单金额小数点后保留两位
        type_id: currentType.id, // 账单种类id
        type_name: currentType.name, // 账单种类名称
        date: dayjs(date).unix() * 1000, // 日期传时间戳
        pay_type: payType == "expense" ? 1 : 2, // 账单类型传 1 或 2
        remark: remark || "", // 备注
      };
      if (id) {
        params.id = id;
        // 如果有 id 需要调用详情更新接口
        const result = await postBillUpdate(params);
        Toast.show('修改成功');
      } else {
        const result = await postBillAdd(params);
        // 重制数据
        setAmount("");
        setPayType("expense");
        setCurrentType(expense[0]);
        setDate(new Date());
        setRemark("");
        Toast.show("添加成功");
      }
      setShow(false);
      if (onReload) onReload();
    };

    return (
      <Popup
        visible={show}
        direction="bottom"
        onMaskClick={() => setShow(false)}
        destroy={false}
        mountContainer={() => document.body}
      >
        <div className={styles.addWrap}>
          {/* 右上角关闭弹窗 */}
          <header className={styles.header}>
            <span className={styles.close} onClick={() => setShow(false)}>
              <Icon type="wrong" />
            </span>
          </header>
          {/* 「收入」和「支出」类型切换 */}
          <div className={styles.filter}>
            <div className={styles.type}>
              <span
                onClick={() => changeType("expense")}
                className={cx({
                  [styles.expense]: true,
                  [styles.active]: payType == "expense",
                })}
              >
                支出
              </span>
              <span
                onClick={() => changeType("income")}
                className={cx({
                  [styles.income]: true,
                  [styles.active]: payType == "income",
                })}
              >
                收入
              </span>
            </div>
            <div
              className={styles.time}
              onClick={() => dateRef.current && dateRef.current.show()}
            >
              {dayjs(date).format("MM-DD")}{" "}
              <Icon className={styles.arrow} type="arrow-bottom" />
            </div>
          </div>
          <div className={styles.money}>
            <span className={styles.sufix}>¥</span>
            <span className={cx(styles.amount, styles.animation)}>
              {amount}
            </span>
          </div>
          <div className={styles.typeWarp}>
            <div className={styles.typeBody}>
              {/* 通过 payType 判断，是展示收入账单类型，还是支出账单类型 */}
              {(payType == "expense" ? expense : income).map((item) => (
                <div
                  onClick={() => setCurrentType(item)}
                  key={item.id}
                  className={styles.typeItem}
                >
                  {/* 收入和支出的字体颜色，以及背景颜色通过 payType 区分，并且设置高亮 */}
                  <span
                    className={cx({
                      [styles.iconfontWrap]: true,
                      [styles.expense]: payType == "expense",
                      [styles.income]: payType == "income",
                      [styles.active]: currentType.id == item.id,
                    })}
                  >
                    <CustomIcon
                      className={styles.iconfont}
                      type={typeMap[Number(item.id)].icon}
                    />
                  </span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.remark}>
            {showRemark ? (
              <Input
                autoHeight
                showLength
                maxLength={50}
                type="text"
                rows={3}
                value={remark}
                placeholder="请输入备注信息"
                onChange={(val?: string) => setRemark(val!)}
                onBlur={() => setShowRemark(false)}
              />
            ) : (
              <span onClick={() => setShowRemark(true)}>
                {remark || "添加备注"}
              </span>
            )}
          </div>
          <Keyboard type="price" onKeyClick={(value) => handleMoney(value)} />
          <PopupDate ref={dateRef} onSelect={selectDate} mode="date" />
        </div>
      </Popup>
    );
  }
);

export default PopupAddBill;
