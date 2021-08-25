import React, { useState, useRef, useEffect } from 'react'
import VisaContentMaterials from '../../components/Common/VisaContentMaterials'
import { Suspense } from 'react'
import { BsPlus } from 'react-icons/bs'
// import Modal from '../../components/Misc/Modal'
import OfferModal from './OfferModal'
import ModalAdvanced from './ModalAdvanced'
import useFetch from '../../hooks/useFetch'

function PriceOffers(props) {
    const { id } = props;
    // const modalRef = useRef(null);
    const [visa, setVisa] = useState([]);
    const fetchGet = useFetch("GET");
    useEffect(() => {
        fetchGet(`/api/order-req-data?numb=""&vers=${id}`)
            .then(respJ => {
                setVisa(respJ.map(material => ({ ...material, order_material_id: material.material_id, mat_ass: material.assignment_name })))
            })
            .catch(ex => console.log(ex))
    }, [id, fetchGet])
    const [modalList, setModalList] = useState([])
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
        setModalList(prev => prev.filter(old => old.id !== modalid))
    }

    const handleOfferSelect = (offerId) => {
        setModalList(prev => prev.map(modal => modal.id === offerId ? { ...modal, state: 1 } : modal))
    }
    return (
        visa.length !== 0 &&
        <div style={{ padding: "6rem 1rem 0rem 1rem", flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'row', float: 'right', paddingBottom: '10px' }}>
                {modalList.map((modal, index) => <div key={index} className="priceTags" onClick={() => handleOfferSelect(modal.id)} style={{ cursor: 'pointer' }}>{"Təklif " + (index + 1)}</div>)}
                <BsPlus size='30' onClick={handleClick} style={{ cursor: 'pointer' }} />
            </div>
            <VisaContentMaterials
                orderContent={visa}
                forwardType={1}
            />
            <div style={{ display: 'flex', flexDirection: 'row', float: 'right', paddingTop: '30px' }}>
                <div className="priceButtons">Yönəlt</div>
            </div>

            {
                modalList.map(modal =>
                    <div key={modal.id} style={{ visibility: modal.state === 0.5 ? "hidden" : "" }}>
                        <Suspense fallback="">
                            <ModalAdvanced
                                modalid={modal.id}
                                activeModalRef={activeModalRef}
                                show={modal.state}
                                // ref={modalRef}
                                changeModalState={handleCloseModal}
                                minimizeHandler={minimizeHandler}
                            >
                                <OfferModal
                                    setIsModalVisible={handleCloseModal}
                                    orderContent={visa}
                                    activeModalRef={activeModalRef}
                                    modalid={modal.id}
                                />
                            </ModalAdvanced>
                        </Suspense>
                    </div>
                )
            }
        </div>
    )
}

export default PriceOffers


