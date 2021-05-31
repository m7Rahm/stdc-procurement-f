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
  useEffect(() => {
    props.setMaterials(prev => prev.filter(material => material.isService === orderType))
  }, [orderType])

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
          props.materials.map((material, index) => {
            return (
              <NewOrderTableRow
                setMaterials={props.setMaterials}
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
                setChoices={props.setChoices}
                setPlaceList={setPlaceList}
                placeList={placeList}
                placesListRef={placesListRef}
              />
            )
          })
        }
        <NewOrderTableRowAdd setMaterials={props.setMaterials} />
      </ul>
      {/* <div className="send-order" style={{ cursor: props.active ? 'pointer' : 'not-allowed' }} onClick={onSendClick}>
        Göndər
      </div> */}
    </>
  )
}
export default React.memo(NewOrderTableBody)
