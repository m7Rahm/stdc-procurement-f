import React, { useState, useContext, useRef, useEffect, useCallback } from 'react'
import { IoIosAdd } from 'react-icons/io'
import NewOrderTableRow from '../NewOrder/NewOrderTableRow'
import useFetch from '../../../hooks/useFetch'
import { newOrderInitial } from '../../../data/data'
import { WebSocketContext } from '../../../pages/SelectModule'


const EditOrder = (props) => {
    const { orderContent } = props;
    // const [operationResult, setOperationResult] = useState({ visible: false, desc: '' });
    const [placeList, setPlaceList] = useState([])
    const fetchPost = useFetch('POST')
    const webSocket = useContext(WebSocketContext);
    const modelsListRef = useRef(null);
    const placesListRef = useRef(null);
    const fetchGet = useFetch('GET');
    const [choices, setChoices] = useState(
        orderContent.map(material => ({
            id: material.order_material_id,
            materialName: material.material_name,
            materialId: material.material_id,
            code: material.product_id,
            additionalInfo: material.material_comment,
            class: '',
            count: material.amount,
            isService: 0,
            place: material.mat_ass,
            placeid: material.mat_ass_id,
            unit: '1',
            tesvir: material.description
        }))
    );
    const handleAddClick = () => {
        newOrderInitial.materials[0].id = Date.now();
        newOrderInitial.materials[0].class = 'new-row';
        newOrderInitial.materials[0].isService = orderContent[0].order_type;
        newOrderInitial.materials[0].tesvir = "";
        setChoices(prev => ([...prev, { ...newOrderInitial.materials[0] }]))
    }
    useEffect(() => {
        fetchGet(`/api/assignments`)
            .then(respJ => {
                setPlaceList(respJ)
            })
            .catch(ex => console.log(ex))
    }, [fetchGet, setPlaceList])
    const editClickHandler = () => {
        // eslint-disable-next-line
        let error = "";
        if (choices.find(material => material.name === ""))
            error = "Məhsul seçimi düzgün aparılmamışdır"
        else if (choices.find(material => material.place === ""))
            // eslint-disable-next-line
            error = "Istifadə yeri düzgün göstərilməmişdir"
        else {
            const data = {
                mats: choices.map(material =>
                    [material.materialId, material.materialName, material.count, material.placeid, material.place, material.additionalInfo, material.tesvir]
                ),
                edit: 1,
                ordNumb: orderContent[0].ord_numb,
                orderType: orderContent[0].order_type,
                orderid: orderContent[0].related_order_id || orderContent[0].order_id,
                currentOrderid: orderContent[0].order_id
            };
            props.setSending(true);
            props.setModalContent(prev => ({ ...prev, visible: false }));
            fetchPost(`/api/new-order`, data)
                .then(_ => {
                    const message = {
                        message: "notification",
                        receivers: [{ id: orderContent[0].sender_id, notif: "oR" }],
                        data: undefined
                    }
                    props.setVisa(prev => prev.map((row, index) => index === 0 ? ({ ...row, result: 2, act_date_time: "Indicə" }) : row))
                    props.setSending(false);
                    webSocket.send(JSON.stringify(message))
                })
                .catch(ex => {
                    console.log(ex);
                    props.setOperationStateText({ text: "Xəta baş verdi", orderid: orderContent[0].order_id, initid: orderContent[0].sender_id })
                })
        }
    }
    const handleRowDelete = useCallback((rowRef) => {
        rowRef.current.classList.add("delete-row");
        // eslint-disable-next-line
        rowRef.current.addEventListener('animationend', () => setChoices(prev => prev.filter(material => material.id != rowRef.current.id)))
    }, []);
    const searchByMaterialName = useCallback((value, materialid) => {
        setChoices(prev => prev.map(material => material.id === materialid
            ? {
                ...material,
                materialId: null,
                materialName: value,
                approx_price: '',
                code: '',
                department: '',
                isAmortisized: '',
                percentage: ''
            }
            : material
        ));
    }, []);
    const handlePlaceSearch = useCallback((value, materialid) => {
        setChoices(prev => prev.map(material => material.id === materialid ? { ...material, place: value } : material))
    }, []);
    const handleChange = useCallback((name, value, materialid, sync = false, op) => {
        if (!sync)
            setChoices(prev => prev.map(material => material.id === materialid ? { ...material, [name]: value } : material))
        else
            setChoices(prev => prev.map(material => material.id === materialid ? { ...material, [name]: op === "inc" ? material[name] + 1 : material[name] - 1 } : material))
    }, [])
    const handleModelSelection = useCallback((model, materialid) => {
        setChoices(prev => prev.map(material => material.id === materialid
            ? {
                ...material,
                materialId: model.id,
                materialName: model.title,
                approx_price: model.approx_price,
                code: model.product_id,
                department: model.department_name,
                isAmortisized: model.is_amortisized,
                percentage: model.perc
            }
            : material
        ))
    }, []);
    const handlePlaceSelection = useCallback((place, materialid) => {
        setChoices(prev => prev.map(material => material.id === materialid
            ? {
                ...material,
                place: place.name,
                placeid: place.id
            }
            : material)
        )
    }, []);
    const setCode = useCallback((material, materialid) => {
        setChoices(prev => prev.map(prevMaterial => prevMaterial.id === materialid
            ? {
                ...prevMaterial,
                code: material.product_id,
                approx_price: material.approx_price,
                department: material.department_name,
                materialId: material.id
            }
            : prevMaterial)
        );
    }, [])
    return (
        <div>
            <ul className="new-order-table">
                <li>
                    <div>#</div>
                    <div>Məhsul</div>
                    <div style={{ width: '170px', maxWidth: '235px' }}>Kod</div>
                    <div style={{ maxWidth: '120px' }}>Say</div>
                    <div style={{ width: '170px', maxWidth: '150px' }}>Ölçü vahidi</div>
                    <div>İstifadə yeri</div>
                    <div>Əlavə məlumat</div>
                    <div>Təsvir</div>
                    <div> <IoIosAdd title="Əlavə et" cursor="pointer" onClick={handleAddClick} size="20" style={{ margin: 'auto' }} /></div>
                </li>
                {
                    choices.map((material, index) =>
                        <NewOrderTableRow
                            index={index}
                            orderType={material.isService}
                            place={material.place}
                            className={material.class}
                            key={material.id}
                            materialName={material.materialName}
                            materialid={material.id}
                            count={material.count}
                            modelsListRef={modelsListRef}
                            additionalInfo={material.additionalInfo}
                            code={material.code}
                            choices={choices}
                            handleChange={handleChange}
                            searchByMaterialName={searchByMaterialName}
                            tesvir={material.tesvir}
                            setChoices={setChoices}
                            setPlaceList={setPlaceList}
                            placeList={placeList}
                            handlePlaceSearch={handlePlaceSearch}
                            placesListRef={placesListRef}
                            setCode={setCode}
                            handlePlaceSelection={handlePlaceSelection}
                            handleModelSelection={handleModelSelection}
                            handleRowDelete={handleRowDelete}
                        />
                    )
                }
            </ul>
            <div style={{ backgroundColor: 'rgb(244, 180, 0)', float: 'right', padding: '10px 20px', margin: '10px 20px', color: 'white', cursor: 'pointer' }}
                onClick={editClickHandler}>
                Göndər
            </div>
        </div>
    )
}

export default EditOrder