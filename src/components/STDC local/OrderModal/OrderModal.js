import React, { useState, useRef } from "react";
import "./OrderModal.scss";
import ForwardDocLayout from "../ForwardDocLayout/ForwardDocLayout";
import FirstPage from "./FirstPage";
import NewOrderContent from "../../modal content/NewOrder"
const OrderModal = (props) => {
  const [whichPage, setWhichPage] = useState({ page: 1, animationName: "a" });
  const actPageRef = useRef(null);

  const davamText = whichPage.page === 3 ? "Sifariş et" : "Davam";

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
      setWhichPage((prevState) => {
        props.modalWrapperRef.current.style.width = prevState.page === 3 ? "60rem" : "40rem";
        return prevState.page > 1 ? {
          page: prevState.page - 1,
          animationName: "slide_geri_next",
        } : prevState;
      });
    };
    actPageRef.current.addEventListener(
      "animationend",
      animationendEventListener,
      false
    );
  };

  const forwardClickHandler = () => {
    actPageRef.current.style.animationName = "slide_davam_current";
    const animationendEventListener = () => {
      actPageRef.current.removeEventListener(
        "animationend",
        animationendEventListener,
        false
      );
      setWhichPage(prevState => {
        props.modalWrapperRef.current.style.width = prevState.page === 1 ? "60rem" : "40rem";
        return prevState.page < 3 ? {
          page: prevState.page + 1,
          animationName: "slide_davam_next",
        } : prevState;
      });
    }
    actPageRef.current.addEventListener(
      "animationend",
      animationendEventListener,
      false
    );
  };

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
    <>
      {whichPage.page === 1 ? (
        <FirstPage
          ref={actPageRef}
          setWhichPage={setWhichPage}
          handleDateChange={handleDateChange}
          setServiceType={props.setServiceType}
          serviceType={props.serviceType}
          setLastDate={props.setLastDate}
          animName={whichPage.animationName}
          setHandleDateChange={props.setHandleChange}
        />
      ) : whichPage.page === 2 ? (
        <div
          className="page-container"
          style={{ animationName: whichPage.animationName }}
          ref={actPageRef}
        >
          <NewOrderContent />
        </div>
      ) : whichPage.page === 3 ? (
        <div className="page-container" ref={actPageRef}>
          <ForwardDocLayout
            handleSendClick={handleSendClick}
            receivers={props.receivers}
            textareaVisible={false}
            setReceivers={props.setReceivers}
          />
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
    </>
  );
};

export default OrderModal;
