import React, { useState, useRef } from 'react'
import VisaContentMaterials from '../../components/Common/VisaContentMaterials'
import { Suspense } from 'react'
import { BsPlus } from 'react-icons/bs'
import "../../styles/Orders.css"
// import Modal from '../../components/Misc/Modal'
import OfferModal from './OfferModal'
import ModalAdvanced from './ModalAdvanced'

function PriceOffers(props) {
    const { current, canProceed, forwardType, setRemainder } = props;
    // const modalRef = useRef(null);
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
        <div style={{ padding: "4rem 1rem", flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'row', float: 'right', paddingBottom: '10px' }}>
                {modalList.map((modal, index) => <div key={index} className="priceTags" onClick={() => handleOfferSelect(modal.id)} style={{ cursor: 'pointer' }}>{"Təklif " + (index + 1)}</div>)}
                <BsPlus size='40' onClick={handleClick} style={{ cursor: 'pointer' }} />
            </div>
            <VisaContentMaterials
                orderContent={current}
                setRemainder={setRemainder}
                canProceed={canProceed}
                forwardType={forwardType}
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
                                    orderContent={current}
                                    activeModalRef={activeModalRef}
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


