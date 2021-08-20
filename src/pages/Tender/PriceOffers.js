import React, { useState, useRef, useContext } from 'react'
import VisaContentMaterials from '../../components/Common/VisaContentMaterials'
import { Suspense } from 'react'
import { BsPlus } from 'react-icons/bs'
import "../../styles/Orders.css"
// import Modal from '../../components/Misc/Modal'
import OfferModal from './OfferModal'
import ModalAdvanced from './ModalAdvanced'
import useFetch from '../../hooks/useFetch'
import { WebSocketContext } from '../SelectModule'

function PriceOffers(props) {
    const { current, canProceed, forwardType, setRemainder } = props;
    // const modalRef = useRef(null);
    const [modalList, setModalList] = useState({ all: [], actives: [] })
    const [isModalVisible, setIsModalVisible] = useState(0);
    const activeModalRef = useRef(0);
    const [offerInfo, setOfferInfo] = useState({ company: "", voen: "" })

    const [selectedModals, setSelectedModals] = useState([])
    const fetchPost = useFetch("POST");
    const webSocket = useContext(WebSocketContext)
    const handleClick = () => {
        setIsModalVisible(true);

        if (activeModalRef.current) {
            activeModalRef.current.style.top = (parseInt(window.getComputedStyle(activeModalRef.current).getPropertyValue("top").substring(0, 3)) + 15) + "px";
            activeModalRef.current.style.left = (parseInt(window.getComputedStyle(activeModalRef.current).getPropertyValue("left").substring(0, 3)) + 15) + "px";
        }
        // console.log(modalRef.current);
        const id = Date.now();
        setModalList(prev => {
            return {
                all: [...prev.all, { id: id, name: "", state: 1 }],
                actives: [...prev.actives, { id: id, name: "", state: 1 }]
            }
        })
        // const newCh = { id, state: [{ ...newChoice, id: Date.now() }] };
        // setChoices(prev => [...prev, newCh])
    }

    const minimizeHandler = (modalid) => {
        // modalRef.current.style.width = "40rem";
        // setModalList(prev => {
        //     if (prev.all.length === 0) {
        //         const current = { 'id': Date.now(), 'value': choices, name: 0 }
        //         return { all: [current], current: current }
        //     } else if (modalList.current === null || !modalList.all.find(modal => modal.id === modalList.current.id)) {
        //         const current = { 'id': Date.now(), 'value': choices, name: prev.all[prev.all.length - 1].name + 1 }
        //         return { all: [...prev.all, current], current: current }
        //     } else {
        //         return {
        //             all: prev.all.map(order =>
        //                 order.id === modalList.current.id ?
        //                     { ...order, 'value': choices }
        //                     : order
        //             ), current: null
        //         }
        //     }
        // })
        setModalList(prev => ({
            all: prev.all.map(modal =>
                modal.id === modalid ?
                    { ...modal, state: 0.5 }
                    : modal
            ),
            actives: prev.actives.map(modal =>
                modal.id === modalid ?
                    { ...modal, state: 0.5 } :
                    modal)
        }))
        setIsModalVisible(0.5);
    }

    const handleCloseModal = (modalid) => {
        setIsModalVisible(0);
        setModalList(prev => {
            const res = prev.all.filter(old => old.id !== modalid);
            const res2 = prev.actives.filter(old => old.id !== modalid);
            return {
                all: [...res],
                actives: [...res2]
            }
        })
    }

    const handleOfferSelect = (offerId) => {
        const properties = modalList.all.find(emp => emp.id === offerId)
        setModalList(prev=>({
            all:prev.all,
            actives:prev.actives.map(modal=>
                modal.id===offerId?
                {...modal,state:1 }:
                modal)
        }))
    }

    // console.log(selectedModals)


    const handleInfoChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setOfferInfo(prev => ({ ...prev, [name]: value }))
    }

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
                modalList.actives.map(modal => {
                    {/* const choice = choices.find(choice => choice.id === modal.id) */}
                    return (
                        <div key={modal.id} style={{ visibility: modal.state === 0.5 ? "hidden" : "" }}>
                            <Suspense fallback="">
                                {/* {selectedModals.map((modal,index)=>{ return( */}
                                <ModalAdvanced
                                    modalid={modal.id}
                                    activeModalRef={activeModalRef}
                                    show={modal.state}
                                    // ref={modalRef}
                                    changeModalState={handleCloseModal}
                                    minimizeHandler={minimizeHandler}
                                >
                                    <OfferModal
                                        // choices={choice.state}
                                        // choiceid={choice.id}
                                        // setChoices={setChoices}
                                        offerInfo={offerInfo}
                                        setOfferInfo={setOfferInfo}
                                        setIsModalVisible={handleCloseModal}
                                        // saveClickHandler={saveClickHandler}
                                        orderContent={current}
                                        handleInfoChange={handleInfoChange}
                                    />
                                </ModalAdvanced>
                                {/* )})} */}

                            </Suspense>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default PriceOffers


