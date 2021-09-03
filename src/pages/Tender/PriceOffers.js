import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import VisaContentMaterials from '../../components/Common/VisaContentMaterials'
import ForwardDocLayout from '../../components/STDC local/ForwardDocLayout/ForwardDocLayout';
import useFetch from '../../hooks/useFetch'
import Offers from './Offers'
import PriceResearch from './PriceResearch';

function PriceOffers(props) {
    const { id } = props;
    const [visa, setVisa] = useState([]);
    const fetchGet = useFetch("GET");
    const history = useHistory();
    useEffect(() => {
        fetchGet(`/api/order-req-data?numb=""&vers=${id}`)
            .then(respJ => {
                setVisa(respJ.map(material => ({ ...material, order_material_id: material.id, mat_ass: material.assignment_name })))
            })
            .catch(ex => console.log(ex))
    }, [id, fetchGet])
    return (
        visa.length !== 0 &&
        <div style={{ padding: "6rem 1rem 0rem 1rem", flex: 1 }}>
            <div onClick={() => history.push("/tender/new-offer", { visa, id })}>Razılaşmalara bax</div>
            <Offers visa={visa} orderid={id} />
            <VisaContentMaterials
                orderContent={visa}
                forwardType={1}
            />
            <ForwardPriceOffer />
        </div>
    )
}

export default PriceOffers

const ForwardPriceOffer = () => {
    const [receivers, setReceivers] = useState([])

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
    return (
        <ForwardDocLayout
            receivers={receivers}
            handleElementDrag={handleElementDrag}
            handleSelectChange={handleSelectChange}
            handleDeselection={handleDeselection}
        />
    )
}