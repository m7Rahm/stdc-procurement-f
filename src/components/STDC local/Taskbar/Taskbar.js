import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'
import UnfinishedModal from "./UnfinishedModal.js"


function Taskbar(props) {

    const handleSelectChange = (employee) => {
        props.setModalList(prevState => {
            const res = prevState.all.find(emp => emp.id === employee.id);
            const newModals = !res ?
                { all: [...prevState.all, employee], current: employee }
                : { all: prevState.all.filter(emp => emp.id !== employee.id), current: null };
            return newModals;
        });
    }

    return (
        <div> {/*className="taskbar"*/}
            <ModalArray
                modalList={props.modalList}
                setModalList={props.setModalList}
                handleSelectChange={handleSelectChange}
                handleOrderSelect={props.handleOrderSelect}
            />
        </div>
    )
}

export default Taskbar

export const ModalArray = (props) => {
    const draggedElement = useRef(null);
    // console.log(props.modalList)

    return (
        <div >
                {
                    props.modalList !== null &&
                        props.modalList.all.map((modal, index) =>
                            <UnfinishedModal
                                key={modal.id}
                                id={modal.id}
                                emp={modal}
                                index={index}
                                draggedElement={draggedElement}
                                setReceivers={props.setModalList}
                                handleSelectChange={props.handleSelectChange}
                                handleOrderSelect={props.handleOrderSelect}
                            />
                        )
                                        }
        </div>
    )
}