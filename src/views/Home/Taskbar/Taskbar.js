import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'
import './style.scss'
import UnfinishedModal from "./UnfinishedModal.js"


function Taskbar(props) {

    const handleSelectChange = (employee) => {
        const res = props.modalList.find(emp => emp.id === employee.id);
        const newModals = !res ? [...props.modalList, employee] : props.modalList.filter(emp => emp.id !== employee.id);
        props.setModalList(newModals);
    }


    return (
        <div className="taskbar">
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

    return (
        <div style={{ padding: '0px 20px', borderRadius: '5px' }}>
            <div style={{ marginTop: '20px', overflow: 'hidden', padding: '15px', border: '1px solid gray', borderRadius: '3px'}}>
                {
                    props.modalList != NaN ?
                    props.modalList.map((modal, index) => 
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
                    :
                    <div></div>
                }
            </div>
        </div>
    )
}