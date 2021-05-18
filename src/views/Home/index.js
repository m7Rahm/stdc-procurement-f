import React, {useState} from 'react'
import OrderModal from './OrderModal';
import Taskbar from './Taskbar';

const Home = () => {

    const [showModal, setShowModal] = useState(false);

    const [serviceType, setServiceType] = useState("")
    const [lastDate, setLastDate] = useState(new Date());
    const [selectedData, setSelectedData] = useState(null);
    const [receivers, setReceivers] = useState([{'id':'asd','full_name':'jkasda'},{'id':'aaasd','full_name':'asdasjkasda'},{'id':'fsasd','full_name':'jdsfdskasda'}]);
    const [modalList, setModalList] = useState([])

    const minimizeHandler = () => {
        const newList = [...modalList]
        const lastIndex = newList.length==0 ?  0 : newList[newList.length-1].id + 1
        newList.push({'id': lastIndex,'value':[serviceType,lastDate,selectedData,receivers]})
        setModalList(newList)
        setShowModal(false)
    }

    const handleOrderSelect = (orderId) => {
        const properties = modalList.find(emp => emp.id === orderId)
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
            />
            <div className="md-header full-center px-8 py-8 bg-light-gray" onClick={() => setShowModal(true)}>
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