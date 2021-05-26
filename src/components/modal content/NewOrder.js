import React, { useEffect, useState } from 'react'
import NewOrderTableBody from '../Orders/NewOrder/NewOrderTableBody'
// import NewOrderHeader from '../Orders/NewOrder/NewOrderHeader'
import OperationResult from '../../components/Misc/OperationResult'
import { IoIosCloseCircle } from 'react-icons/io'
import useFetch from '../../hooks/useFetch'


const NewOrderContent = (props) => {
  const { orderInfo } = props;
  const [operationResult, setOperationResult] = useState({ visible: false, desc: '' })
  const [glCategories, setGlCategories] = useState({ all: [], parent: [], sub: [] });
  // eslint-disable-next-line
  const fetchGet = useFetch("GET");
  useEffect(() => {
    fetchGet('/api/gl-categories')
      .then(respJ => {
        const parent = respJ.filter(glCategory => glCategory.dependent_id === 0);
        const sub = respJ.filter(glCategory => glCategory.dependent_id !== 0);
        setGlCategories({ all: respJ, parent: parent, sub: sub });
      })
      .catch(ex => console.log(ex))
  }, [fetchGet]);
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
        orderInfo={orderInfo || { orderType: 0, structure: -1 }}
        glCategories={glCategories}
      />
    </div>
  )
}
export default NewOrderContent