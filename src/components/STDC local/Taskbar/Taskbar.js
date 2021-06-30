import React, { useRef } from 'react'
import UnfinishedModal from "./UnfinishedModal.js"
import { FaChevronLeft } from "react-icons/fa"

function Taskbar(props) {
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
    return (
        <div className="sidebar-button-wrap" ref={sidebarRef}>
            <div>
                <div className="sidebar-button">
                    <FaChevronLeft className="greater-than-icon" />
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