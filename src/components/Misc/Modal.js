import React, { useEffect, useRef, useMemo } from 'react'
import { IoMdClose } from 'react-icons/io'
import { VscChromeMinimize } from "react-icons/vsc"

const modalContent = (Content) => ({ ...props }) =>
  <Content {...props} />

const Modal = React.forwardRef((props, ref) => {
  const { style, canBeClosed = true, number, title, changeModalState, minimizable, minimizeHandler } = props;
  const mousePositionRef = useRef({ x: null, y: null });
  const modalContentRef = useRef(null);
  const ModalContent = useMemo(() => modalContent(props.children), [props.children]);
  const stateRef = useRef({});
  const closeModal = () => {
    if (!stateRef.current.changed || canBeClosed)
      changeModalState()
  }
  useEffect(() => {
    const onEscPress = (e) => {
      if (e.keyCode === 27) {
        if (!stateRef.current.changed || canBeClosed)
          changeModalState()
      }
    }
    document.addEventListener('keyup', onEscPress, false);
    return () => document.removeEventListener('keyup', onEscPress, false)
  }, [changeModalState, canBeClosed]);
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
  const onOuterClickHandler = minimizeHandler ? minimizeHandler : closeModal
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 5, overflow: "auto" }}>
      <div className="modal" onClick={onOuterClickHandler}></div>
      <div ref={ref || modalContentRef} className='modal-content wrapper' style={style}>
        <div
          style={{ marginBottom: '20px' }}
          onMouseDown={handleDragStart}
        >
          {title || ""} {number}
          <IoMdClose className="modal-close-button" onClick={closeModal} size='18' style={{ verticalAlign: 'baseline', float: 'right', cursor: "default" }} />
          {
            minimizable &&
            <VscChromeMinimize className="modal-close-button" onClick={minimizeHandler} size='18' style={{ verticalAlign: 'baseline', float: 'right', cursor: "default" }} />
          }
        </div>

        <ModalContent
          closeModal={changeModalState}
          modalWrapperRef={ref || modalContentRef}
          current={number}
          stateRef={stateRef}
          {...props.childProps}
        />
      </div>


    </div>
  )
})
export default Modal