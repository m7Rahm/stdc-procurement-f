import React, { useState, useEffect } from 'react'
// import AgreementVendors from './AgreementVendors'
import EmptyContent from '../../Misc/EmptyContent'
// import { FaCheck, FaTimes } from 'react-icons/fa'
import useFetch from '../../../hooks/useFetch'
import PriceOffers from '../../../pages/Tender/PriceOffers'
import MySelections from './MySelections'
const AgreementContent = (props) => {
    const tranid = props.another;
    const [order, set_order] = useState(undefined);
    const fetchGet = useFetch("GET");
    useEffect(() => {
        let mounted = true;
        if (tranid && mounted)
            fetchGet(`/api/price-offer-selections/${tranid}`)
                .then(respJ => {
                    const order = respJ[0];
                    if (mounted) {
                        if (order.order_id !== null) {
                            set_order(order.order_id);
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
                        <PriceOffers
                            id={order}
                            referer={0}
                        />
                        <MySelections order_id={order} />
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

