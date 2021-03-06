import React, { useState, useRef, useContext } from 'react'
import { Suspense } from 'react'
import { MdAdd } from 'react-icons/md'
import Modal from '../../Misc/Modal'
import "../../../styles/styles.scss"
import Taskbar from '../../STDC local/Taskbar/Taskbar'
import OperationStateLite from '../../Misc/OperationStateLite'
import { colors } from '../../../data/data'
import { ThemeContext } from '../../../App'

const OrderModal = React.lazy(() => import('../../STDC local/OrderModal/OrderModal'))
const NewOrder = (props) => {
  const modalRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(0);
  const [modalList, setModalList] = useState(null);
  const [sending, setSending] = useState(undefined);
  const theme = useContext(ThemeContext)[0]
  const [choices, setChoices] = useState({
    serviceType: 0, lastDate: new Date(),
    materials: [{
      id: Date.now(),
      materialName: '',
      materialId: null,
      additionalInfo: '',
      class: '',
      count: 1,
      isService: 0,
      place: "",
      unit: '1'
    }],
    receivers: []
  })

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
        unit: '1',
        tesvir: ""
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

  const handleOrderSelect = (orderId) => {
    const properties = modalList.all.find(order => order.id === orderId)
    setIsModalVisible(1);
    setModalList(prevState => ({ ...prevState, current: properties }))
    setChoices({ serviceType: properties.value[0], lastDate: properties.value[1], materials: properties.value[2], receivers: properties.value[3], id: properties.id })
  }

  const minimizeHandler = () => {
    modalRef.current.style.width = "40rem";
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
  return (
    <>
      <Taskbar
        modalList={modalList}
        setModalList={setModalList}
        choices={choices}
        handleOrderSelect={handleOrderSelect}
        setIsModalVisible={setIsModalVisible}
      />
      <div title="yeni sifari??" style={{ background: colors[theme].secondary }} className="new-order-button" onClick={handleClick}>
        <MdAdd color="white" size="30" />
      </div>
      {sending !== undefined && <OperationStateLite state={sending} setState={setSending} text="Sifari?? g??nd??rilir.." />}
      {
        isModalVisible !== 0 &&
        <div style={{ display: isModalVisible === 0.5 ? "none" : "" }}>
          <Suspense fallback="">
            <Modal
              minimizable={true} style={{ width: "45rem", minHeight: "30rem", minWidth: "2rem", backgroundColor: "white" }}
              title={modalList.current !== null ? "Sifari?? " + (modalList.current.name + 1) : "Yeni Sifari??"}
              ref={modalRef}
              childProps={{
                choices: choices,
                setChoices: setChoices,
                setIsModalVisible: handleCloseModal,
                setOrders: props.setOrders,
                modalList: modalList,
                setSending,
                canSeeOtherOrders: props.canSeeOtherOrders
              }}
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