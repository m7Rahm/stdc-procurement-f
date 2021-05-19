import React, {useState,useRef} from 'react'
import Modal from '../../../components/Modal/Modal'
import './style.scss';
import ProductTable from './ProductTable/ProductTable'
import ForwardDocAdvanced from '../../../ForwardDocLayout/ForwardDocAdvanced.js'
import FirstPage from './FirstPage/FirstPage'


const OrderModal = (props) => {  

    const [whichPage,setWhichPage] = useState(1);
    
    const handleDateChange = (date) => {
        props.setLastDate(date);
    }

    const handleSendClick = () => {
        console.log("Send Clicked");
    }

    const backClickHandler = () => {
        setWhichPage(prevState=>prevState-1)
        
    }

    const forwardClickHandler = () => {
        setWhichPage(prevState=>prevState+1);
    }

    console.log(whichPage)
    const actPageRef = useRef(null);

    let page = null;

    whichPage === 1?

            page = (
                <FirstPage 
                    ref={actPageRef}
                    setWhichPage={setWhichPage}
                    handleDateChange={handleDateChange}
                    setServiceType={props.setServiceType}
                    serviceType={props.serviceType}
                    setLastDate={props.setLastDate}
                    handleDateChange={props.setHandleChange}
                />
            )
        :   whichPage === 2 ?
            page = (
                <div ref={actPageRef}>
                    <h1 className="md-header">Sifariş</h1>
                    <form className="mt-10">

                        {/*get back selected data*/}
                        <ProductTable 
                        setSelectedData={props.setSelectedData}
                        setWhichPage={setWhichPage}
                        />
                    </form>
                </div>
            )
        :   whichPage === 3?

            page = (
                <div ref={actPageRef}>
                    <h1 className="md-header">Sifariş</h1>
                    <form className="mt-10">
                        <ForwardDocAdvanced 
                            handleSendClick = {handleSendClick}
                            receivers={props.receivers}
                            setReceivers={props.setReceivers}
                            />
                    </form>
                </div>
            )
        :

        page = <div></div>
    

    return (
        <Modal show={props.show} setShow={props.setShow}
                minimizeHandler={props.minimizeHandler}
                closeHandler={props.closeHandler}
        >
            {page}
            <div className="flex gap-3 "
                            style={{'float':'right'}}>
                            <button
                            className="btn btn-primary btn-modal bg-red py-4 mt-8"
                            style={{'width':'150px'}}
                            type="button"
                            onClick={backClickHandler}
                            >
                            Geri
                            </button>

                            <button
                            className="btn btn-primary btn-modal bg-green py-4 mt-8"
                            style={{'float':'right','width':'150px'}}
                            type="button"
                            onClick={forwardClickHandler}
                            >
                            Davam
                            </button>
            </div>
        </Modal>
    )
}

export default OrderModal;
