import React, { useState, useLayoutEffect } from 'react'
// import AgreementVendors from './AgreementVendors'
import EmptyContent from '../../Misc/EmptyContent'
// import { FaCheck, FaTimes } from 'react-icons/fa'
import useFetch from '../../../hooks/useFetch'
import PriceOffers from '../../../pages/Tender/PriceOffers'
const AgreementContent = (props) => {
    const tranid = props.another;
    const [order, set_order] = useState(undefined);
    const [selections, set_selections] = useState([]);
    const fetchGet = useFetch("GET");
    useLayoutEffect(() => {
        let mounted = true;
        if (tranid && mounted)
            fetchGet(`/api/price-offer-selections/${tranid}`)
                .then(respJ => {
                    const order = respJ[0];
                    const selections = respJ.slice(1)
                    if (mounted) {
                        if (order.order_id !== null) {
                            set_order(order.order_id);
                            if (selections.length !== 0)
                                set_selections(selections);
                        } else {
                            set_order(-1)
                        }
                    }
                })
                .catch(ex => console.log(ex));
        return () => mounted = false
    }, [tranid, fetchGet]);
    return (
        <div className="visa-content-container" style={{ maxWidth: '1256px', margin: 'auto' }}>
            {
                order !== undefined && order !== -1 ?
                    <>
                        <PriceOffers id={order} />
                        {
                            selections.map(pro =>
                                <div key={pro.id}>dasds</div>
                            )
                        }
                    </>
                    : order === -1 ?
                        <>
                            Sənəd tapılmadı
                        </>
                        :
                        <EmptyContent />
            }
        </div>
    )
}
export default AgreementContent