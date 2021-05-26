import React, { useRef } from 'react'
import './UnfinishedModal.css'
import '../../../styles/Orders.css'
import {
    IoIosClose
} from 'react-icons/io'
import { IconContext } from 'react-icons/lib'
const UnfinishedModal = (props) => {
    const elem = useRef(null);

    const handleClick = (emp) => {
        props.handleSelectChange(emp);
    }

    const handleOrderClick = (orderId) =>{
        props.handleOrderSelect(orderId);
    }

    const onDragStart = () => {
        setTimeout(() => { elem.current.style.opacity = "0" }, 1)
        props.draggedElement.current = { props: props, elem: elem }
    }
    const onDragEnd = (e) => {
        elem.current.style.opacity = "1"
    }
    const onDragEnter = (e) => {
        const parent = e.target.parentElement;
        const draggedElement = props.draggedElement.current.props.emp;
        if ((e.target.classList.contains("forwarded-person-card") || parent.classList.contains("forwarded-person-card")) && props.id !== draggedElement.id)
            props.setReceivers(prev => {
                const draggedIndex = prev.findIndex(card => card.id === draggedElement.id);
                const elementsBeforeIndex = prev.slice(0, draggedIndex > props.index ? props.index : props.index + 1);
                const before = elementsBeforeIndex.filter(card => card.id !== draggedElement.id)
                const elementsAfterIndex = prev.slice(draggedIndex > props.index ? props.index : props.index + 1);
                const after = elementsAfterIndex.filter(card => card.id !== draggedElement.id)
                return [...before, draggedElement, ...after]
            })
    }
    
    function findWithAttr(array, attr, value) {
        for(var i = 0; i < array.length; i += 1) {
            if(array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }    

    return (
      
       <div className="order-card-wrapper">    
             <div onClick={() => handleClick(props.emp)} className="order-card-close-button">
                <IconContext.Provider value={{className:"close-button-card"}}>
                    <IoIosClose  size="18"  />
                </IconContext.Provider>
            </div>
           
        <div
            ref={elem}
            className="order-card"
            draggable="true"
            onDragEnter={onDragEnter}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            onClick={() => handleOrderClick(props.emp.id)}
           
            style={{
                left: "0px"
            }}
        >
           
           
            <div className="order-card-info-wrapper"
                style={{ display:'flex',flexDirection:'column'}}
            >
                <div className="order-card-info">{"Order "+(props.emp.name+1)}</div>
                <div  className="order-card-info">{props.emp.value[0]}</div>
                <div  className="order-card-info">{String(props.emp.value[1]).split('GMT')[0]}</div>
            </div>
             
        </div>
        </div>
    )
}
export default UnfinishedModal