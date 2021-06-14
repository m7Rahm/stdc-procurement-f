import React, { useRef } from 'react'
import { IoIosClose } from 'react-icons/io'
const VisaForwardPerson = (props) => {
    const elem = useRef(null);
    const handleClick = (emp) => {
        if (props.draggable)
            props.handleDeselection(emp)
    }
    const onDragStart = props.draggable ? () => {
        setTimeout(() => { elem.current.style.opacity = "0" }, 1)
        props.draggedElement.current = { props: props, elem: elem }
    } : () => { }
    const onDragEnd = props.draggable ? (e) => {
        elem.current.style.opacity = "1"
    } : () => { }
    const onDragEnter = props.draggable ? (e) => {
        const parent = e.target.parentElement;
        const draggedElement = props.draggedElement.current.props.emp;
        if ((e.target.classList.contains("forwarded-person-card") || parent.classList.contains("forwarded-person-card")) && props.id !== draggedElement.id)
            props.setChoices(prev => {
                const draggedIndex = prev.receivers.findIndex(card => card.id === draggedElement.id);
                const elementsBeforeIndex = prev.receivers.slice(0, draggedIndex > props.index ? props.index : props.index + 1);
                const before = elementsBeforeIndex.filter(card => card.id !== draggedElement.id)
                const elementsAfterIndex = prev.receivers.slice(draggedIndex > props.index ? props.index : props.index + 1);
                const after = elementsAfterIndex.filter(card => card.id !== draggedElement.id)
                return { ...prev, receivers: [...before, draggedElement, ...after] }
            })
    } : () => { }
    return (
        <div
            ref={elem}
            className={`forwarded-person-card ${!props.draggable && "dp"}`}
            draggable={props.draggable}
            onDragEnter={onDragEnter}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            style={{
                left: "0px",
                backgroundColor: props.draggable ? "dodgerblue" : "rgb(253,200,86)"
            }}
        >
            {
                props.draggable &&
                <div className="cursor1" onClick={() => handleClick(props.emp)}>
                    <IoIosClose size="18" />
                </div>
            }
            <div style={{ cursor: "pointer" }}>
                {props.emp.full_name}
            </div>
        </div >
    )
}
export default VisaForwardPerson