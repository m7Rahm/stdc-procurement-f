import React, { useEffect, useState, useCallback } from 'react'
import NewOfferTableRow from './NewOfferTableRow'
import useFetch from '../../hooks/useFetch';
import { IoIosAdd } from 'react-icons/io'
import { newOfferInitial } from '../../data/data';

const NewOfferTableBody = (props) => {
  const fetchGet = useFetch("GET");
  const handleAddClick = () => {
    props.setChoices(prev=> [...prev, {
      id: Date.now(),
      name: "",
      count: 0,
      note: "",
      price: 0,
      total: 0
  }])
  }
  const { orderType, structure } = props.orderInfo;

  // const [placeList, setPlaceList] = useState([])
  const setChoices = props.setChoices;
  // useEffect(() => {
  //   setChoices(prev => ({ ...prev, materials: prev.materials.filter(material => material.isService === orderType) }))
  // }, [orderType, setChoices])


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
  // const searchByMaterialName = useCallback((value, materialid) => {
  //   setChoices(prev => ({
  //     ...prev, materials: prev.materials.map(material => material.id === materialid
  //       ? {
  //         ...material,
  //         materialId: null,
  //         materialName: value,
  //         approx_price: '',
  //         code: '',
  //         department: '',
  //         isAmortisized: '',
  //         percentage: ''
  //       }
  //       : material
  //     )
  //   }));
  // }, [setChoices]);


  // const handlePlaceSearch = useCallback((value, materialid) => {
  //   setChoices(prev => ({ ...prev, materials: prev.materials.map(material => material.id === materialid ? { ...material, place: value } : material) }))
  // }, [setChoices]);


  // const handleModelSelection = useCallback((model, materialid) => {
  //   setChoices(prev => ({
  //     ...prev, materials: prev.materials.map(material => material.id === materialid
  //       ? {
  //         ...material,
  //         materialId: model.id,
  //         materialName: model.title,
  //         approx_price: model.approx_price,
  //         code: model.product_id,
  //         department: model.department_name,
  //         isAmortisized: model.is_amortisized,
  //         percentage: model.perc
  //       }
  //       : material
  //     )
  //   }));
  // }, [setChoices]);

  // const handlePlaceSelection = useCallback((place, materialid) => {
  //   setChoices(prev => ({
  //     ...prev, materials: prev.materials.map(material => material.id === materialid
  //       ? {
  //         ...material,
  //         place: place.name,
  //         placeid: place.id
  //       }
  //       : material
  //     )
  //   }));
  // }, [setChoices]);

  // const setCode = useCallback((material, materialid) => {
  //   setChoices(prev => ({
  //     ...prev, materials: prev.materials.map(prevMaterial => prevMaterial.id === materialid
  //       ? {
  //         ...prevMaterial,
  //         code: material.product_id,
  //         approx_price: material.approx_price,
  //         department: material.department_name,
  //         materialId: material.id
  //       }
  //       : prevMaterial
  //     )
  //   }));
  // }, [setChoices])

  const handleChange = useCallback((name, value, offerid, sync = false, op) => {
    if (!sync){
      // console.log(offerid)
      // setChoices(prev => ({ ...prev, materials: prev.materials.map(material => material.id === materialid ? { ...material, [name]: value } : material) }))
      setChoices(prev=> [...prev, prev.map(offer=>offer.id===offerid ? {...offer,[name]:value} : offer )])
    }
    else
      // setChoices(prev => ({ ...prev, materials: prev.materials.map(material => material.id === materialid ? { ...material, [name]: op === 'inc' ? material[name] + 1 : material[name] - 1 } : material) }))
      setChoices(prev=> [...prev, prev.map(offer=>offer.id===offerid ? {...offer,[name]:op==='inc'? offer[name]+1:offer[name]-1} : offer )])
  }, [setChoices])

  console.log(props.choices)
  // props.choices.map(offer=>{
  //   console.log(offer.id)
  // })
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
                  index={index}
                  orderType={orderType}
                  // place={material.place}
                  key={offer.id}
                  offerid={offer.id}
                  // className={offer.class}
                  offerName={offer.name}
                  structure={structure}
                  // code={material.code}
                  handleRowDelete={handleRowDelete}
                  count={offer.count}
                  additionalInfo={offer.note}
                  // department={material.department}
                  // tesvir={material.tesvir}
                  // setPlaceList={props.setPlaceList}
                  // placeList={placeList}
                  // setCode={setCode}
                  // handlePlaceSelection={handlePlaceSelection}
                  handleChange={handleChange}
                  // handleModelSelection={handleModelSelection}
                  // handlePlaceSearch={handlePlaceSearch}
                  // searchByMaterialName={searchByMaterialName}
                />
              )
            })
          }
      </ul>
    </>
  )
}

export default NewOfferTableBody
