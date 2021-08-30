import React, { useState, useEffect } from 'react'
import VisaContentMaterials from '../../components/Common/VisaContentMaterials'
import useFetch from '../../hooks/useFetch'
import Offers from './Offers'

function PriceOffers(props) {
    const { id } = props;
    const [visa, setVisa] = useState([]);
    const fetchGet = useFetch("GET");
    useEffect(() => {
        fetchGet(`/api/order-req-data?numb=""&vers=${id}`)
            .then(respJ => {
                setVisa(respJ.map(material => ({ ...material, order_material_id: material.material_id, mat_ass: material.assignment_name })))
            })
            .catch(ex => console.log(ex))
    }, [id, fetchGet])
    return (
        visa.length !== 0 &&
        <div style={{ padding: "6rem 1rem 0rem 1rem", flex: 1 }}>
            <Offers visa={visa} orderid={id} />
            <VisaContentMaterials
                orderContent={visa}
                forwardType={1}
            />
            <div style={{ display: 'flex', flexDirection: 'row', float: 'right', paddingTop: '30px' }}>

                <div className="priceButtons">Yönəlt</div>
            </div>
        </div>
    )
}

export default PriceOffers


