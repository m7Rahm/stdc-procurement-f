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
    props.modalWrapperRef.current.style.overflow = "hidden";
    const animationendEventListener = () => {
      actPageRef.current.removeEventListener(
        "animationend",
        animationendEventListener,
        false
      );
      setWhichPage((prevState) => {
        actPageRef.current.style.animationName = "slide_geri_next"
        props.modalWrapperRef.current.style.width = prevState.page === 3 ? "90%" : "40rem";
        return prevState.page > 1 ? {
          page: prevState.page - 1,
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
        props.modalWrapperRef.current.style.overflow = "hidden";
        const animationendEventListener = () => {
          if (actPageRef.current.style.animationName === "slide_davam_next") {
            props.modalWrapperRef.current.style.overflow = "visible";
            actPageRef.current.removeEventListener(
              "animationend",
              animationendEventListener,
              false
            );
          }
          setWhichPage(prevState => {
            if (actPageRef.current.style.animationName === "slide_davam_current" && prevState.page < 3) {
              actPageRef.current.style.animationName = "slide_davam_next"
              props.modalWrapperRef.current.style.width = prevState.page === 1 ? "90%" : "40rem";
              return {
                page: prevState.page + 1,
              }
            } else return prevState
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
      const mat = props.choices.materials.map(material => [material.materialId, material.materialName, material.count, material.additionalInfo,  material.place])
      const data = {
        deadline: props.choices.lastDate.toISOString().split('T')[0],
        mats: mat,
        // inventoryNums: [],
        // basedon: "",
        // ordNumb: "",
        // isWarehouseOrder: 0,
        orderType: props.choices.serviceType,
        receivers: rec
      }
      props.setSending(true);
      fetchPost(`/api/new-order`, data)
        .then(respJ => {
          const message = {
            message: "notification",
            receivers: respJ.map(receiver => ({ id: receiver.receiver, doc_type: 1, module_id: 0, sub_module_id: 1 })),
            data: undefined
          }
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
      <div className="new-ord-nav-container" >
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
          type="button"
          name="forward"
          onClick={forwardClickHandler}
        >
          {davamText}
        </div>
      </div>
      <div
        className="page-container"
        ref={actPageRef}
      >
        {whichPage.page === 1 ? (
          <FirstPage
            setWhichPage={setWhichPage}
            handleDateChange={handleDateChange}
            choices={props.choices}
            setChoices={props.setChoices}
            setHandleDateChange={props.setHandleChange}
            animName={whichPage.animationName}
          />
        ) : whichPage.page === 2 ? (
          <NewOrderContent
            choices={props.choices}
            setChoices={props.setChoices}
            orderInfo={{ orderType: props.choices.serviceType, structure: -1 }}
            operationResult={operationResult}
            setOperationResult={setOperationResult}
          />
        ) : whichPage.page === 3 ?
          <ForwardOrder
            choices={props.choices}
            setChoices={props.setChoices}
          />
          : (
            <div></div>
          )}
      </div>
    </>
  );
};

export default OrderModal;

const ForwardOrder = (props) => {
  const fetchGet = useFetch("GET");
  const setChoices = props.setChoices;
  useEffect(() => {
    let mounted = true;
    if (mounted)
      fetchGet('/api/dependency-graph')
        .then(respJ => {
          if (mounted && respJ.length !== 0) {
            setChoices(prev => {
              if (prev.receivers.length === 0)
                return { ...prev, receivers: respJ.map(rec => ({ ...rec, dp: true })) }
              else return prev
            })
          }
        })
        .catch(err => console.log(err));
    return () => mounted = false
  }, [fetchGet, setChoices]);
  const handleElementDrag = (draggedElement, index) => {
    props.setChoices(prev => {
      const draggedIndex = prev.receivers.findIndex(card => card.id === draggedElement.id);
      const elementsBeforeIndex = prev.receivers.slice(0, draggedIndex > index ? index : index + 1);
      const before = elementsBeforeIndex.filter(card => card.id !== draggedElement.id)
      const elementsAfterIndex = prev.receivers.slice(draggedIndex > index ? index : index + 1);
      const after = elementsAfterIndex.filter(card => card.id !== draggedElement.id)
      return { ...prev, receivers: [...before, draggedElement, ...after] }
    })
  }
  const handleDeselection = (employee) => {
    props.setChoices(prevState => ({ ...prevState, receivers: prevState.receivers.filter(emp => emp.id !== employee.id) }))
  }
  const handleSelectChange = (employee) => {
    props.setChoices(prevState => {
      const receivers = [...prevState.receivers]
      const res = receivers.find(emp => emp.id === employee.id);
      if (!res) {
        let lastNonDpIndex = 1;
        for (let i = receivers.length - 1; i >= 0; i--) {
          if (receivers[i].dp === undefined) {
            lastNonDpIndex = i + 1;
            break;
          }
        }
        receivers.splice(lastNonDpIndex, 0, employee)
        return {
          ...prevState,
          receivers: receivers
        }
      }
      else return prevState
    })
  }
  return (
    <ForwardDocLayout
      textareaVisible={false}
      receivers={props.choices.receivers}
      handleElementDrag={handleElementDrag}
      handleSelectChange={handleSelectChange}
      handleDeselection={handleDeselection}
    />
  )
}