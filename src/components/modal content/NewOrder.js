import React from 'react'
import NewOrderTableBody from '../Orders/NewOrder/NewOrderTableBody'
import OperationResult from '../../components/Misc/OperationResult'
import { IoIosCloseCircle } from 'react-icons/io'

const NewOrderContent = (props) => {
  const { orderInfo } = props;
  return (
    <div className="modal-content-new-order">
      {
        props.operationResult.visible &&
        <OperationResult
          setOperationResult={props.setOperationResult}
          operationDesc={props.operationResult.desc}
          backgroundColor="whitesmoke"
          detailes={props.operationResult.details}
          icon={IoIosCloseCircle}
        />
      }
      <NewOrderTableBody
        orderInfo={orderInfo}
        choices={props.choices}
        setChoices={props.setChoices}
        materials={props.materials}
        setMaterials={props.setMaterials}
      />
    </div>
  )
}
export default NewOrderContent