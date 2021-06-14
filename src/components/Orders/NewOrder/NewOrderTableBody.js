import React, { useEffect, useRef } from 'react'
import NewOrderTableRow from './NewOrderTableRow'
import useFetch from '../../../hooks/useFetch';
import { IoIosAdd } from 'react-icons/io'
import { newOrderInitial } from '../../../data/data'

const NewOrderTableBody = (props) => {
const fetchGet = useFetch("GET");
const modelsListRef = useRef(null);
const placesListRef = useRef(null);
const handleAddClick = () => {
  props.setChoices(prev => ({...prev,materials:[...prev.materials, {...newOrderInitial.materials[0], id: Date.now(), class: 'new-row'}]}))
}

  const { orderInfo,
    //  handleSendClick 
  } = props;
  const { orderType, structure } = orderInfo;

  // const onSendClick = () => {
  //   handleSendClick(materials)
  // }
  const setChoices = props.setChoices;
  useEffect(() => {
    // props.setMaterials(prev => prev.filter(material => material.isService === orderType))
    // props.setChoices(prev=>prev.materials.filter(material => material.isService === orderType))
    setChoices(prev=>({...prev,materials:prev.materials.filter(material => material.isService === orderType)}))
  }, [orderType,setChoices])

  const setPlaceList = props.setPlaceList;
  useEffect(()=>{
    fetchGet(`/api/assignments`)
    .then(respJ => {
      setPlaceList(respJ)
    })
    .catch(ex => console.log(ex))
  }, [fetchGet,setPlaceList])

  return (
    <>
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
          props.choices.materials.map((material, index) => {
            return (
              <NewOrderTableRow
                // setMaterials={props.setMaterials}
                index={index}
                orderType={orderType}
                material={material}
                place={material.place}
                key={material.id}
                materialid={material.id}
                className={material.class}
                structure={structure}
                count={material.count}
                modelsListRef={modelsListRef}
                additionalInfo={material.additionalInfo}
                department={material.department}
                tesvir={material.tesvir}

                choices={props.choices}
                setChoices={setChoices}
                setPlaceList={props.setPlaceList}
                placeList={props.placeList}
                placesListRef={placesListRef}
              />
            )
          })
        }
        {/* <NewOrderTableRowAdd setChoices={props.setChoices} /> */}
      </ul>
      {/* <div className="send-order" style={{ cursor: props.active ? 'pointer' : 'not-allowed' }} onClick={onSendClick}>
        Göndər
      </div> */}
    </>
  )
}
export default React.memo(NewOrderTableBody)
