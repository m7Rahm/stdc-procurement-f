import React, { useEffect, useState, Suspense, lazy } from 'react'
import {
  FaSortDown,
  FaSortUp
} from 'react-icons/fa'
import OperationStateLite from '../../Misc/OperationStateLite'
import ListItem from './ListItem'
const Modal = lazy(() => import("../../Misc/Modal"))
const Table = (props) => {
  const { referer, setOrders } = props;
  const [sortDateUp, setSortDateUp] = useState(undefined)
  const [sending, setSending] = useState(undefined);
  const [operationStateText, setOperationStateText] = useState({ text: "Sifariş göndərilir..." })
  const [sortNumberUp, setSortNumberUp] = useState(undefined);
  const [sortStatusUp, setSortStatusUp] = useState(undefined);
  useEffect(() => {
    if (sortDateUp !== undefined) {
      const asc = (a, b) => a.id > b.id ? 1 : -1
      const desc = (a, b) => a.id > b.id ? -1 : 1
      setOrders(prev => ({ ...prev, orders: [...prev.orders.sort(sortDateUp ? asc : desc)] }))
    }
  }, [sortDateUp, setOrders])
  useEffect(() => {
    if (sortNumberUp !== undefined) {
      const asc = (a, b) => a.id > b.id ? 1 : -1
      const desc = (a, b) => a.id > b.id ? -1 : 1
      setOrders(prev => ({ ...prev, orders: [...prev.orders.sort(sortNumberUp ? asc : desc)] }))
    }
  }, [sortNumberUp, setOrders])
  useEffect(() => {
    if (sortStatusUp !== undefined) {
      const asc = (a, b) => a.status > b.status ? 1 : -1
      const desc = (a, b) => a.status > b.status ? -1 : 1
      setOrders(prev => ({ ...prev, orders: [...prev.orders.sort(sortStatusUp ? asc : desc)] }))
    }
  }, [sortStatusUp, setOrders])
  const sortByDate = () => {
    setSortDateUp(prev => !prev)
  }
  const sortByNumber = () => {
    setSortNumberUp(prev => !prev)
  }
  const [modalState, setModalState] = useState({ visible: false, content: null, childProps: {}, title: "Sifariş №" });
  const createDateFilterIcon = !sortDateUp
    ? <FaSortDown style={{ float: 'right', marginRight: '10px' }} onClick={sortByDate} />
    : <FaSortUp onClick={sortByDate} style={{ float: 'right', marginRight: '10px' }} />
  const numberIcon = !sortNumberUp
    ? <FaSortDown style={{ float: 'right', marginRight: '10px' }} onClick={sortByNumber} />
    : <FaSortUp onClick={sortByNumber} style={{ float: 'right', marginRight: '10px' }} />
  const sortIcon = !sortStatusUp
    ? <FaSortDown style={{ float: 'right', marginRight: '10px' }} onClick={() => setSortStatusUp(prev => !prev)} />
    : <FaSortUp onClick={() => setSortStatusUp(prev => !prev)} style={{ float: 'right', marginRight: '10px' }} />
  // console.log(props.orders.orders)
  const handleClose = () => {
    setModalState(prev => ({ ...prev, visible: false }));
  }
  return (
    <>
      <Suspense fallback="">
        {
          modalState.visible &&
          <Modal
            childProps={modalState.childProps}
            changeModalState={handleClose}
            number={modalState.number}
            title={modalState.title}
            style={modalState.style}
          >
            {modalState.content}
          </Modal>
        }
      </Suspense>
      {sending !== undefined && <OperationStateLite state={sending} setState={setSending} text={operationStateText.text} />}
      <ul className='table'>
        <li style={{ justifyContent: "space-between" }}>
          <div style={{ width: '30px', textAlign: "center" }}> #</div>
          <div style={{ minWidth: '80px', textAlign: "center" }}> Status {sortIcon}</div>
          <div style={{ minWidth: '80px', width: '15%', textAlign: 'left' }}> Tarix {createDateFilterIcon}</div>
          <div style={{ minWidth: '80px', width: '15%', textAlign: 'left' }}> Deadline {createDateFilterIcon}</div>
          <div style={{ minWidth: '60px', width: '15%', textAlign: 'left' }}> Nömrə {numberIcon}</div>
          <div style={{ width: '40%', textAlign: 'left' }}> İştirakçılar</div>
          <div style={{ minWidth: '5%', width: "60px" }}> Qeyd</div>
          {/* <div style={{ minWidth: '40px', overflow: 'visible', display: 'inline-block', width: 'auto' }}> </div> */}
          <div style={{ width: "20px" }}></div>
        </li>
        {
          props.orders.orders.map((order, index) =>
            <ListItem
              index={index}
              key={order.id}
              order={order}
              referer={referer}
              setOrders={setOrders}
              status={order.status}
              participants={order.participants}
              date={order.create_date_time}
              deadline={order.deadline}
              id={order.id}
              setModalState={setModalState}
              setSending={setSending}
              setOperationStateText={setOperationStateText}
              empid={order.emp_id}
              number={order.ord_numb}
            />
          )
        }
      </ul>
    </>
  )
}

export default Table