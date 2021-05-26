import React, { useEffect, useRef, useState } from 'react'
import NewOrderTableRow from './NewOrderTableRow'
import NewOrderTableRowAdd from './NewOrderTableRowAdd'
const NewOrderTableBody = (props) => {
  const modelsListRef = useRef(null);
  const { orderInfo,
    //  handleSendClick 
  } = props;
  const { orderType, structure } = orderInfo;
  const [materials, setMaterials] = useState([
    {
      id: Date.now(),
      materialId: '',
      code: '',
      approx_price: 0,
      additionalInfo: '',
      class: '',
      count: 1,
      isService: 0
    }
  ]);
  // const onSendClick = () => {
  //   handleSendClick(materials)
  // }
  useEffect(() => {
    setMaterials(prev => prev.filter(material => material.isService === orderType))
  }, [orderType])
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
          materials.map((material, index) => {
            return (
              <NewOrderTableRow
                setMaterials={setMaterials}
                index={index}
                orderType={orderType}
                material={material}
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
              />
            )
          })
        }
        <NewOrderTableRowAdd setMaterials={setMaterials} />
      </ul>
      {/* <div className="send-order" style={{ cursor: props.active ? 'pointer' : 'not-allowed' }} onClick={onSendClick}>
        Göndər
      </div> */}
    </>
  )
}
export default React.memo(NewOrderTableBody)
