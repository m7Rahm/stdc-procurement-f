import React, { useState, useContext, useRef, useEffect } from 'react'
import { TokenContext } from '../../../App'
import { IoIosAdd } from 'react-icons/io'
import NewOrderTableRow from '../NewOrder/NewOrderTableRow'
import useFetch from '../../../hooks/useFetch'
import { newOrderInitial } from '../../../data/data'


const EditOrder = (props) => {
    const { forwardType, orderContent } = props;
    const tokenContext = useContext(TokenContext)
    const userData = tokenContext[0].userData;
    // const [operationResult, setOperationResult] = useState({ visible: false, desc: '' });
    const [placeList, setPlaceList] = useState([])

    let orders = [];
    if (forwardType === 3)
        orders = orderContent.filter(material => material.techizatci_id === userData.userInfo.structureid)
    else
        orders = orderContent

    const [choices, setChoices] = useState({
        materials: orders.map((material) => ({
            id: Date.now(),
            materialName: material.material_name,
            materialId: material.order_material_id,
            code: material.product_id,
            additionalInfo: material.material_comment,
            class: '',
            count: material.amount,
            isService: 0,
            place: material.mat_ass,
            unit: '1'
        }))
    })
    //     materials: [{
    //       id: Date.now(),
    //       materialName: '',
    //       materialId: '',
    //       code: '',
    //       additionalInfo: '',
    //       class: '',
    //       count: 1,
    //       isService: 0,
    //       place: "",
    //       unit: '1'
    //     }]

    const handleAddClick = () => {
        setChoices(prev => ({ ...prev, materials: [...prev.materials, { ...newOrderInitial.materials[0], id: Date.now(), materialId: Date.now(), class: 'new-row', isService:0 }] }))
    }

    const modelsListRef = useRef(null);
    const placesListRef = useRef(null);

    const fetchGet = useFetch('GET')

    useEffect(() => {
        fetchGet(`/api/assignments`)
            .then(respJ => {
                setPlaceList(respJ)
            })
            .catch(ex => console.log(ex))
    }, [fetchGet, setPlaceList])

    const editClickHandler = () => {
        console.log("sent")
    }

    console.log(choices.materials)
    // console.log(orders)
    return (
        <div>
            <ul className="new-order-table">
                <li>
                    <div>#</div>
                    {/* <div>Sub-Gl Kateqoriya</div> */}
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
                    choices.materials.map((material, index) =>
                        <NewOrderTableRow
                            // setMaterials={props.setMaterials}
                            index={index}

                            orderType={material.isService}
                            material={material}
                            place={material.place}
                            key={material.materialId || material.id}
                            materialid={material.materialId}
                            count={material.count}
                            modelsListRef={modelsListRef}
                            additionalInfo={material.additionalInfo}
                            code={material.code}
                            choices={choices}
                            setChoices={setChoices}
                            setPlaceList={setPlaceList}
                            placeList={placeList}
                            placesListRef={placesListRef}
                        />
                    )
                }
            </ul>
            <div style={{ backgroundColor: 'rgb(244, 180, 0)', float: 'right', padding: '10px 20px', margin: '10px', color: 'white',cursor:'pointer' }}
                onClick={editClickHandler}>
                Göndər
            </div>
        </div>
    )
}

export default EditOrder