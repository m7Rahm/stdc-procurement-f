import React, { useEffect, useRef, useMemo } from 'react'
import { IoMdClose } from 'react-icons/io'
import { VscChromeMinimize } from "react-icons/vsc"

const modalContent = (Content) => ({ ...props }) =>
  <Content {...props} />

const Modal = React.forwardRef((props, ref) => {
  const { style, canBeClosed = true, number, title, changeModalState, minimizable, minimizeHandler } = props;
  // eslint-disable-next-line
  const modalWrapperRef = useRef(null)
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
  const onOuterClickHandler = minimizeHandler ? minimizeHandler : closeModal
  return (
    <>
      <div className="modal" onClick={onOuterClickHandler}></div>
      <div ref={ref} className='modal-content wrapper' style={style}>
        <div style={{ marginBottom: '20px' }}>
          {title || ""} {number}
          <IoMdClose className="modal-close-button" onClick={closeModal} size='18' style={{ verticalAlign: 'baseline', float: 'right' }} />
          {
            minimizable &&
            <VscChromeMinimize className="modal-close-button" onClick={minimizeHandler} size='18' style={{ verticalAlign: 'baseline', float: 'right' }} />
          }
        </div>
        <ModalContent
          closeModal={changeModalState}
          modalWrapperRef={ref}
          current={number}
          stateRef={stateRef}
          {...props.childProps}
        />
      </div>
    </>
  )
})
export default Modal