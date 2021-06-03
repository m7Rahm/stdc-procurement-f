import React, { useState } from 'react'
import NewOrderTableBody from '../Orders/NewOrder/NewOrderTableBody'
// import NewOrderHeader from '../Orders/NewOrder/NewOrderHeader'
import OperationResult from '../../components/Misc/OperationResult'
import { IoIosCloseCircle } from 'react-icons/io'

const NewOrderContent = (props) => {
  const { orderInfo } = props;
  const [operationResult, setOperationResult] = useState({ visible: false, desc: '' })
  // eslint-disable-next-line
  const [glCategories, setGlCategories] = useState({ all: [], parent: [], sub: [] });
  // eslint-disable-next-line
  return (
    <div className="modal-content-new-order">
      {
        operationResult.visible &&
        <OperationResult
          setOperationResult={setOperationResult}
          operationDesc={operationResult.desc}
          backgroundColor="whitesmoke"
          icon={IoIosCloseCircle}
        />
      }
      {/* <NewOrderHeader
        orderInfo={orderInfo}
        setOrderInfo={setOrderInfo}
      /> */}
      <NewOrderTableBody
        placeList={props.placeList}
        setPlaceList={props.setPlaceList}
        orderInfo={orderInfo}
        glCategories={glCategories}
        choices={props.choices}
        setChoices={props.setChoices}
        materials={props.materials}
        setMaterials={props.setMaterials}
      />
    </div>
  )
}
export default NewOrderContent