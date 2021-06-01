import React, { useEffect, useRef, useState } from 'react'
import NewOrderTableRow from './NewOrderTableRow'
import NewOrderTableRowAdd from './NewOrderTableRowAdd'
import useFetch from '../../../hooks/useFetch';

const NewOrderTableBody = (props) => {
const fetchGet = useFetch("GET");
const modelsListRef = useRef(null);
const placesListRef = useRef(null);
const [placeList, setPlaceList] = useState([])

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

  useEffect(()=>{
    fetchGet(`/api/departments`)
    .then(respJ => {
      // console.log(respJ)
      setPlaceList(respJ)
    })
    .catch(ex => console.log(ex))
  }, [fetchGet])

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
          <div></div>
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

                choices={props.choices}
                setChoices={setChoices}
                setPlaceList={setPlaceList}
                placeList={placeList}
                placesListRef={placesListRef}
              />
            )
          })
        }
        <NewOrderTableRowAdd setChoices={props.setChoices} />
      </ul>
      {/* <div className="send-order" style={{ cursor: props.active ? 'pointer' : 'not-allowed' }} onClick={onSendClick}>
        Göndər
      </div> */}
    </>
  )
}
export default React.memo(NewOrderTableBody)
