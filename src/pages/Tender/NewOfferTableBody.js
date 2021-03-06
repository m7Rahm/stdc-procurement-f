import React, { useCallback, useRef } from 'react'
import NewOfferTableRow from './NewOfferTableRow'

// eslint-disable-next-line
import useFetch from '../../hooks/useFetch';
import { IoIosAdd } from 'react-icons/io'


const NewOfferTableBody = (props) => {

  const setChoices = props.setChoices;
  const priorityRef = useRef({ style: { display: 'none' } })
  const handleAddClick = (id) => {
    setChoices(prev => {
      const newState = [...prev];
      const index = newState.findIndex(material => material.material_id === id);
      if (index !== -1) {
        newState.splice(index + 1, 0, {
          id: Date.now(),
          name: "",
          material_id: "",
          count: prev[index].count,
          note: "",
          price: 0,
          total: 0,
          color: prev[index].color,
          alternative: true,
          classname: 'new-row',
        })
      }
      else newState.push({
        id: Date.now(),
        material_id: "",
        name: "",
        count: 0,
        note: "",
        price: 0,
        total: 0,
        color: 0xd2e / (newState.length + 1),
        alternative: true,
        classname: 'new-row',
      })
      return newState
    })
  }

  const { orderType, structure } = props.orderInfo;
  const handleRowDelete = (rowRef) => {
    const id = rowRef.current.id;
    rowRef.current.classList.add("delete-row");
    rowRef.current.addEventListener('animationend', () => setChoices(prev => prev.filter(material => material.id.toString() !== id)))
  }
  const searchByMaterialName = useCallback((value, offerid) => {
    setChoices(prev => (prev.map(offer => offer.id === offerid
      ? {
        ...offer,
        name: value
      }
      : offer
    )
    ));
  }, [setChoices]);

  const handleModelSelection = useCallback((model, offerid) => {
    setChoices(prev => (prev.map(offer => offer.id === offerid
      ? {
        ...offer,
        material_id: model.id,
        name: model.title
      }
      : offer
    )
    ));
  }, [setChoices]);


  const handleChange = useCallback((name, value, offerid, sync = false, op) => {
    if (!sync) {
      // setChoices(prev => prev.map(offer => offer.id === props.choiceid ? { id: props.choiceid, state: offer.state.map(row => row.id === offerid ? { ...row, [name]: value } : row) } : offer))
      setChoices(prev => prev.map(offer => offer.id === offerid ? { ...offer, [name]: value } : offer))
    }
    else
      setChoices(prev => prev.map(offer => offer.id === offerid ? { ...offer, [name]: op === 'inc' ? offer[name] + 1 : offer[name] - 1 } : offer))

  }, [setChoices])
  const priorityClickHandler = () => {
    priorityRef.current.classList.toggle("visible")
  }
  const handleFocusLose = (e) => {
    const relatedTarget = e.relatedTarget;
    if (!relatedTarget || !relatedTarget.classList.contains("priority"))
      priorityRef.current.classList.remove("visible")
  }
  return (
    <>
      <ul className="new-order-table">
        <li style={{ overflow: "visible" }}>
          <div>#</div>
          <div><p>Ad</p></div>
          <div style={{ maxWidth: '120px' }}><p>Say</p></div>
          <div><p>Qeyd</p></div>
          <div style={{ width: '170px', maxWidth: '235px' }}><p>Qiym??t</p></div>
          <div><p>Toplam</p></div>
          <div style={{ position: "relative" }}>
            <ul className="priorities-list" style={{ top: "20px", zIndex: "3" }} ref={priorityRef}>
              {
                props.initialMaterials.map((material, index) =>
                  <li className="priority" key={material.order_material_id} id={material.order_material_id} style={{ padding: "13px 26px" }} onBlur={handleFocusLose} tabIndex={index} onClick={() => handleAddClick(material.material_id)} >{material.title}</li>
                )
              }
            </ul>
            <IoIosAdd title="Alternativ ??lav?? et" tabIndex="0" cursor="pointer" onBlur={handleFocusLose} onClick={priorityClickHandler} size="20" style={{ margin: 'auto' }} /></div>
        </li>
        {
          props.choices.map((material, index) => {
            return (
              <NewOfferTableRow
                classname={material.classname}
                index={index}
                alternative={material.alternative}
                color={material.color}
                handleAddClick={handleAddClick}
                orderType={orderType}
                key={material.id}
                rowid={material.id}
                price={material.price}
                materialid={material.material_id}
                offerName={material.name}
                structure={structure}
                handleRowDelete={handleRowDelete}
                count={material.count}
                additionalInfo={material.note}
                handleChange={handleChange}
                handleModelSelection={handleModelSelection}
                searchByMaterialName={searchByMaterialName}
              />
            )
          })
        }
      </ul>
    </>
  )
}

export default NewOfferTableBody
