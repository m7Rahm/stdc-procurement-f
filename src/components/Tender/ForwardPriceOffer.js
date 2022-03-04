import { useContext, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { NotificationContext, WebSocketContext } from "../../pages/SelectModule";
import ForwardDocLayout from "../STDC local/ForwardDocLayout/ForwardDocLayout";

const ForwardPriceOffer = (props) => {
    const [receivers, setReceivers] = useState([])
    const fetchPut = useFetch("PUT");
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
            type: 1
        }
        fetchPut(`/api/fofpr/${props.doc_id}`, data)
            .then(_ => {
                const message = {
                    type: 0,
                    receivers: receivers.map(receiver => ({ id: receiver.id, module: 0, doc_id: props.doc_id, sub_module: 3, type: 0, doc_type: 1 })),
                    data: {
                        order_id: props.doc_id
                    }
                }
                webSocket.send(JSON.stringify(message))
                notifcationContext("Sifariş yönləndirildi", `/tender/orders?i=${props.doc_id}`)
                if(props.handle_done){
                    props.handle_done()
                }
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
                textareaVisible={false}
            />
            <div onClick={forward_order} className="send-order">Göndər</div>
        </>
    )
}
export default ForwardPriceOffer