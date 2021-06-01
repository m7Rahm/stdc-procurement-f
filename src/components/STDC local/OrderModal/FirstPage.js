import React from 'react'
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import "./OrderModal.scss"

const FirstPage = React.forwardRef((props, ref) => {

    const updateServiceType = (e) => {
        const value = e.target.value
        props.setChoices(prevState=>({...prevState ,serviceType:+value}))
    }

    return (
        <>
            <div className="page-container" style={{ animationName: props.animName }} ref={ref}>
                <div style={{ justifyContent: "center" }} className="flex flex-js-c px-14 mb-10 cont1">
                    <div className="flex pr-10">
                        <label className="checkbox-label">
                            <input
                                type="radio"
                                name="servis"
                                value={1}
                                checked={props.choices.serviceType === 1}
                                onChange={(e) => updateServiceType(e)}
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
                                value={0}
                                checked={props.choices.serviceType === 0}
                                onChange={(e) => updateServiceType(e)}
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
                            value={props.choices.lastDate}
                            onChange={props.handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </div>
            </div>
        </>
    )
})

export default FirstPage
