// PopupType/index.jsx
import React, { forwardRef, MutableRefObject, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Popup, Icon } from 'zarm'
import cx from 'classnames'

import styles from './style.module.less'
import { getTypeList } from '../../utils'

type PopupTypeProps = {
    onSelect: Function;
};

export type PopupTypeRef = {
    show: Function;
    close: Function;
}

export type TypeItem = {
    id: string;
    name: string;
}

// forwardRef 用于拿到父组件传入的 ref 属性，这样在父组件便能通过 ref 控制子组件。
const PopupType = forwardRef<PopupTypeRef|undefined, PopupTypeProps>(({ onSelect }, ref) => {
  const [show, setShow] = useState(false); // 组件的显示和隐藏
  const [active, setActive] = useState('all'); // 激活的 type
  const [expense, setExpense] = useState<Array<TypeItem>>([]); // 支出类型标签
  const [income, setIncome] = useState<Array<TypeItem>>([]); // 收入类型标签

  useEffect(() => {
    const getData = async () => {
        // 请求标签接口放在弹窗内，这个弹窗可能会被复用，所以请求如果放在外面，会造成代码冗余。
        const { data } = await getTypeList();
        setExpense(data.filter((i: { type: number }) => i.type == 1))
        setIncome(data.filter((i: { type: number }) => i.type == 2))
    };
    getData();
  }, [])

  if (ref) {
    (ref as MutableRefObject<PopupTypeRef>).current = {
      // 外部可以通过 ref.current.show 来控制组件的显示
      show: () => {
        setShow(true)
      },
      // 外部可以通过 ref.current.close 来控制组件的显示
      close: () => {
        setShow(false)
      }
    }
  };

  // 选择类型回调
  const choseType = (item: { id: string }) => {
    setActive(item.id)
    setShow(false)
    // 父组件传入的 onSelect，为了获取类型
    onSelect(item)
  };

  return <Popup
    visible={show}
    direction="bottom"
    onMaskClick={() => setShow(false)}
    destroy={false}
    mountContainer={() => document.body}
  >
    <div className={styles.popupType}>
      <div className={styles.header}>
        请选择类型
        <Icon type="wrong" className={styles.cross} onClick={() => setShow(false)} />
      </div>
      <div className={styles.content}>
        <div onClick={() => choseType({ id: 'all' })} className={cx({ [styles.all]: true, [styles.active]: active == 'all' })}>全部类型</div>
        <div className={styles.title}>支出</div>
        <div className={styles.expenseWrap}>
          {
            expense.map((item, index) => <p key={index} onClick={() => choseType(item)} className={cx({[styles.active]: active == item.id})} >{ item.name }</p>)
          }
        </div>
        <div className={styles.title}>收入</div>
        <div className={styles.incomeWrap}>
          {
            income.map((item, index) => <p key={index} onClick={() => choseType(item)} className={cx({[styles.active]: active == item.id})} >{ item.name }</p>)
          }
        </div>
      </div>
    </div>
  </Popup>
});

export default PopupType;