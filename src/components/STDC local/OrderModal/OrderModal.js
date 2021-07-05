import React, { useContext, useState, useRef, useEffect } from "react";
import "./OrderModal.scss";
import ForwardDocLayout from "../ForwardDocLayout/ForwardDocLayout";
import FirstPage from "./FirstPage";
import NewOrderContent from "../../modal content/NewOrder"
import useFetch from "../../../hooks/useFetch"
import { WebSocketContext } from '../../../pages/SelectModule'

const OrderModal = (props) => {
  const [whichPage, setWhichPage] = useState({ page: 1, animationName: "a" });
  const actPageRef = useRef(null);
  const fetchPost = useFetch("POST");
  const davamText = whichPage.page === 3 ? "Sifariş et" : "Davam";
  const [operationResult, setOperationResult] = useState({ visible: false, desc: 'Sifarişə məhsul əlavə edin' })
  const handleDateChange = (date) => {
    props.setChoices({ ...props.choices, lastDate: date });
  };
  const webSocket = useContext(WebSocketContext)

  const backClickHandler = (e) => {
    actPageRef.current.style.animationName = "slide_geri_current";
    const animationendEventListener = () => {
      actPageRef.current.removeEventListener(
        "animationend",
        animationendEventListener,
        false
      );
      setWhichPage((prevState) => {
        props.modalWrapperRef.current.style.width = prevState.page === 3 ? "90%" : "40rem";
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
  const id = props.modalList.current ? props.modalList.current.id : undefined
  useEffect(() => {
    setWhichPage({ page: 1 })
  }, [id])

  const forwardClickHandler = () => {
    if (davamText === "Davam") {
      const continueNext = () => {
        actPageRef.current.style.animationName = "slide_davam_current";
        const animationendEventListener = () => {
          actPageRef.current.removeEventListener(
            "animationend",
            animationendEventListener,
            false
          );
          setWhichPage(prevState => {
            props.modalWrapperRef.current.style.width = prevState.page === 1 ? "90%" : "40rem";
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
      }
      if (whichPage.page === 2) {
        let errorMessage = "";
        let details = ""
        const unAssignedMaterials = props.choices.materials.filter(material => !material.place);
        if (props.choices.materials.length === 0 || props.choices.materials.find(material => !material.materialName))
          errorMessage = "Sifarişə məhsul əlavə edin"
        else if (unAssignedMaterials.length !== 0) {
          details = unAssignedMaterials.reduce((prev, curr) => prev += `<div>${curr.materialName}</div>`, "")
          errorMessage = "İstifadə yeri göstərilməmişdir";
        }
        if (errorMessage !== "")
          setOperationResult({ visible: true, desc: errorMessage, details: details })
        else continueNext()
      } else continueNext()
    } else {
      const rec = props.choices.receivers.reverse().map((receiver, i) => [receiver.id, i, receiver.dp ? 1 : 2, i === 0 ? 1 : 0]);
      const mat = props.choices.materials.map(material => [material.materialId, material.materialName, material.count, material.placeid, material.place, material.additionalInfo, material.tesvir])
      const data = { deadline: props.choices.lastDate.toISOString().split('T')[0], mats: mat, inventoryNums: [], basedon: "", ordNumb: "", isWarehouseOrder: 0, orderType: props.choices.serviceType, receivers: rec }
      props.setSending(true);
      fetchPost(`/api/new-order`, data)
        .then(respJ => {
          const message = {
            message: "notification",
            receivers: respJ.map(receiver => ({ id: receiver.receiver, notif: "oO" })),
            data: undefined
          }
          props.operationStateRef.current.style.animation = "visibility-hide 500ms ease-in-out both"
          props.setSending(false);
          webSocket.send(JSON.stringify(message))
          const inParams = {
            from: 0,
            until: 20,
            status: -3,
            dateFrom: '',
            dateTill: '',
            ordNumb: "",
            departments: [],
            canSeeOtherOrders: props.canSeeOtherOrders
          }
          fetchPost('/api/orders', inParams)
            .then(respJ => {
              const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
              props.setOrders({ count: totalCount, orders: respJ })
            })
            .catch(ex => console.log(ex))
        })
        .catch(ex => console.log(ex))
      props.setIsModalVisible(0);
    }
  };
  return (
    <>
      {whichPage.page === 1 ? (
        <FirstPage
          ref={actPageRef}
          setWhichPage={setWhichPage}
          handleDateChange={handleDateChange}
          choices={props.choices}
          setChoices={props.setChoices}
          setHandleDateChange={props.setHandleChange}
          animName={whichPage.animationName}
        />
      ) : whichPage.page === 2 ? (
        <div
          className="page-container"
          style={{ animationName: whichPage.animationName }}
          ref={actPageRef}
        >
          <NewOrderContent
            choices={props.choices}
            setChoices={props.setChoices}
            orderInfo={{ orderType: props.choices.serviceType, structure: -1 }}
            operationResult={operationResult}
            setOperationResult={setOperationResult}
          />
        </div>
      ) : whichPage.page === 3 ? (
        <div className="page-container" ref={actPageRef}>
          <ForwardDocLayout
            textareaVisible={false}
            choices={props.choices}
            setChoices={props.setChoices}
          />
        </div>
      ) : (
        <div></div>
      )}
      <div className="flex gap-3" style={{ float: "right" }}>
        <div
          name="back"
          className="btn btn-primary btn-modal bg-red py-4 mt-8 direction"
          style={{ display: whichPage.page === 1 ? "none" : "block", }}
          onClick={backClickHandler}
        >
          Geri
        </div>

        <div
          className="btn btn-primary btn-modal bg-green py-4 mt-8 direction"
          style={{ float: "right" }}
          type="button"
          name="forward"
          onClick={forwardClickHandler}
        >
          {davamText}
        </div>
      </div>
    </>
  );
};

export default OrderModal;