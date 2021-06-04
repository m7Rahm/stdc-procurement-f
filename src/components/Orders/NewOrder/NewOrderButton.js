import React, { useState, useRef } from 'react'
import { Suspense } from 'react'
import { MdAdd } from 'react-icons/md'
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import Modal from '../../Misc/Modal'
import "../../../styles/styles.scss"
import Taskbar from '../../STDC local/Taskbar/Taskbar'

const OrderModal = React.lazy(() => import('../../STDC local/OrderModal/OrderModal'))
const NewOrder = (props) => {
  const sidebarRef = useRef(null);
  const modalRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(0);
  const [modalList, setModalList] = useState(null)
  const [choices, setChoices] = useState({
    serviceType: 0, lastDate: new Date(),
    materials: [{
      id: Date.now(),
      materialName: '',
      materialId: '',
      code: '',
      additionalInfo: '',
      class: '',
      count: 1,
      isService: 0,
      place: "",
      unit: '1'
    }],
    receivers: []
  })
  const [fachevron, setFachevron] = useState(false)

  const handleClick = () => {
    setIsModalVisible(true);
    setModalList(prevState => {
      const newList = prevState === null ?
        { all: [], current: null }
        : { ...prevState, current: null }
      return newList;
    })
    if (modalRef.current) {
      modalRef.current.style.animation = "none";
      void modalRef.current.offsetHeight; /* trigger reflow */
      modalRef.current.style.animation = null;
    }
    setChoices({
      serviceType: 0, lastDate: new Date(),
      materials: [{
        id: Date.now(),
        materialName: '',
        materialId: '',
        code: '',
        additionalInfo: '',
        class: '',
        count: 1,
        isService: 0,
        place: "",
        unit: '1'
      }],
      receivers: []
    })
  }

  const handleCloseModal = () => {
    setIsModalVisible(0);
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

  console.log(choices.receivers)

  const handleOrderSelect = (orderId) => {
    const properties = modalList.all.find(emp => emp.id === orderId)
    setIsModalVisible(1);
    setModalList(prevState => ({ ...prevState, current: properties }))
    setChoices({ serviceType: properties.value[0], lastDate: properties.value[1], materials: properties.value[2], receivers: properties.value[3], id: properties.id })
  }

  const minimizeHandler = () => {
    setModalList(prev => {
      if (prev.all.length === 0) {
        const current = { 'id': Date.now(), 'value': [choices.serviceType, choices.lastDate, choices.materials, choices.receivers], name: 0 }
        return { all: [current], current: current }
      } else if (modalList.current === null || !modalList.all.find(modal => modal.id === modalList.current.id)) {
        const current = { 'id': Date.now(), 'value': [choices.serviceType, choices.lastDate, choices.materials, choices.receivers], name: prev.all[prev.all.length - 1].name + 1 }
        return { all: [...prev.all, current], current: current }
      } else {
        return {
          all: prev.all.map(order =>
            order.id === modalList.current.id ?
              { ...order, 'value': [choices.serviceType, choices.lastDate, choices.materials, choices.receivers] }
              : order
          ), current: null
        }
      }
    })
    setIsModalVisible(0.5);
  }
  const mouseOverHandlerSlide = (e) => {
    setFachevron(prev => !prev)
  };

  return (
    <>
      <div title="yeni sifariş" className="new-order-button" onClick={handleClick}>
        <MdAdd color="white" size="30" />
      </div>
      <div className="sidebar-button-wrap" ref={sidebarRef} onMouseOver={mouseOverHandlerSlide}
        onMouseLeave={mouseOverHandlerSlide}>
        <div>
          <div className="sidebar-button">
            {fachevron === false ?
              <FaChevronLeft className="greater-than-icon" />
              :
              <FaChevronRight className="greater-than-icon" />
            }
          </div>
        </div>
        <div className="sidebar2">
          <Taskbar
            style={{ overflow: 'scroll' }}
            modalList={modalList}
            setModalList={setModalList}
            choices={choices}
            handleOrderSelect={handleOrderSelect}
            setIsModalVisible={setIsModalVisible}
          />
        </div>
      </div>
      {
        isModalVisible !== 0 &&
        <div style={{ visibility: isModalVisible === 0.5 ? "hidden" : "" }}>
          <Suspense fallback="">
            <Modal
              minimizable={true} style={{ width: "45rem", minHeight: "30rem", minWidth: "2rem", backgroundColor: "white" }}
              title={modalList.current !== null ? "Sifariş " + (modalList.current.name + 1) : "Yeni Sifariş"}
              ref={modalRef}
              childProps={{ choices: choices, setChoices: setChoices, setIsModalVisible: handleCloseModal, setOrders: props.setOrders, modalList: modalList }}
              minimizeHandler={minimizeHandler}
              changeModalState={handleCloseModal}
              wrapperRef={props.wrapperRef}
            >
              {OrderModal}
            </Modal>
          </Suspense>
        </div>
      }
    </>
  )
}
export default NewOrder