import React, { useContext, useState, useRef } from 'react'
import { Suspense } from 'react'
import { MdAdd } from 'react-icons/md'
import { WebSocketContext } from '../../../pages/SelectModule'
import Modal from '../../Misc/Modal'
import "../../../styles/styles.scss"

const OrderModal = React.lazy(() => import('../../STDC local/OrderModal/OrderModal'))
const NewOrder = (props) => {
  const webSocket = useContext(WebSocketContext)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const sidebarRef = useRef(null);

  const handleClick = (action) => {
    setIsModalVisible(_ => action);
  };
  const handleClose = (data, receivers) => {
    // todo: send notif on new order to receivers
    setIsModalVisible(_ => false);
    const message = {
      message: "notification",
      receivers: receivers.map(receiver => ({ id: receiver, notif: "newOrder" })),
      data: undefined
    }
    webSocket.send(JSON.stringify(message))
    props.setOrders({ count: data[0].total_count, orders: data });
  };
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
      <div className="sidebar" ref={sidebarRef} 
      onMouseLeave={mouseOverHandlerSlideBack}>
        <div className="sidebar-button"
        onMouseOver={mouseOverHandlerSlide}
        
        ></div>
        <div className="sidebar2"></div>
      </div>
      {
        isModalVisible &&
        <Suspense fallback="">
          <Modal minimizable={true} style={{ width: "45rem", minHeight: "30rem", minWidth: "2rem", backgroundColor: "white" }} title="Yeni Sifariş" changeModalState={() => handleClick(false)} wrapperRef={props.wrapperRef}>
            {(props) => <OrderModal handleModalClose={handleClose} {...props} />}
          </Modal>
        </Suspense>
      }
    </>
  )
}
export default NewOrder