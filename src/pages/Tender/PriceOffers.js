import React, { useState, useEffect, useRef, useContext } from 'react'
import { useHistory } from 'react-router-dom';
import VisaContentMaterials from '../../components/Common/VisaContentMaterials'
import ForwardDocLayout from '../../components/STDC local/ForwardDocLayout/ForwardDocLayout';
import useFetch from '../../hooks/useFetch'
import table from "../../styles/Table.module.css"
import { BsArrowRight } from "react-icons/bs"
import { NotificationContext, WebSocketContext } from '../SelectModule';
function PriceOffers(props) {
    const { id } = props;
    const [visa, setVisa] = useState([]);
    const fetchGet = useFetch("GET");
    const history = useHistory();
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        setShowModal(false)
        fetchGet(`/api/order-req-data?numb=""&vers=${id}`)
            .then(respJ => {
                setVisa(respJ.map(material => ({ ...material, order_material_id: material.id, mat_ass: material.assignment_name })))
            })
            .catch(ex => console.log(ex))
    }, [id, fetchGet]);
    const showModalHandler = () => setShowModal(true)
    return (
        visa.length !== 0 &&
        <div style={{ padding: "6rem 1rem 0rem 1rem", flex: 1 }}>
            <div style={{ maxWidth: "1256px", margin: "auto" }}>
                <div style={{ display: "flex", alignItems: "flex-start", flexFlow: "row wrap", justifyContent: "space-between", marginBottom: "5px" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', float: 'left', paddingLeft: '20px', whiteSpace: "nowrap" }}>
                        <div style={{ fontWeight: 'bold', color: "#FFB830", fontSize: "2rem" }}>{visa[0].full_name}</div>
                        <div title="deadline" style={{ fontSize: '20px', fontWeight: "700", color: "gray" }}>Deadline: {visa[0].deadline}</div>
                    </div>
                    <div>
                        <div className={table["price-offer-action"]} onClick={() => history.push(`/tender/price-offers/${id}`, { visa, id })}>
                            Razılaşmalara bax
                            <BsArrowRight size="16px" />
                        </div>
                        {
                            props.can_see_others &&
                            <div className={table["price-offer-action"]} onClick={showModalHandler}>Yönəlt</div>
                        }
                    </div>
                </div>
                <VisaContentMaterials
                    orderContent={visa}
                    forwardType={1}
                />
                <Processors showModal={showModal} id={id} />
            </div>
        </div>
    )
}

export default PriceOffers
const ForwardPriceOffer = (props) => {
    const [receivers, setReceivers] = useState([])
    const fetchPut = useFetch("PUT");
    const textareaRef = useRef(null);
    const notifcationContext = useContext(NotificationContext);
    const webSocket = useContext(WebSocketContext);
    const handleElementDrag = (draggedElement, index) => {
        setReceivers(prev => {
            const draggedIndex = prev.findIndex(card => card.id === draggedElement.id);
            const elementsBeforeIndex = prev.slice(0, draggedIndex > index ? index : index + 1);
            const before = elementsBeforeIndex.filter(card => card.id !== draggedElement.id)
            const elementsAfterIndex = prev.slice(draggedIndex > index ? index : index + 1);
            const after = elementsAfterIndex.filter(card => card.id !== draggedElement.id)
            return [...before, draggedElement, ...after]
        })
    }
    const handleDeselection = (employee) => {
        setReceivers(prev => prev.filter(emp => emp.id !== employee.id))
    }
    const handleSelectChange = (employee) => {
        if (!props.processors.find(processor => processor.receiver_id === employee.id))
            setReceivers(prev => {
                const receivers = [...prev]
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
                    return receivers
                }
                else return prev
            })
    }
    const forward_order = () => {
        const data = {
            receivers: receivers.map(receiver => receiver.id).join(","),
            comment: textareaRef.current.value
        }
        fetchPut(`/api/fofpr/${props.id}`, data)
            .then(_ => {
                const message = {
                    type: 0,
                    receivers: receivers.map(receiver => ({ id: receiver.id, module: 3, doc_id: props.id, sub_module: 0, type: 0, doc_type: 0 })),
                    data: {
                        order_id: props.id
                    }
                }
                webSocket.send(JSON.stringify(message))
                notifcationContext("Sifariş yönləndirildi", `/tender/orders?i=${props.id}`)
            })
            .catch(ex => console.log(ex))
    }
    return (
        <>
            <ForwardDocLayout
                receivers={receivers}
                handleElementDrag={handleElementDrag}
                handleSelectChange={handleSelectChange}
                handleDeselection={handleDeselection}
                textareaRef={textareaRef}
            />
            <div onClick={forward_order} className="send-order">Göndər</div>
        </>
    )
}
const Processors = (props) => {
    const fetchGet = useFetch("GET");
    const [processors, set_processors] = useState([])
    useEffect(() => {
        fetchGet(`/api/order-processors/${props.id}`)
            .then(resp => set_processors(resp))
            .catch(ex => console.log(ex))
    }, [props.id, fetchGet])
    return (
        <>
            <div style={{ marginTop: "20px" }}>
                {
                    processors.map(emp =>
                        <div key={emp.receiver_id} style={{ float: "left", cursor: "default", borderRadius: "5px", padding: "0.5rem", color: "white", backgroundColor: "rgb(255, 184, 48)", marginRight: "10px" }}>
                            {emp.full_name}
                        </div>
                    )
                }
            </div>
            {
                props.showModal &&
                <ForwardPriceOffer processors={processors} id={props.id} />
            }
        </>
    )
}