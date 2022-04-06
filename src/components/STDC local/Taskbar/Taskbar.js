import React, { useContext, useRef } from 'react'
import UnfinishedModal from "./UnfinishedModal.js"
import { FaChevronLeft } from "react-icons/fa"
import { colors } from '../../../data/data.js';
import { ThemeContext } from '../../../App.js';

function Taskbar(props) {
    const sidebarRef = useRef(null);
    const theme = useContext(ThemeContext)[0]
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
            <div className="sidebar2" style={{ background: colors[theme].navbar }}>
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