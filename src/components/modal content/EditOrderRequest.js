import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { IoIosAdd, IoIosArrowBack } from 'react-icons/io';
import OperationResult from '../Misc/OperationResult';
import useFetch from '../../hooks/useFetch';
import NewOrderTableRow from '../Orders/NewOrder/NewOrderTableRow';
import { WebSocketContext } from '../../pages/SelectModule';

const EditOrderRequest = (props) => {
    const { version, onSendClick, view } = props;
    const ordNumb = props.current || props.ordNumb;
    const textareaRef = useRef(null);
    const [orderState, setOrderState] = useState([]);
    const [operationResult, setOperationResult] = useState({ visible: false, desc: '' });
    const [placeList, setPlaceList] = useState([]);
    const fetchGet = useFetch("GET");
    const fetchPost = useFetch('POST')
    const webSocket = useContext(WebSocketContext);
    const orderType = useRef(undefined);
    useEffect(() => {
        fetchGet(`/api/order-req-data?numb=${ordNumb}&vers=${version}`)
            .then(respJ => {
                const orderRows = respJ.map(row => ({
                    ...row,
                    models: [],
                    className: '',
                    materialid: row.material_id,
                    count: row.amount,
                    additionalInfo: row.material_comment
                }));
                orderType.current = respJ[0].order_type;
                setOrderState(orderRows);
            })
            .catch(ex => console.log(ex))
    }, [ordNumb, version, fetchGet, orderType]);
    useEffect(() => {
        fetchGet(`/api/assignments`)
            .then(respJ => setPlaceList(respJ))
            .catch(ex => console.log(ex))
    }, [fetchGet])

    const handleSendClick = () => {
        if (orderState.find(material => material.title.trim() === "")) {
            setOperationResult({ visible: true, desc: "Məhsul seçimi düzgün deyil" })
        }
        else if(orderState.find(material => material.assignment_name.trim() === "")){
            setOperationResult({ visible: true, desc: "Istifadə yeri düzgün göstərilməmişdir" })
        }
        else{
            const data = {
                mats: orderState.map(material =>
                    [material.material_id, material.title, material.count, material.assignment_id, material.assignment_name, material.material_comment, material.description]
                ),
                returned: 1,
                ordNumb: ordNumb,
                orderType: orderType.current,
                orderid: orderState[0].related_order_id
            };
            props.closeModal()
            // console.log(orderState)

            fetchPost(`/api/new-order`, data)
            .then(_ => {
                const message = {
                    message: "notification",
                    receivers: [{ id: orderState[0].emp_id, notif: "oR" }],
                    data: undefined
                }
                webSocket.send(JSON.stringify(message))
            })
            .catch(ex => {
                console.log(ex);
            })
        }

    }
    const handleAddClick = () => {
        setOrderState(prev => [...prev, {
            id: Date.now(),
            models: [],
            className: 'new-row',
            count: 1,
            title: '',
            material_id: '',
            material_comment: '',
            tesvir: "",
            orderType: orderType.current
        }])
    }
    const handleRowDelete = (rowRef) => {
        rowRef.current.classList.add("delete-row");
        rowRef.current.addEventListener('animationend', () => setOrderState(prev => prev.materials.filter(material => material.id !== rowRef.current.id)))
    }
    const searchByMaterialName = useCallback((value, materialid) => {
        setOrderState(prev => prev.map(material => material.id === materialid
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
        )
        );
    }, []);
    const handlePlaceSearch = useCallback((value, materialid) => {
        setOrderState(prev => prev.map(material => material.id === materialid ? { ...material, place: value } : material));
    }, []);
    const handleChange = useCallback((name, value, materialid, sync = false, op) => {
        if (!sync)
            setOrderState(prev => prev.map(material => material.id === materialid ? { ...material, [name]: value } : material))
        else
            setOrderState(prev => prev.map(material => material.id === materialid ? { ...material, [name]: op === 'inc' ? material[name] + 1 : material[name] - 1 } : material))
    }, [])
    const handleModelSelection = useCallback((model, materialid) => {
        setOrderState(prev => prev.map(material => material.id === materialid
            ? {
                ...material,
                materialid: model.id,
                title: model.title,
                product_id: model.product_id,
            }
            : material
        ));
    }, []);
    const handlePlaceSelection = useCallback((place, materialid) => {
        setOrderState(prev => prev.map(material => material.id === materialid
            ? {
                ...material,
                assignment_name: place.name,
                placeid: place.id
            }
            : material
        ));
    }, []);
    const setCode = useCallback((material, materialid) => {
        setOrderState(prev => prev.map(prevMaterial => prevMaterial.id === materialid
            ? {
                ...prevMaterial,
                product_id: material.product_id,
                materialId: material.id
            }
            : prevMaterial
        ));
    }, [])
    return (
        <>
            {props.navBack &&
                <div>
                    <span onClick={props.handleBackClick} style={{ float: "left", marginLeft: "10px", cursor: "pointer" }}>
                        <IoIosArrowBack size="3rem" />
                    </span>
                    <span onClick={handleSendClick} 
                        style={{ float: "right", cursor: "pointer",backgroundColor: 'rgb(244, 180, 0)',color:'white',padding: '10px 20px', margin: '10px 20px' }}>
                        Gönder
                    </span>
                </div>
            }
            {orderState.length !== 0 &&
                <div className="modal-content-new-order">
                    {
                        operationResult.visible &&
                        <OperationResult
                            setOperationResult={setOperationResult}
                            operationDesc={operationResult.desc}
                        />
                    }
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
                            <div> {view === 'returned' && <IoIosAdd title="Əlavə et" cursor="pointer" onClick={handleAddClick} size="20" style={{ margin: 'auto' }} />}</div>
                        </li>
                        {
                            orderState.map((row, index) =>
                                <NewOrderTableRow
                                    index={index}
                                    orderType={orderType.current}
                                    place={row.assignment_name}
                                    key={row.id}
                                    materialName={row.title}
                                    materialid={row.materialid}
                                    className={row.className}
                                    handleRowDelete={handleRowDelete}
                                    count={row.count}
                                    additionalInfo={row.additionalInfo}
                                    department={row.department}
                                    tesvir={row.description}
                                    setPlaceList={props.setPlaceList}
                                    placeList={placeList}
                                    code={row.product_id}
                                    setCode={setCode}
                                    handlePlaceSelection={handlePlaceSelection}
                                    handleChange={handleChange}
                                    handleModelSelection={handleModelSelection}
                                    handlePlaceSearch={handlePlaceSearch}
                                    searchByMaterialName={searchByMaterialName}
                                />
                            )
                        }
                    </ul>
                    {
                        view === 'returned1' && orderState.length !== 0 &&
                        <textarea ref={textareaRef} disabled={true} defaultValue={orderState[0].review} style={{ margin: '20px' }}>
                        </textarea>
                    }
                </div>
            }
        </>
    )
}
export default EditOrderRequest