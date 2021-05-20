import React, { useState, useRef } from "react";
import Modal from "../../../components/Modal/Modal";
import "./OrderModal.scss";
import ForwardDocAdvanced from "../../../ForwardDocLayout/ForwardDocAdvanced.js";
import FirstPage from "./FirstPage";

const OrderModal = (props) => {
  const [whichPage, setWhichPage] = useState({ page: 1, animationName: "a" });
  const actPageRef = useRef(null);

  let davamText = "Davam";
  whichPage.page === 3 ? (davamText = "Sifariş et") : (davamText = "Davam");

  const handleDateChange = (date) => {
    props.setLastDate(date);
  };

  const handleSendClick = () => {
    console.log("Send Clicked");
  };
  const backClickHandler = (e) => {
    actPageRef.current.style.animationName = "slide_geri_current";
    const animationendEventListener = () => {
      actPageRef.current.removeEventListener(
        "animationend",
        animationendEventListener,
        false
      );
      setWhichPage((prevState) => ({
        page: prevState.page - 1,
        animationName: "slide_geri_next",
      }));
    };
    actPageRef.current.addEventListener(
      "animationend",
      animationendEventListener,
      false
    );
  };

  const forwardClickHandler = () => {
    if (davamText === "Davam") {
      actPageRef.current.style.animationName = "slide_davam_current";
      const animationendEventListener = () => {
        actPageRef.current.removeEventListener(
          "animationend",
          animationendEventListener,
          false
        );
        setWhichPage((prevState) => ({
          page: prevState.page + 1,
          animationName: "slide_davam_next",
        }));
      };
      actPageRef.current.addEventListener(
        "animationend",
        animationendEventListener,
        false
      );
    }
  };
  // if (actPageRef.current)
  //     console.log(actPageRef.current.style.animationName)

  const mouseDownHandlerGeri = (e) => {
    const target = e.target;
    target.style.backgroundColor = "#9c2929";
  };
  const mouseUpHandlerGeri = (e) => {
    const target = e.target;
    target.style.backgroundColor = "#d84343";
  };
  const mouseOverHandlerGeri = (e) => {
    const target = e.target;
    target.style.backgroundColor = "#d84343";
  };
  const mouseLeaveHandlerGeri = (e) => {
    const target = e.target;
    target.style.backgroundColor = "#eb5757";
  };

  const mouseDownHandlerDavam = (e) => {
    const target = e.target;
    target.style.backgroundColor = "#114928";
  };
  const mouseUpHandlerDavam = (e) => {
    const target = e.target;
    target.style.backgroundColor = "#187940";
  };
  const mouseOverHandlerDavam = (e) => {
    const target = e.target;
    target.style.backgroundColor = "#187940";
  };
  const mouseLeaveHandlerDavam = (e) => {
    const target = e.target;
    target.style.backgroundColor = "#27ae60";
  };

  return (
    <Modal
      show={props.show}
      setShow={props.setShow}
      minimizeHandler={props.minimizeHandler}
      closeHandler={props.closeHandler}
    >
      <h1 className="md-header">Sifariş</h1>
      {whichPage.page === 1 ? (
        <FirstPage
          ref={actPageRef}
          setWhichPage={setWhichPage}
          handleDateChange={handleDateChange}
          setServiceType={props.setServiceType}
          serviceType={props.serviceType}
          setLastDate={props.setLastDate}
          animName={whichPage.animationName}
          handleDateChange={props.setHandleChange}
        />
      ) : whichPage.page === 2 ? (
        <div
          className="page-container"
          style={{ animationName: whichPage.animationName }}
          ref={actPageRef}
        >
          <form>
            {/*get back selected data*/}
            {/* <ProductTable
                                setSelectedData={props.setSelectedData}
                            /> */}
          </form>
        </div>
      ) : whichPage.page === 3 ? (
        <div className="page-container" ref={actPageRef}>
          <form>
            <ForwardDocAdvanced
              handleSendClick={handleSendClick}
              receivers={props.receivers}
              setReceivers={props.setReceivers}
            />
          </form>
        </div>
      ) : (
        <div></div>
      )}
      <div className="flex gap-3 " style={{ float: "right" }}>
        <button
          className="btn btn-primary btn-modal bg-red py-4 mt-8"
          style={{
            width: "150px",
            display: whichPage.page === 1 ? "none" : "block",
          }}
          type="button"
          onClick={backClickHandler}
          onMouseDown={mouseDownHandlerGeri}
          onMouseUp={mouseUpHandlerGeri}
          onMouseOver={mouseOverHandlerGeri}
          onMouseLeave={mouseLeaveHandlerGeri}
        >
          Geri
        </button>

        <button
          className="btn btn-primary btn-modal bg-green py-4 mt-8"
          style={{ float: "right", width: "150px" }}
          type="button"
          onClick={forwardClickHandler}
          onMouseDown={mouseDownHandlerDavam}
          onMouseUp={mouseUpHandlerDavam}
          onMouseOver={mouseOverHandlerDavam}
          onMouseLeave={mouseLeaveHandlerDavam}
        >
          {davamText}
        </button>
      </div>
    </Modal>
  );
};

export default OrderModal;
