import React, { useState, useRef, useEffect } from 'react'
import { Suspense } from 'react'
import { BsPlus } from 'react-icons/bs'
import useFetch from '../../hooks/useFetch'
import ModalAdvanced from './ModalAdvanced'
import OfferModal from './OfferModal'

function Offers(props) {
    const fetchGet = useFetch("GET")
    const [modalList, setModalList] = useState([])

    useEffect(() => {
        fetchGet(`/api/price-offers?orderid=${props.orderid}`)
            .then(respJ => {
                setModalList(respJ.map((modal) => ({
                    ...modal,
                    name: "",
                    state: 0,
                    fetched: true,
                })))
            })
            .catch(ex => console.log(ex))
    }, [props.orderid, fetchGet])

    const activeModalRef = useRef(0);
    const handleClick = () => {
        if (activeModalRef.current) {
            activeModalRef.current.style.top = (parseInt(window.getComputedStyle(activeModalRef.current).getPropertyValue("top").substring(0, 3)) + 15) + "px";
            activeModalRef.current.style.left = (parseInt(window.getComputedStyle(activeModalRef.current).getPropertyValue("left").substring(0, 3)) + 15) + "px";
        }
        const id = Date.now();
        setModalList(prev => [...prev, { id: id, name: "", state: 1 }])
    }

    const minimizeHandler = (modalid) => {
        setModalList(prev => prev.map(modal => modal.id === modalid ? { ...modal, state: 0.5 } : modal))
    }

    const handleCloseModal = (modalid) => {
        setModalList(prev => {
            const modal = prev.find(modal => modal.id === modalid);
            if (modal) {
                if (modal.fetched) {
                    return prev.map(old => old.id !== modalid ? old : { ...old, state: 0 })
                }
                else
                    return prev.filter(old => old.id !== modalid)
            }
            return prev
        })
    }

    const handleOfferSelect = (offerId) => {
        setModalList(prev => prev.map(modal => modal.id === offerId ? { ...modal, state: 1 } : modal))
    }

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row', float: 'right', paddingBottom: '10px' }}>
                {modalList.map((modal, index) => <div key={index} className="priceTags" onClick={() => handleOfferSelect(modal.id)} style={{ cursor: 'pointer' }}>{"Təklif " + (index + 1)}</div>)}
                <BsPlus size='30' onClick={handleClick} style={{ cursor: 'pointer' }} />
            </div>
            {
                modalList.filter(modal => modal.state >= 0.5).map(modal =>
                    <div key={modal.id} style={{ visibility: modal.state === 0.5 ? "hidden" : "" }}>
                        <Suspense fallback="">
                            <ModalAdvanced
                                modalid={modal.id}
                                activeModalRef={activeModalRef}
                                show={modal.state}
                                changeModalState={handleCloseModal}
                                minimizeHandler={minimizeHandler}
                            >
                                <OfferModal
                                    orderContent={props.visa}
                                    activeModalRef={activeModalRef}
                                    modalid={modal.id}
                                    fetched={modal.fetched}
                                    orderid={props.orderid}
                                    handleCloseModal={handleCloseModal}
                                    setModalList={setModalList}
                                />
                            </ModalAdvanced>
                        </Suspense>
                    </div>
                )
            }
        </div>
    )
}

export default Offers
