import React, { useContext, useState, useRef } from 'react'
import { Suspense } from 'react'
import { MdAdd } from 'react-icons/md'
import { WebSocketContext } from '../../../pages/SelectModule'
import Modal from '../../Misc/Modal'
import "../../../styles/styles.scss"
const OrderModal = React.lazy(() => import('../../STDC local/OrderModal/OrderModal'))
const NewOrder = (props) => {
  // eslint-disable-next-line
  const webSocket = useContext(WebSocketContext)
  const sidebarRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalList, setModalList] = useState(null)
  const [choices, setChoices] = useState({ serviceType: "mal-material", lastDate: new Date(), selectedData: null, receivers: [] })

  const handleClick = (action) => {
    setIsModalVisible(_ => action);
    setModalList(prevState => {
      const newList = prevState === null ?
        { all: [], current: null }
        : { ...prevState, current: null }
      return newList;
    })
  }

  // const handleClose = (data, receivers) => {
  //   // todo: send notif on new order to receivers
  //   setIsModalVisible(_ => false);
  //   const message = {
  //     message: "notification",
  //     receivers: receivers.map(receiver => ({ id: receiver, notif: "newOrder" })),
  //     data: undefined
  //   }
  //   webSocket.send(JSON.stringify(message))
  //   props.setOrders({ count: data[0].total_count, orders: data });
  // };

  const handleCloseModal = () => {
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
  }
  // eslint-disable-next-line
  const handleOrderSelect = (orderId) => {
    const properties = modalList.all.find(emp => emp.id === orderId)
    setModalList(prevState => ({ ...prevState, current: properties }))
    setIsModalVisible(_ => true);
    // setChoices({ serviceType: properties.value[0], lastDate: properties.value[1], selectedData: properties.value[2], receivers: properties.value[3] })
  }
  const minimizeHandler = (state) => {
    setIsModalVisible(_ => false);
    const current = { 'id': Date.now(), 'value': [state.serviceType, state.lastDate, state.selectedData, state.receivers] }
    if (modalList.all.length === 0) {
      setModalList({ all: [current], current: current })
    } else if (modalList.current === null || !modalList.all.find(modal => modal.id === modalList.current.id)) {
      setModalList(prevState => ({ all: [...prevState.all, current], current: current }))
    } else {
      setModalList(prevState =>
      ({
        all: prevState.all.map(order =>
          order.id === modalList.current.id ?
            { ...order, 'value': [state.serviceType, state.lastDate, state.selectedData, state.receivers] }
            : order
        ), current: null
      })
      )
    }
  }
  const mouseOverHandlerSlide = (e) => {
    sidebarRef.current.style.transform = "translateX(0px)";
  };
  const mouseOverHandlerSlideBack = (e) => {
    sidebarRef.current.style.transform = "translateX(200px)";
  };
  return (
    <>
      <div title="yeni sifariş" className="new-order-button" onClick={() => handleClick(true)}>
        <MdAdd color="white" size="30" />
      </div>
      <div className="sidebar" ref={sidebarRef} onMouseLeave={mouseOverHandlerSlideBack}>
        <div className="sidebar-button" onMouseOver={mouseOverHandlerSlide}></div>
        <div className="sidebar2"></div>
      </div>
      {
        isModalVisible &&
        <Suspense fallback="">
          <Modal
            minimizable={true} style={{ width: "45rem", minHeight: "30rem", minWidth: "2rem", backgroundColor: "white" }}
            title="Yeni Sifariş"
            childProps={{ choices: choices, setChoices: setChoices }}
            minimizeHandler={minimizeHandler}
            changeModalState={handleCloseModal}
            wrapperRef={props.wrapperRef}
          >
            {OrderModal}
          </Modal>
        </Suspense>
      }
    </>
  )
}
export default NewOrder