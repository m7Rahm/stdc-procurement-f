import React, { useState, useRef } from 'react'
import VisaContentMaterials from '../../components/Common/VisaContentMaterials'
import { Suspense } from 'react'
import { BsPlus } from 'react-icons/bs'
import "../../styles/Orders.css"
import Modal from '../../components/Misc/Modal'
import OfferModal from './OfferModal'

function PriceOffers(props) {
    const { current, canProceed, forwardType, setRemainder, setVisa } = props;
    // const [priceOffers, setPriceOffers] = useState([])
    const modalRef = useRef(null);
    const [modalList, setModalList] = useState(null)
    const [isModalVisible, setIsModalVisible] = useState(0);
    const [choices, setChoices] = useState([{
        id: Date.now(),
        name: "",
        count: 0,
        note: "",
        price: 0,
        total: 0
    }])

    const handleClick = () => {
        setIsModalVisible(true);
        setModalList(prevState => {
            const newList = prevState === null ?
                { all: [], current: null }
                : { ...prevState, current: null }
            return newList;
        })
        if (modalRef.current) {
            modalRef.current.style.animation = "none";
            void modalRef.current.offsetHeight; /* trigger reflow */
            modalRef.current.style.animation = null;
        }
        setChoices([{
            id: Date.now(),
            name: "",
            count: 0,
            note: "",
            price: 0,
            total: 0
        }])
    }

    const handleCloseModal = () => {
        setIsModalVisible(0);
        if (modalList.current !== null) {
            setModalList(prevState => {
                const res = prevState.all.find(emp => emp.id === prevState.current.id);
                const newModals = !res ?
                    { all: [...prevState.all, prevState.current], current: prevState.current }
                    : { all: prevState.all.filter(emp => emp.id !== prevState.current.id), current: null };
                return newModals;
            });
        }
    }

    const minimizeHandler = () => {
        modalRef.current.style.width = "40rem";
        setModalList(prev => {
            if (prev.all.length === 0) {
                const current = { 'id': Date.now(), 'value': choices, name: 0 }
                return { all: [current], current: current }
            } else if (modalList.current === null || !modalList.all.find(modal => modal.id === modalList.current.id)) {
                const current = { 'id': Date.now(), 'value': choices, name: prev.all[prev.all.length - 1].name + 1 }
                return { all: [...prev.all, current], current: current }
            } else {
                return {
                    all: prev.all.map(order =>
                        order.id === modalList.current.id ?
                            { ...order, 'value': choices }
                            : order
                    ), current: null
                }
            }
        })
        setIsModalVisible(0.5);
    }

    const handleOfferSelect = (offerId) => {
        const properties = modalList.all.find(emp => emp.id === offerId)
        setIsModalVisible(1);
        setModalList(prevState => ({ ...prevState, current: properties }))
        setChoices(properties.value)
    }
    // console.log(modalList)
    return (
        <div style={{ padding: "200px", paddingLeft: '250px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', float: 'right', paddingBottom: '30px' }}>
                {modalList && modalList.all.map((modal, index) =>
                    <div key={index} className="priceTags" onClick={() => handleOfferSelect(modal.id)} style={{ cursor: 'pointer' }}>{"Teklif " + (index + 1)}</div>
                )}
                <BsPlus size='40' onClick={handleClick} />
            </div>
            <VisaContentMaterials
                orderContent={current}
                setRemainder={setRemainder}
                canProceed={canProceed}
                forwardType={forwardType}
            />

            <div style={{ display: 'flex', flexDirection: 'row', float: 'right', paddingTop: '30px' }}>
                <div className="priceButtons">ASJD</div>
                <div className="priceButtons">Yonelt</div>
                <div className="priceButtons">Techiz</div>
            </div>

            {
                isModalVisible !== 0 &&
                <div style={{ visibility: isModalVisible === 0.5 ? "hidden" : "" }}>
                    <Suspense fallback="">
                        <Modal
                            minimizable={true} style={{ width: "60rem", minHeight: "30rem", minWidth: "2rem", backgroundColor: "white" }}
                            title={modalList.current !== null ? "Teklif " + (modalList.current.name + 1) : "Yeni Teklif"}
                            ref={modalRef}
                            childProps={{
                                choices: choices,
                                setChoices: setChoices,
                                setIsModalVisible: handleCloseModal,
                                // setOrders: props.setOrders,
                                modalList: modalList,
                                // setSending,
                                // canSeeOtherOrders: props.canSeeOtherOrders
                            }}
                            minimizeHandler={minimizeHandler}
                            changeModalState={handleCloseModal}
                        // wrapperRef={props.wrapperRef}
                        >
                            {OfferModal}
                        </Modal>
                    </Suspense>
                </div>
            }
        </div>
    )
}

export default PriceOffers


