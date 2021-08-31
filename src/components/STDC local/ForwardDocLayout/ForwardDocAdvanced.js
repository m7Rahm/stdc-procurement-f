import React, { useRef, } from 'react'
import VisaForwardPerson from './VisaForwardPerson'
import "./ForwardDocAdvanced.css"
export const ForwardedPeople = (props) => {
    const draggedElement = useRef(null);
    return (
        <div style={{ padding: '0px 20px', borderRadius: '5px', float: "left" }}>
            <div className="forwarded-people-container">
                {
                    props.receivers.map((emp, index) =>
                        <VisaForwardPerson
                            key={emp.id}
                            id={emp.id}
                            emp={emp}
                            index={index}
                            draggable={!emp.dp}
                            handleElementDrag={props.handleElementDrag}
                            draggedElement={draggedElement}
                            handleDeselection={props.handleDeselection}
                        />
                    )
                }
            </div>
        </div>
    )
}