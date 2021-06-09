import React, { useState, useRef } from 'react'
import UnfinishedModal from "./UnfinishedModal.js"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

function Taskbar(props) {
    const [fachevron, setFachevron] = useState(false)
    const sidebarRef = useRef(null);
    const handleSelectChange = (employee) => {
        props.setModalList(prevState => {
            const res = prevState.all.find(emp => emp.id === employee.id);
            props.setIsModalVisible(0.5)
            const newModals = !res ?
                { all: [...prevState.all, employee], current: employee }
                : { all: prevState.all.filter(emp => emp.id !== employee.id), current: null };
            return newModals;
        });
    }
    const mouseOverHandlerSlide = (e) => {
        setFachevron(prev => !prev)
    };
    return (
        <div className="sidebar-button-wrap" ref={sidebarRef} onMouseOver={mouseOverHandlerSlide}
            onMouseLeave={mouseOverHandlerSlide}>
            <div>
                <div className="sidebar-button">
                    {fachevron === false ?
                        <FaChevronLeft className="greater-than-icon" />
                        :
                        <FaChevronRight className="greater-than-icon" />
                    }
                </div>
            </div>
            <div className="sidebar2">
                <div>
                    <div>
                        {
                            props.modalList !== null &&
                            props.modalList.all.map((modal, index) =>
                                <UnfinishedModal
                                    key={modal.id}
                                    id={modal.id}
                                    emp={modal}
                                    index={index}
                                    setReceivers={props.setModalList}
                                    handleSelectChange={handleSelectChange}
                                    handleOrderSelect={props.handleOrderSelect}
                                />
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Taskbar