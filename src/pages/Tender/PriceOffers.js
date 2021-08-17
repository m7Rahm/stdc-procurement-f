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
    // const [priceOffers, setPriceOffers] = useState([])
    const modalRef = useRef(null);
    const [modalList, setModalList] = useState(null)
    const [isModalVisible, setIsModalVisible] = useState(0);
    const activeModalRef = useRef(0);
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
        if (modalRef.current) {
            // const newTop = (parseInt(modalRef.current.style.top.substring(0,2))+2)+"rem"
            // console.log(newTop)
            console.log(modalRef.current.style.top)
            console.log(window.getComputedStyle(modalRef.current).getPropertyValue("top"))
            console.log((parseInt(window.getComputedStyle(modalRef.current).getPropertyValue("top").substring(0, 3)) + 10) + "px")
            modalRef.current.style.top = (parseInt(window.getComputedStyle(modalRef.current).getPropertyValue("top").substring(0, 3)) + 15) + "px";
            modalRef.current.style.left = (parseInt(window.getComputedStyle(modalRef.current).getPropertyValue("left").substring(0, 3)) + 15) + "px";
            // console.log((parseInt(modalRef.current.style.top.substring(0,2))+2)+"rem")
        }

        setModalList(prevState => {
            const newList = prevState === null ?
                { all: [], current: null }
                : { ...prevState, current: null }
            return newList;
        })

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
        // modalRef.current.style.width = "40rem";
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
        <div style={{ padding: "4rem 1rem", flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'row', float: 'right', paddingBottom: '10px' }}>
                {modalList && modalList.all.map((modal, index) =>
                    <div key={index} className="priceTags" onClick={() => handleOfferSelect(modal.id)} style={{ cursor: 'pointer' }}>{"Təklif " + (index + 1)}</div>
                )}
                <BsPlus size='40' onClick={handleClick} style={{ cursor: 'pointer' }} />
            </div>
            <VisaContentMaterials
                orderContent={current}
                setRemainder={setRemainder}
                canProceed={canProceed}
                forwardType={forwardType}
            />

            <div style={{ display: 'flex', flexDirection: 'row', float: 'right', paddingTop: '30px' }}>
                <div className="priceButtons">ASJD</div>
                <div className="priceButtons">Yönəlt</div>
                <div className="priceButtons">Təchiz</div>
            </div>

            {
                isModalVisible !== 0 &&
                <div style={{ visibility: isModalVisible === 0.5 ? "hidden" : "" }}>
                    <Suspense fallback="">
                        {/* <Modal
                            minimizable={true} style={{ width: "60rem", minHeight: "30rem", minWidth: "2rem", backgroundColor: "white" }}
                            title={modalList.current !== null ? "Təklif " + (modalList.current.name + 1) : "Yeni Təklif"}
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
                        </Modal> */}

                        <div>
                            <ModalAdvanced
                                // ref={modalRef}
                                activeModalRef={activeModalRef}
                                show={isModalVisible}
                                changeModalState={handleCloseModal}
                                minimizeHandler={minimizeHandler}
                            >
                                <OfferModal
                                    choices={choices}
                                    setChoices={setChoices}
                                    setIsModalVisible={handleCloseModal}
                                    modalList={modalList}
                                />
                            </ModalAdvanced>

                            <ModalAdvanced
                                // ref={modalRef}
                                activeModalRef={activeModalRef}
                                show={isModalVisible}
                                changeModalState={handleCloseModal}
                                minimizeHandler={minimizeHandler}
                            // style={{top:'10rem', left:'44rem'}}
                            >
                                <OfferModal
                                    choices={choices}
                                    setChoices={setChoices}
                                    setIsModalVisible={handleCloseModal}
                                    modalList={modalList}
                                />
                            </ModalAdvanced>
                        </div>


                    </Suspense>
                </div>
            }
        </div>
    )
}

export default PriceOffers


