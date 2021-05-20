import React from 'react'
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import "./OrderModal.scss"

const FirstPage = React.forwardRef((props, ref) => {
    return (
        <>
            <div className="page-container" style={{ animationName: props.animName }} ref={ref}>
                <div style={{ justifyContent: "center" }} className="flex flex-js-c px-14 mb-10 cont1">
                    <div className="flex pr-10">
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
                            style={{ 'maxWidth': "150px" }}
                            value={props.lastDate}
                            onChange={props.handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </div>
                {/* <button
                className="btn btn-primary btn-modal bg-green py-4 mt-8"
                style={{'float':'right'}}
                type="button"
                onClick={()=>props.setWhichPage(2)}
                >
                Davam
                </button> */}
            </div>
        </>
    )
})

export default FirstPage
