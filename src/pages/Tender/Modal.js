import '../../styles/Orders.css'
import React, { useRef } from 'react'
import { IoMdClose } from 'react-icons/io'
import { VscChromeMinimize } from "react-icons/vsc"

const Modal = React.forwardRef((props, ref) => {

    const mousePositionRef = useRef({ x: null, y: null });
    const modalContentRef = useRef(null);

    const handleDragStart = (e) => {
        mousePositionRef.current = { x: e.clientX, y: e.clientY };
        e.preventDefault();
        document.onmouseup = endDrag
        document.onmousemove = handleDragModal;
    }
    const handleDragModal = (e) => {
        e.preventDefault();
        const elem = ref ? ref.current : modalContentRef.current
        elem.style.top = `${elem.offsetTop - mousePositionRef.current.y + e.clientY}px`
        elem.style.left = `${elem.offsetLeft - mousePositionRef.current.x + e.clientX}px`
        mousePositionRef.current.x = e.clientX;
        mousePositionRef.current.y = e.clientY;
    }
    const endDrag = (e) => {
        e.preventDefault();
        document.onmousemove = null;
        document.onmouseup = null;
    }

    return (
        <div ref={ref} className={props.show !== 0.5 ? "modalWrapper" : "modalWrapper hidden"} style={props.style}>
            <div className="modalTitle"
                onMouseDown={handleDragStart}
            >
                <div style={{ float: 'left', paddingLeft: '15px', paddingTop: '5px', fontWeight: 'bold' }} >Təklif</div>
                <IoMdClose className="modal-close-button" onClick={props.changeModalState} size='18' style={{ verticalAlign: 'baseline', float: 'right', cursor: "default" }} />
                <VscChromeMinimize className="modal-close-button" onClick={props.minimizeHandler} size='18' style={{ verticalAlign: 'baseline', float: 'right', cursor: "default" }} />

            </div>

            <div className={"priceModal"}>
                <div className="modal-container" >{props.children}</div>
            </div>
        </div>
    );
});

export default Modal;
