import React, { useRef, useState, useEffect } from 'react'
import OrderContentProtected from './OrderContentProtected'
import VisaContentFooter from './VisaContentFooter'
import EmptyContent from '../../Misc/EmptyContent'
import useFetch from '../../../hooks/useFetch'
import OperationStateLite from '../../Misc/OperationStateLite'

const VisaContent = (props) => {
    const { tranid } = props;
    const visaContentRef = useRef(null);
    const [operationStateText, setOperationStateText] = useState({ text: "Əməliyyat icra olunur...", orderid: null, initid: null });
    const [sending, setSending] = useState(undefined);
    const [visa, setVisa] = useState(undefined);
    const canProceed = useRef({});
    const fetchGet = useFetch("GET");
    useEffect(() => {
        const abortController = new AbortController();
        let mounted = true;
        if (tranid && mounted) {
            fetchGet(`/api/visas/${tranid}`, abortController)
                .then(respJ => {
                    if (respJ.length !== 0 && mounted) {
                        canProceed.current = respJ.reduce((prev, material) => ({ ...prev, [material.order_material_id]: true }), {})
                        setVisa(respJ);
                        // console.log(respJ)
                    }
                    else
                        setVisa(undefined)
                })
                .catch(error => console.log(error));
            return () => {
                mounted = false;
                abortController.abort()
            }
        }
    }, [tranid, fetchGet]);
    const handleOperationStateClick = () => {
        props.setActive(operationStateText.orderid);
        setSending(false)
        window.history.replaceState(undefined, "", `/orders/visas?i=${operationStateText.orderid}&r=${operationStateText.initid}`)
    }
    return (
        <div className="visa-content-container" style={{ minWidth: "0px" }} ref={visaContentRef}>
            {sending !== undefined && <OperationStateLite handleOperationStateClick={handleOperationStateClick} state={sending} setState={setSending} text={operationStateText.text} />}
            {
                visa ?
                    <div>
                        <OrderContentProtected
                            footerComponent={VisaContentFooter}
                            setVisa={setVisa}
                            visaContentRef={visaContentRef}
                            canProceed={canProceed}
                            current={visa}
                            setOperationStateText={setOperationStateText}
                            setSending={setSending}
                            navigationRef={props.navigationRef}
                        />
                    </div>
                    : <EmptyContent />
            }
        </div>
    )
}
export default VisaContent
