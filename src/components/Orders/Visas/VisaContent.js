import React, { useRef, useState, useEffect, useCallback } from 'react'
import OrderContentProtected from './OrderContentProtected'
import VisaContentFooter from './VisaContentFooter'
import EmptyContent from '../../Misc/EmptyContent'
import { useLocation } from 'react-router-dom'
import useFetch from '../../../hooks/useFetch'
import Chat from '../../Misc/Chat'

const VisaContent = (props) => {
    const location = useLocation();
    const { tranid, documentType, initid } = props;
    const visaContentRef = useRef(null);
    const [visa, setVisa] = useState(undefined);
    const locationTranid = location.state ? location.state.tranid : undefined
    const inid = location.state ? location.state.initid : undefined
    const canProceed = useRef({});
    const fetchGet = useFetch("GET");
    const fetchPost = useFetch("POST")
    const fetchMessages = useCallback((from = 0) =>
        fetchGet(`/api/messages/${tranid}?from=${from}&replyto=0&doctype=${documentType}`)
        , [tranid, fetchGet, documentType]);
    const sendMessage = useCallback((data) => {
        const apiData = { ...data, docType: documentType };
        return fetchPost(`/api/send-message`, apiData)
    }, [fetchPost, documentType]);
    useEffect(() => {
        const abortController = new AbortController();
        let mounted = true;
        if (tranid && mounted && initid) {
            fetchGet(`/api/tran-info?tranid=${tranid}&init=${initid}`, abortController)
                .then(respJ => {
                    if (respJ.length !== 0 && mounted) {
                        canProceed.current = respJ.reduce((prev, material) => ({ ...prev, [material.order_material_id]: true }), {})
                        setVisa(respJ);
                    }
                })
                .catch(error => console.log(error));
            return () => {
                mounted = false;
                abortController.abort()
            }
        }
    }, [tranid, fetchGet, initid]);
    useEffect(() => {
        const abortController = new AbortController();
        let mounted = true;
        if (locationTranid && mounted) {
            fetchGet(`/api/tran-info?tranid=${locationTranid}&init=${inid}`, abortController)
                .then(respJ => {
                    if (respJ.length !== 0 && mounted) {
                        canProceed.current = respJ.reduce((prev, material) => ({ ...prev, [material.order_material_id]: true }), {})
                        setVisa(respJ);
                    }
                })
                .catch(error => console.log(error));
            return () => {
                mounted = false;
                abortController.abort()
            }
        }
    }, [locationTranid, fetchGet, inid]);
    
    return (
        <div className="visa-content-container" style={{ minWidth: "0px" }} ref={visaContentRef}>
            {
                visa ?
                    <div>
                        <OrderContentProtected
                            footerComponent={VisaContentFooter}
                            setVisa={setVisa}
                            visaContentRef={visaContentRef}
                            canProceed={canProceed}
                            current={visa}
                            navigationRef={props.navigationRef}
                        />
                        {/* <div style={{ margin: "10px 20px" }}>
                            <Chat
                                loadMessages={fetchMessages}
                                documentid={tranid}
                                documentType={documentType}
                                sendMessage={sendMessage}
                            />
                        </div> */}
                    </div>
                    : <EmptyContent />
            }
        </div>
    )
}
export default VisaContent
