import React, { useRef } from 'react'
import { IoMdClose } from 'react-icons/io'
import { VscChromeMinimize } from "react-icons/vsc"

const ModalAdvanced = React.forwardRef((props, ref) => {
    const mousePositionRef = useRef({ x: null, y: null });
    const modalContentRef = useRef(null);
    const handleDragStart = (e) => {
        if (props.activeModalRef.current)
            props.activeModalRef.current.style.zIndex = "2";
        mousePositionRef.current = { x: e.clientX, y: e.clientY };
        // const elem = ref ? ref.current : modalContentRef.current;
        // props.activeModalRef.current = elem;
        props.activeModalRef.current = modalContentRef.current;
        props.activeModalRef.current.style.zIndex = "3";
        e.preventDefault();
        document.onmouseup = endDrag
        document.onmousemove = handleDragModal;
    }
    const handleDragModal = (e) => {
        e.preventDefault();
        const elem = props.activeModalRef.current;
        // console.log(props.activeModalRef)
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
    const handleClick = (e) => {
        // console.log("capture")
        // const elem = ref ? ref.current : modalContentRef.current;
        // if (props.activeModalRef.current)
        if (props.activeModalRef.current)
            props.activeModalRef.current.style.zIndex = "2";
        // props.activeModalRef.current = elem;
        props.activeModalRef.current = e.currentTarget;
        props.activeModalRef.current.style.zIndex = "3";
    }
    return (
        <div ref={(elem) => {
            modalContentRef.current = elem;
            props.activeModalRef.current = elem
        }} onClick={handleClick} className={props.show !== 0.5 ? "modalWrapper" : "modalWrapper hidden"} style={props.style}>
            <div className="modalTitle"
                onMouseDown={handleDragStart}
            >
                <div style={{ float: 'left', paddingLeft: '15px', paddingTop: '10px', fontWeight: 'bold' }} >Təklif</div>
                <IoMdClose className="modal-close-button" onClick={() => props.changeModalState(props.modalid)} size='28' style={{ paddingTop: '10px', verticalAlign: 'baseline', float: 'right', cursor: "default" }} />
                <VscChromeMinimize className="modal-close-button" onClick={() => props.minimizeHandler(props.modalid)} size='28' style={{ paddingTop: '10px', verticalAlign: 'baseline', float: 'right', cursor: "default" }} />
            </div>
            <div className="priceModal">
                <div className="modal-container" >{props.children}</div>
            </div>
        </div>
    );
});

export default ModalAdvanced;
