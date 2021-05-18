import "./styles.scss";

const Modal = ({ children, show, setShow,minimizeHandler,closeHandler }) => {
  return (
    <div className={show ? "modal" : "modal hidden"}
          style={{transform : show ? "translateY(0)" : "translateY(-100vh)"}}>
      <div className="modal-content border rounded">
          <div className="minimize-btn" onClick={minimizeHandler}>
            -
          </div>
          <div className="close-btn" onClick={closeHandler}>
            x
          </div>
          <div className="modal-container">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
