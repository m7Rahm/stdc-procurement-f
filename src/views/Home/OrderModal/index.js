import React, {useState} from 'react'
import Modal from '../../../components/Modal'
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import './style.scss';
import ProductTable from './ProductTable'
import ForwardDocAdvanced from '../../../ForwardDocLayout/ForwardDocAdvanced.js'


const OrderModal = (props) => {  

    const [whichPage,setWhichPage] = useState(1);
    
    const handleDateChange = (date) => {
        props.setLastDate(date);
    }

    const handleSendClick = () => {
        console.log("Send Clicked");
    }

    let page = null;

    switch (whichPage) {
        case 1:

            page = (
                <div>
                    <h1 className="md-header">Sifariş</h1>
                    <form className="mt-10">

                        <div className="flex flex-js-c px-14 mb-10">
                            <div className="flex pr-10 ">
                            <label className="checkbox-label">
                                <input
                                type="radio"
                                name="servis"
                                value="xidmet"
                                checked={props.serviceType === "xidmet"}
                                onChange={(e) => props.setServiceType(e.target.value)}
                                />
                                <span className="custom-checkbox"></span>
                            </label>
                            <p className=" ml-4 text-md">Xidmət</p>
                            </div>

                            <div className="flex pl-10">
                            <label className="checkbox-label">
                                <input
                                type="radio"
                                name="servis"
                                value="mal-material"
                                checked={props.serviceType === "mal-material"}
                                onChange={(e) => props.setServiceType(e.target.value)}
                                />
                                <span className="custom-checkbox"></span>
                            </label>
                            <p className=" ml-4 text-md">Mal-material</p>
                            </div>
                        </div>


                        <div className="form-group">
                            <label htmlFor="" className="form-label mb-2 text-md">
                                Son Tarix
                            </label>

                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    style={{'maxWidth':"150px"}}
                                    value={props.lastDate}
                                    onChange={handleDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </div>


                        <button
                        className="btn btn-primary btn-modal bg-green py-4 mt-8"
                        style={{'float':'right'}}
                        type="button"
                        onClick={()=>setWhichPage(2)}
                        >
                        Davam
                        </button>
                    </form>
                </div>
            )
            
            break;

        case 2:

            page = (
                <div>
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
            break;

        case 3:

            page = (
                <div>
                    <h1 className="md-header">Sifariş</h1>
                    <form className="mt-10">
                        <ForwardDocAdvanced 
                            handleSendClick = {handleSendClick}
                            receivers={props.receivers}
                            setReceivers={props.setReceivers}
                            />

                        <div className="flex gap-3 "
                            style={{'float':'right'}}>
                            <button
                            className="btn btn-primary btn-modal bg-red py-4 mt-8"
                            style={{'width':'150px'}}
                            type="button"
                            onClick={()=>setWhichPage(2)}
                            >
                            Geri
                            </button>

                            <button
                            className="btn btn-primary btn-modal bg-green py-4 mt-8"
                            style={{'float':'right','width':'150px'}}
                            type="button"
                            // onClick={()=>setWhichPage(4)}
                            >
                            Sifariş et
                            </button>
                        </div>
                    </form>
                </div>
            )

            break;
    
        default:
            break;
    }

    return (
        <Modal show={props.show} setShow={props.setShow}
                minimizeHandler={props.minimizeHandler}
                closeHandler={props.closeHandler}
        >
            {page}
        </Modal>
    )
}

export default OrderModal;
