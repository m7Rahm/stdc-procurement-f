import React, { useContext, useState } from 'react'
import { Suspense } from 'react'
import { MdAdd } from 'react-icons/md'
import { WebSocketContext } from '../../../pages/SelectModule'
import Modal from '../../Misc/Modal'
import "../../../styles/styles.scss"
const OrderModal = React.lazy(() => import('../../STDC local/OrderModal/OrderModal'))
const NewOrder = (props) => {
  const webSocket = useContext(WebSocketContext)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleClick = (action) => {
    setIsModalVisible(_ => action);
    setModalList(prevState => {
      const newList = prevState === null ?
        { all: [], current: null }
        : { ...prevState, current: null }
      return newList;
    })

    setServiceType("")
    setLastDate(new Date())
    setSelectedData(null)
    setReceivers([])
  };
  const handleClose = (data, receivers) => {
    // todo: send notif on new order to receivers
    setIsModalVisible(_ => false);

    if (modalList.current !== null) {
      setModalList(prevState => {
        const res = prevState.all.find(emp => emp.id === prevState.current.id);
        const newModals = !res ?
          { all: [...prevState.all, prevState.current], current: prevState.current }
          : { all: prevState.all.filter(emp => emp.id !== prevState.current.id), current: null };
        return newModals;
      });
    }

    const message = {
      message: "notification",
      receivers: receivers.map(receiver => ({ id: receiver, notif: "newOrder" })),
      data: undefined
    }
    webSocket.send(JSON.stringify(message))
    props.setOrders({ count: data[0].total_count, orders: data });
  };


  const [showModal, setShowModal] = useState(false);
  const [serviceType, setServiceType] = useState("")
  const [lastDate, setLastDate] = useState(new Date());
  const [selectedData, setSelectedData] = useState(null);
  const [receivers, setReceivers] = useState([]);
  const [modalList, setModalList] = useState(null)

  const handleOrderSelect = (orderId) => {
    const properties = modalList.all.find(emp => emp.id === orderId)
    setModalList({ ...modalList, current: properties })
    setShowModal(true)
    setServiceType(properties.value[0])
    setLastDate(properties.value[1])
    setSelectedData(properties.value[2])
    setReceivers(properties.value[3])
  }

  const minimizeHandler = () => {

    // setShowModal(false)

    const current = { 'id': Date.now(), 'value': [serviceType, lastDate, selectedData, receivers] }

    if (modalList.all.length === 0) {
      setModalList({ all: [current], current: current })
    } else if (modalList.current === null || !modalList.all.find(modal => modal.id === modalList.current.id)) {
      setModalList(prevState => ({ all: [...prevState.all, current], current: current }))
    } else {
      setModalList(prevState =>
      ({
        all: prevState.all.map(order =>
          order.id === modalList.current.id ?
            { ...order, 'value': [serviceType, lastDate, selectedData, receivers] }
            : order
        ), current: null
      })
      )
    }

  }


  return (
    <>
      <div title="yeni sifariş" className="new-order-button" onClick={() => handleClick(true)}>
        <MdAdd color="white" size="30" />
      </div>
      <div 
          className="" 
          style={{position:'fixed',right:'0',top:'0',bottom:'0',backgroundColor:'red'}}>Sidebar</div>
      {
        isModalVisible &&
        <Suspense fallback="">
          <Modal minimizable={true} style={{ width: "45rem", minHeight: "30rem", minWidth: "2rem", backgroundColor: "white" }} title="Yeni Sifariş" changeModalState={() => handleClick(false)} wrapperRef={props.wrapperRef}>
            {(props) => <OrderModal
              serviceType={serviceType}
              setServiceType={setServiceType}
              lastDate={lastDate}
              setLastDate={setLastDate}
              selectedData={selectedData}
              setSelectedData={setSelectedData}
              receivers={receivers}
              setReceivers={setReceivers}
              {...props} />}
          </Modal>
        </Suspense>
      }
    </>
  )
}
export default NewOrder