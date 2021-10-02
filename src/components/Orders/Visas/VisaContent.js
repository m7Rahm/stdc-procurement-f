import React, { useRef, useState, useEffect } from 'react'
import OrderContentProtected from './OrderContentProtected'
import VisaContentFooter from './VisaContentFooter'
import EmptyContent from '../../Misc/EmptyContent'
import { useLocation } from 'react-router-dom'
import useFetch from '../../../hooks/useFetch'
import OperationStateLite from '../../Misc/OperationStateLite'

const VisaContent = (props) => {
    const location = useLocation();
    const { tranid } = props;
    const visaContentRef = useRef(null);
    const [operationStateText, setOperationStateText] = useState({ text: "Əməliyyat icra olunur...", id: tranid });
    const [sending, setSending] = useState(undefined);
    const [visa, setVisa] = useState(undefined);
    const locationTranid = location.state?.tran_id
    const canProceed = useRef({});
    const fetchGet = useFetch("GET");
    useEffect(() => {
        const abortController = new AbortController();
        let mounted = true;
        if (tranid && mounted) {
            fetchGet(`/api/tran-info/${tranid}`, abortController)
                .then(respJ => {
                    if (respJ.length !== 0 && mounted) {
                        canProceed.current = respJ.reduce((prev, material) => ({ ...prev, [material.order_material_id]: true }), {})
                        setVisa(respJ);
                        if (!respJ[0].is_read_prev) {
                            const event = new CustomEvent("inAppEvent", {
                                detail: { tran_id: respJ[0].id, doc_type: 0, module_id: 0, sub_module_id: 2 }
                            });
                            window.dispatchEvent(event)
                        }
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
    useEffect(() => {
        const abortController = new AbortController();
        let mounted = true;
        if (locationTranid && mounted) {
            fetchGet(`/api/tran-info/${locationTranid}`, abortController)
                .then(respJ => {
                    if (respJ.length !== 0 && mounted) {
                        canProceed.current = respJ.reduce((prev, material) => ({ ...prev, [material.order_material_id]: true }), {})
                        setVisa(respJ);
                        if (!respJ[0].is_read_prev) {
                            const event = new CustomEvent("inAppEvent", {
                                detail: { tran_id: respJ[0].id, doc_type: 0, module_id: 0, sub_module_id: 2 }
                            });
                            window.dispatchEvent(event)
                        }
                    } else
                        setVisa(undefined)
                })
                .catch(error => console.log(error));
            return () => {
                mounted = false;
                abortController.abort()
            }
        }
    }, [locationTranid, fetchGet]);
    const handleOperationStateClick = () => {
        props.setActive(operationStateText.id);
        setSending(false)
        window.history.replaceState(undefined, "", `/orders/visas/${operationStateText.id}`)
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
