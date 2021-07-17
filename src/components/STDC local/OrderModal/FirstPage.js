import React from 'react'
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import "./OrderModal.scss"

const FirstPage = (props) => {
    // props.choices.serviceType === 0
    const updateServiceType = (val) => {
        props.setChoices(prevState => ({ ...prevState, serviceType: val }))
    }
    return (
        <>
            <div className="first-page-container">
                <div>
                    <div>
                        <span style={{ backgroundColor: props.choices.serviceType === 1 ? "green" : "" }} className="custom-checkbox" onClick={() => updateServiceType(1)} />
                        <span style={{ backgroundColor: props.choices.serviceType === 0 ? "green" : "" }} className="custom-checkbox" onClick={() => updateServiceType(0)} />
                    </div>
                    <div>
                        <label className="checkbox-label"> Xidmət</label>
                        <label className="checkbox-label">Mal-material</label>
                    </div>
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
        </>
    )
}

export default FirstPage
