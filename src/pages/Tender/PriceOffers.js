import React, { useState, useEffect, Suspense } from 'react'
import { useHistory } from 'react-router-dom';
import VisaContentMaterials from '../../components/Common/VisaContentMaterials'
import useFetch from '../../hooks/useFetch'
import table from "../../styles/Table.module.css"
import { BsArrowRight } from "react-icons/bs"

function PriceOffers(props) {
    const { id, referer } = props;
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
                <div style={{ display: "flex", alignItems: "flex-start", flexFlow: "row wrap", justifyContent: "space-between", marginBottom: "15px" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', float: 'left', paddingLeft: '20px', whiteSpace: "nowrap" }}>
                        <div style={{ fontWeight: 'bold', color: "#FFB830", fontSize: "2rem" }}>{visa[0].full_name}</div>
                        <div title="deadline" style={{ fontSize: '20px', fontWeight: "700", color: "gray" }}>Deadline: {visa[0].deadline}</div>
                    </div>
                    <div>
                        <div className={table["price-offer-action"]} onClick={() => history.push(`/tender/price-offers/${id}`, { visa, id, referer })}>
                            Araşdırmalara bax
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
                <Processors
                    showModal={showModal}
                    id={id}
                    referer={referer}
                />
            </div>
        </div>
    )
}

export default PriceOffers

const ForwardPriceOffer = React.lazy(() => import("../../components/Tender/ForwPOFResarch"))
const Processors = (props) => {
    const fetchGet = useFetch("GET");
    const [processors, set_processors] = useState([]);
    const referer = props.referer;
    useEffect(() => {
        fetchGet(`/api/order-processors/${props.id}`)
            .then(resp => {
                const processors = [];
                const response = referer === 0 ? resp.filter(rec => rec.forward_type !== 0) : resp
                for (let i = 0; i < response.length; i++) {
                    if (!processors.find(processor => processor.receiver_id === response[i].receiver_id)) {
                        processors.push(response[i])
                    }
                }
                set_processors(processors)
            })
            .catch(ex => console.log(ex))
    }, [props.id, fetchGet, referer])
    return (
        <>
            <div style={{ marginTop: "20px", overflow: "hidden" }}>
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
                <Suspense fallback="">
                    <ForwardPriceOffer
                        processors={processors}
                        id={props.id}
                    />
                </Suspense>
            }
        </>
    )
}