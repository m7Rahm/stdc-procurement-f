import React, { useState } from 'react'
import OrderModal from './OrderModal/OrderModal';
import Taskbar from './Taskbar/Taskbar';

const Home = () => {

    const [showModal, setShowModal] = useState(false);
    const [serviceType, setServiceType] = useState("")
    const [lastDate, setLastDate] = useState(new Date());
    const [selectedData, setSelectedData] = useState(null);
    const [receivers, setReceivers] = useState([{ 'id': 'asd', 'full_name': 'jkasda' }, { 'id': 'aaasd', 'full_name': 'asdasjkasda' }, { 'id': 'fsasd', 'full_name': 'jdsfdskasda' }]);
    const [modalList, setModalList] = useState(null)

    const openModal = () => {

        setShowModal(true)
        setModalList(prevState => {
            const newList = prevState === null ?
                { all: [], current: null }
                : { ...prevState, current: null }
            return newList;
        })

        setServiceType("")
        setLastDate(new Date())
        setSelectedData(null)
        // setReceivers()
    }

    const minimizeHandler = () => {

        setShowModal(false)

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

    const closeHandler = () => {

        setShowModal(false)

        if(modalList.current !== null){
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
        const properties = modalList.all.find(emp => emp.id === orderId)
        setModalList({ ...modalList, current: properties })
        setShowModal(true)
        setServiceType(properties.value[0])
        setLastDate(properties.value[1])
        setSelectedData(properties.value[2])
        setReceivers(properties.value[3])
    }

    return (
        <div>
            <OrderModal
                show={showModal}
                setShow={setShowModal}
                serviceType={serviceType}
                setServiceType={setServiceType}
                lastDate={lastDate}
                setLastDate={setLastDate}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                receivers={receivers}
                setReceivers={setReceivers}
                minimizeHandler={minimizeHandler}
                closeHandler={closeHandler}
            // modalId={modalList.current}
            // modalList={modalList}
            // setModalList={setModalList}
            />
            <div className="md-header full-center px-8 py-8 bg-light-gray" onClick={openModal}>
                Home
            </div>

            {/* create array of objects with all the properties
                in taskbar only save objects (not states)
                when selected change properties (here) to selected object's properties
                open order modal
             */}
            <Taskbar
                modalList={modalList}
                setModalList={setModalList}
                handleOrderSelect={handleOrderSelect}
            />
        </div>
    )
}

export default Home;