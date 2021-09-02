// PopupDate/index.jsx
import React, { forwardRef, MutableRefObject, useState } from 'react'
import { Popup, DatePicker  } from 'zarm'
import dayjs from 'dayjs' 

type PopupDateProps = {
    mode: string; // 日期模式
    onSelect: Function; // 选择后的回调
};

export type PopupDateRef = {
    show: Function;
    close: Function;
};

const PopupDate = forwardRef<PopupDateRef|undefined,PopupDateProps>(({ onSelect, mode = 'date' }, ref) => {
  const [show, setShow] = useState(false)
  const [now, setNow] = useState<Date>(new Date())

  const choseMonth = (item: Date) => {
    setNow(item)
    setShow(false)
    if (mode == 'month') {
      onSelect(dayjs(item).format('YYYY-MM'))
    } else if (mode == 'date') {
      onSelect(dayjs(item).format('YYYY-MM-DD'))
    }
  }

  if (ref) {
    (ref as MutableRefObject<PopupDateRef>).current = {
      show: () => {
        setShow(true)
      },
      close: () => {
        setShow(false)
      }
    }
  };
  return <Popup
    visible={show}
    direction="bottom"
    onMaskClick={() => setShow(false)}
    destroy={false}
    mountContainer={() => document.body}
  >
    <div>
      <DatePicker
        visible={show}
        value={now}
        mode={mode}
        onOk={choseMonth}
        onCancel={() => setShow(false)}
      />
    </div>
  </Popup>
});

export default PopupDate;
