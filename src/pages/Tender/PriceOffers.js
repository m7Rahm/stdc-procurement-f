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
const newChoice = {
    id: Date.now(),
    name: "",
    count: 0,
    note: "",
    price: 0,
    total: 0,
    alternative: 0,
}
function PriceOffers(props) {
    const { current, canProceed, forwardType, setRemainder } = props;
    const modalRef = useRef(null);
    const [modalList, setModalList] = useState({ all: [], actives: [] })
    const [isModalVisible, setIsModalVisible] = useState(0);
    const activeModalRef = useRef(0);
    const [choices, setChoices] = useState([])
    const [offerInfo, setOfferInfo] = useState({ company: "", voen: "" })

    const [selectedModals, setSelectedModals] = useState([])
    const fetchPost = useFetch("POST");
    const webSocket = useContext(WebSocketContext)
    const handleClick = () => {
        setIsModalVisible(true);

        if (modalRef.current) {
            modalRef.current.style.top = (parseInt(window.getComputedStyle(modalRef.current).getPropertyValue("top").substring(0, 3)) + 15) + "px";
            modalRef.current.style.left = (parseInt(window.getComputedStyle(modalRef.current).getPropertyValue("left").substring(0, 3)) + 15) + "px";
        }
        // console.log(modalRef.current);
        const id = Date.now();
        setModalList(prev => {
            return {
                all: [...prev.all, { id: id, name: "", state: 1 }],
                actives: [...prev.actives, { id: id, name: "", state: 1 }]
            }
        })
        const newCh = { id, state: { ...newChoice, id: Date.now() } };
        setChoices(prev => [...prev, newCh])
    }

    const minimizeHandler = () => {
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
        setIsModalVisible(0.5);
    }

    const handleCloseModal = (modalid) => {
        setIsModalVisible(0);

        // if (modalList.current !== null) {
        //     setModalList(prevState => {
        //         const res = prevState.all.find(emp => emp.id === prevState.current.id);
        //         const newModals = !res ?
        //             { all: [...prevState.all, prevState.current], current: prevState.current }
        //             : { all: prevState.all.filter(emp => emp.id !== prevState.current.id), current: null };
        //         return newModals;
        //     });
        // }

        setModalList(prev => {
            const res = prev.all.filter(old => old.id === modalid);
            const res2 = prev.actives.filter(old => old.id === modalid);
            return {
                all: [...res, { state: 0.5 }],
                actives: [...res2,{state:0.5}]
                }
        })
    }

    const handleOfferSelect = (offerId) => {
        const properties = modalList.all.find(emp => emp.id === offerId)
        setIsModalVisible(1);
        setModalList(prevState => ({ ...prevState, current: properties }))
        setChoices(properties.value)


        setSelectedModals(prev => {
            if (selectedModals.find(emp => emp.id === offerId))
                return prev.map(modal => modal.id === offerId ?
                    [...modal, properties.value]
                    : modal)
            else return [...prev, [properties.value]]
        })
    }

    // console.log(selectedModals)

    const saveClickHandler = () => {
        const data = choices.map((choice, index) => [null, choice.name, index === 0 ? choice.id : null, choice.count, choice.total, choice.alternative, choice.note]);
        console.log(data)
        fetchPost('/api/update-price-offer', data)
            .then(respJ => {

            }).catch(ex => console.log(ex))
        setIsModalVisible(0);
    }


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
                modalList.actives.map(modal =>
                (<div key={modal.id} style={{ visibility: modal.state === 0.5 ? "hidden" : "" }}>
                    <Suspense fallback="">
                        {/* {selectedModals.map((modal,index)=>{ return( */}
                        <ModalAdvanced
                            modalid={modal.id}
                            activeModalRef={activeModalRef}
                            show={modal.state}
                            ref={modalRef}
                            changeModalState={handleCloseModal}
                            minimizeHandler={minimizeHandler}
                        >
                            <OfferModal
                                choices={choices.find(choice => choice.id === modal.id).state}
                                setChoices={setChoices}
                                offerInfo={offerInfo}
                                setOfferInfo={setOfferInfo}
                                setIsModalVisible={handleCloseModal}
                                saveClickHandler={saveClickHandler}
                                orderContent={current}
                                handleInfoChange={handleInfoChange}
                            />
                        </ModalAdvanced>
                        {/* )})} */}

                    </Suspense>
                </div>
                ))
            }
        </div>
    )
}

export default PriceOffers


