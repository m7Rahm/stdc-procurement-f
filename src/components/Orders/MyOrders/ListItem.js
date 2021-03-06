import React, { lazy, useState, useContext, useCallback, useEffect, useRef } from "react"
import { FaBoxOpen, FaBox } from "react-icons/fa"
import {
  IoMdCheckmark,
  IoMdClose,
  IoMdPaperPlane,
  IoMdDoneAll,
  IoMdPeople,
  IoMdMore,
  IoMdChatbubbles,
} from "react-icons/io"
import EditOrderRequest from "../../modal content/EditOrderRequest"
import { TokenContext } from "../../../App"
import { WebSocketContext } from "../../../pages/SelectModule"
import useFetch from "../../../hooks/useFetch"
import Chat from "../../Misc/Chat"
import ReturnedOrderCards from "./ReturnedOrderCards"
import { colors } from "../../../data/data"
const FinishOrder = lazy(() => import("../../modal content/FinishOrder"))
const ParticipantsModal = lazy(() => import("../../modal content/Participants"))
const StatusModal = lazy(() => import("../../modal content/Status"))
const Hybrid = (props) => <>
  <StatusModal id={props.id} />
  <ParticipantsModal id={props.id} />
</>
const OrderContentWithChat = (props) => {
  const fetchGet = useFetch("GET");
  const fetchPost = useFetch("POST")
  const fetchMessages = useCallback((from = 0) =>
    fetchGet(`/api/messages/${props.id}?from=${from}&replyto=0&doctype=${10}`)
    , [props.id, fetchGet]);
  const sendMessage = useCallback((data) => {
    const apiData = { ...data, docType: 10 };
    return fetchPost(`/api/send-message`, apiData)
  }, [fetchPost]);
  return (
    <>
      <EditOrderRequest {...props} navBack={props.navBack} handleBackClick={props.handleBackClick} />
      <div style={{ padding: "0px 20px", width: "100%" }}>
        {props.view !== "returned" &&
          <Chat
            loadMessages={fetchMessages}
            documentid={props.id}
            documentType={10}
            sendMessage={sendMessage}
          />
        }
      </div>
    </>
  )
}

const PreviousOrders = (props) => {
  const actPageRef = useRef(null);
  const fetchGet = useFetch("GET");
  const [versions, setVersions] = useState({});
  const [version, setVersion] = useState({ id: undefined, animationName: "", version: "" })
  useEffect(() => {
    fetchGet(`/api/order-versions/${props.id}`)
      .then(respJ => {
        const versions = {};
        for (let i = 0; i < respJ.length; i++) {
          if (!versions[respJ[i].order_id]) {
            versions[respJ[i].order_id] = respJ.filter(mat => mat.order_id === respJ[i].order_id)
          }
        }
        if (Object.keys(versions).length > 1)
          setVersions(versions)
        else
          setVersion({ id: respJ[0].order_id, version: respJ[0].emp_id })
      })
      .catch(ex => console.log(ex))
  }, [props.id, fetchGet]);
  const handleCardClick = (e) => {
    const id = e.currentTarget.id;
    actPageRef.current.style.animationName = "slide_davam_current";
    const animationendEventListener = (e) => {
      if (e.animationName === "slide_davam_next") {
        props.modalWrapperRef.current.style.overflow = "visible";
        actPageRef.current.removeEventListener(
          "animationend",
          animationendEventListener,
          false
        );
      }
      props.modalWrapperRef.current.style.width = "90%";
      if (e.animationName === "slide_davam_current")
        setVersion({ id: id, animationName: "slide_davam_next", navBack: true });
    }
    actPageRef.current.addEventListener(
      "animationend",
      animationendEventListener,
      false
    );
  }
  const handleBackClick = () => {
    actPageRef.current.style.animationName = "slide_geri_current";
    props.modalWrapperRef.current.style.width = "600px";
    props.modalWrapperRef.current.style.overflow = "hidden";
    const animationendEventListener = (e) => {
      actPageRef.current.removeEventListener(
        "animationend",
        animationendEventListener,
        false
      );
      setVersion({ id: undefined, animationName: "slide_geri_next" });
    };
    actPageRef.current.addEventListener(
      "animationend",
      animationendEventListener,
      false
    );
  }
  return (
    <div ref={actPageRef} className="page-container" style={{ animationName: version.animationName, padding: "20px" }}>
      {version.id === undefined ?
        <div
          style={{
            display: 'flex',
            flexFlow: 'row wrap',
            gap: '12px',
            justifyContent: "space-evenly"
          }} >
          {Object.keys(versions).map((orderid,index) =>
            <ReturnedOrderCards
              key={orderid}
              orderid={orderid}
              handleCardClick={handleCardClick}
              order={versions[orderid]}
              full_name={versions[orderid][0].full_name}
              isLast={index===(Object.keys(versions).length-1) ? true : false}              
            />
          )}
        </div>
        : <OrderContentWithChat
          {...props}
          version={version.version}
          navBack={version.navBack}
          handleBackClick={handleBackClick}
        />
      }
    </div>
  )
}

const ListItem = (props) => {
  const tokenContext = useContext(TokenContext);
  const webSocket = useContext(WebSocketContext);
  const token = tokenContext[0].token;
  const theme = props.theme;
  const { referer, setOrders, status, participants, date, deadline, id, number, empid, setModalState } = props;

  const onParticipantsClick = () => {
    const childProps = { id }
    setModalState(prev => ({ ...prev, visible: true, content: Hybrid, childProps: childProps, number: number }))
  }
  const handleFinishClick = () => {
    const childProps = {
      token: token,
      id,
      version: empid,
      ordNumb: number,
      status: status,
      setOrders: setOrders
    }
    setModalState(prev => ({ ...prev, visible: true, content: FinishOrder, childProps: childProps, number: number }))
  }
  const fetchPost = useFetch("POST");
  const onInfoClick = () => {
    const onSendClick = (data) => {
      props.setSending(true)
      fetchPost("/api/new-order", data)
        .then(respJ => {
          if (respJ[0].result === "success") {
            const message = {
              message: "notification",
              receivers: respJ.map(receiver => ({ id: receiver.receiver, notif: "oO" })),
              data: undefined
            }
            webSocket.send(JSON.stringify(message))
            props.setSending(false);
            const event = new CustomEvent("inAppEvent", {
              detail: { tranid: data.orderid, docType: 0, categoryid: 2 }
            });
            window.dispatchEvent(event)
            setOrders(prev => {
              const newList = prev.orders.filter(order => order.id !== id);
              setModalState(prev => ({ ...prev, visible: false }))
              return ({ orders: newList, count: newList.count })
            });
          }
        })
        .catch(() => {
          props.setSending(false)
          props.setOperationStateText({ text: "X??ta ba?? verdi" })
        })
    }

    const childProps = {
      version: empid,
      ordNumb: number,
      view: referer,
      id: id,
      onSendClick
    }
    setModalState(prev => ({ ...prev, visible: true, content: PreviousOrders, childProps, number: number, style: referer === "returned" ? { minWidth: "auto", width: "600px" } : undefined }))
  }
  const icon = status === 0
    ? <IoMdCheckmark color="#F4B400" title="Bax??l??r" size="20" />
    : status === 99
      ? <IoMdDoneAll color="#0F9D58" title="Tamamlanm????d??r" size="20" />
      : status === -1
        ? <IoMdClose color="#DB4437" title="Etiraz" size="20" />
        : status === 77
          ? <IoMdPaperPlane color="#4285F4" title="G??zl??nilir" size="20" />
          : status === 20
            ? <FaBoxOpen title="Anbardan g??nd??rildi" size="20" color="#aaaaaa" />
            : status === 1
              ? <IoMdCheckmark color="#0F9D58" title="T??sdiq" size="20" />
              : status === 25 || status === 44
                ? <FaBox color="#aaaaaa" title="Anbara daxil oldu" size="20" />
                : ""

  const getColor = (deadline) => {
    if (Date.parse(deadline) < Date.parse(new Date()))
      return "red"
  }
  const row_color = props.index % 2 === 0 ? colors[theme].even_row : colors[theme].odd_row;
  return (
    <>
      <li style={{ justifyContent: "space-between" }} style={{ background: row_color }}>
        <div style={{ width: "30px", fontWeight: "520", color: "#505050", marginLeft: "10px" }}>{props.index + 1}</div>
        <div style={{ width: "80px", textAlign: "center" }}>
          {icon}
        </div>
        <div style={{ minWidth: "80px", width: "15%", textAlign: "left" }}>{date}</div>
        <div style={{ minWidth: "80px", width: "15%", textAlign: "left", color: getColor(deadline, date) }}>{deadline}</div>
        <div style={{ minWidth: "60px", width: "15%", textAlign: "left" }}> {number}</div>
        <div style={{ width: "40%", textAlign: "left", position: "relative", paddingLeft: "30px" }}>
          <IoMdPeople cursor="pointer" onClick={onParticipantsClick} size="20" display="block" style={{ position: "absolute", left: "0px" }} color={colors[theme].accent} />
          <input defaultValue={participants.slice(0, -2)} disabled={true} style={{ width: "100%", borderStyle: 'hidden', textAlign: 'justify' }} />
          <div className="fadingText" style={{ background: `linear-gradient(to right, transparent, ${row_color}` }}></div>
        </div>
        <div style={{ width: "60px" }}>
          <IoMdChatbubbles size="20" color={colors[props.theme].accent} cursor="pointer" onClick={onInfoClick} />
        </div>
        <div style={{ width: "20px" }}>{referer === "protected" && (status === 20 || status === 99 || status === 44) && <IoMdMore pointer="cursor" onClick={handleFinishClick} />}</div>
      </li>
    </>
  )
}
export default React.memo(ListItem)
