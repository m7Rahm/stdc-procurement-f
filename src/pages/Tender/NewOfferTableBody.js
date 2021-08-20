import React, { useCallback, useState } from 'react'
import NewOfferTableRow from './NewOfferTableRow'

// eslint-disable-next-line
import useFetch from '../../hooks/useFetch';
import { IoIosAdd } from 'react-icons/io'


const NewOfferTableBody = (props) => {

  const fetchPost = useFetch("POST");
  const setChoices = props.setChoices;

  const handleAddClick = () => {
    setChoices(prev => [...prev, {
      id: Date.now(),
      name: "",
      count: 0,
      note: "",
      price: 0,
      total: 0,
      alternative: 0,
      classname:'new-row',
    }])
  }

  const saveClickHandler = () => {
    const data = props.choices.map((choice, index) => [null, choice.name, index === 0 ? choice.id : null, choice.count, choice.total, choice.alternative, choice.note]);
    fetchPost('/api/update-price-offer', data)
      .then(respJ => {

      }).catch(ex => console.log(ex))
    // setIsModalVisible(0);
  }

  const { orderType, structure } = props.orderInfo;

  // GET PLACES
  // useEffect(() => {
  //   fetchGet(`/api/assignments`)
  //     .then(respJ => setPlaceList(respJ))
  //     .catch(ex => console.log(ex))
  // }, [fetchGet])

  const handleRowDelete = (rowRef) => {
    rowRef.current.classList.add("delete-row");
    // eslint-disable-next-line
    rowRef.current.addEventListener('animationend', () => setChoices(prev => prev.filter(material => material.id != rowRef.current.id)))
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
        id: model.id,
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

  return (
    <>
      <ul className="new-order-table">
        <li>
          <div>#</div>
          <div><p>Ad</p></div>
          <div style={{ maxWidth: '120px' }}><p>Say</p></div>
          <div><p>Qeyd</p></div>
          <div style={{ width: '170px', maxWidth: '235px' }}><p>Qiymət</p></div>
          <div><p>Toplam</p></div>
          <div> <IoIosAdd title="Əlavə et" cursor="pointer" onClick={handleAddClick} size="20" style={{ margin: 'auto' }} /></div>
        </li>
        {
          props.choices.map((offer, index) => {
            return (
              <NewOfferTableRow
                classname={offer.classname}
                index={index}
                orderType={orderType}
                key={offer.id}
                offerid={offer.id}
                price={offer.price}
                offerName={offer.name}
                structure={structure}
                handleRowDelete={handleRowDelete}
                count={offer.count}
                additionalInfo={offer.note}
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
