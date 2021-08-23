import React, { useCallback, useRef } from 'react'
import NewOfferTableRow from './NewOfferTableRow'

// eslint-disable-next-line
import useFetch from '../../hooks/useFetch';
import { IoIosAdd } from 'react-icons/io'


const NewOfferTableBody = (props) => {

  const fetchPost = useFetch("POST");
  const setChoices = props.setChoices;
  const priorityRef = useRef({ style: { display: 'none' } })
  const handleAddClick = (e) => {
    const id = e.target.id;
    setChoices(prev => {
      const newState = [...prev];
      const index = newState.findIndex(material => material.id.toString() === id);
      if (index !== -1) {
        newState.splice(index + 1, 0, {
          id: Date.now(),
          name: "",
          count: prev[index].color,
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
  // eslint-disable-next-line
  const saveClickHandler = () => {
    const data = props.choices.map((choice, index) => [null, choice.name, index === 0 ? choice.id : null, choice.count, choice.total, choice.alternative, choice.note]);
    fetchPost('/api/update-price-offer', data)
      .then(respJ => {

      }).catch(ex => console.log(ex))
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
        modelid: model.id,
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
          <div style={{ width: '170px', maxWidth: '235px' }}><p>Qiymət</p></div>
          <div><p>Toplam</p></div>
          <div style={{ position: "relative" }}>
            <ul className="priorities-list" style={{ top: "20px", zIndex: "3" }} ref={priorityRef}>
              {
                props.initialMaterials.map((material, index) =>
                  <li className="priority" key={material.id} id={material.id} style={{ padding: "13px 26px" }} onBlur={handleFocusLose} tabIndex={index} onClick={handleAddClick} >{material.material_name}</li>
                )
              }
            </ul>
            <IoIosAdd title="Alternativ əlavə et" tabIndex="0" cursor="pointer" onBlur={handleFocusLose} onClick={priorityClickHandler} size="20" style={{ margin: 'auto' }} /></div>
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
