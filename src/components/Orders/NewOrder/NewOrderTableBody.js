import React, { useEffect, useState, useCallback } from 'react'
import NewOrderTableRow from './NewOrderTableRow'
import useFetch from '../../../hooks/useFetch';
import { IoIosAdd } from 'react-icons/io'
import { newOrderInitial } from '../../../data/data'

const NewOrderTableBody = (props) => {
  const fetchGet = useFetch("GET");
  const handleAddClick = () => {
    props.setChoices(prev => ({ ...prev, materials: [...prev.materials, { ...newOrderInitial.materials[0], id: Date.now(), class: 'new-row' }] }))
  }
  const { orderType, structure } = props.orderInfo;

  const [placeList, setPlaceList] = useState([])
  const setChoices = props.setChoices;
  useEffect(() => {
    setChoices(prev => ({ ...prev, materials: prev.materials.filter(material => material.isService === orderType) }))
  }, [orderType, setChoices])

  useEffect(() => {
    fetchGet(`/api/assignments`)
      .then(respJ => setPlaceList(respJ))
      .catch(ex => console.log(ex))
  }, [fetchGet])
  const handleRowDelete = (rowRef) => {
    rowRef.current.classList.add("delete-row");
    rowRef.current.addEventListener('animationend', () => setChoices(prev => ({ ...prev, materials: prev.materials.filter(material => material.id !== rowRef.current.id) })))
  }
  const searchByMaterialName = useCallback((value, materialid) => {
    setChoices(prev => ({
      ...prev, materials: prev.materials.map(material => material.id === materialid
        ? {
          ...material,
          materialId: null,
          materialName: value,
          approx_price: '',
          code: '',
          department: '',
          isAmortisized: '',
          percentage: ''
        }
        : material
      )
    }));
  }, [setChoices]);
  const handlePlaceSearch = useCallback((value, materialid) => {
    setChoices(prev => ({ ...prev, materials: prev.materials.map(material => material.id === materialid ? { ...material, place: value } : material) }))
  }, [setChoices]);
  const handleChange = useCallback((name, value, materialid, sync = false, op) => {
    if (!sync)
      setChoices(prev => ({ ...prev, materials: prev.materials.map(material => material.id === materialid ? { ...material, [name]: value } : material) }))
    else
      setChoices(prev => ({ ...prev, materials: prev.materials.map(material => material.id === materialid ? { ...material, [name]: op === 'inc' ? material[name] + 1 : material[name] - 1 } : material) }))
  }, [setChoices])
  const handleModelSelection = useCallback((model, materialid) => {
    setChoices(prev => ({
      ...prev, materials: prev.materials.map(material => material.id === materialid
        ? {
          ...material,
          materialId: model.id,
          materialName: model.title,
          approx_price: model.approx_price,
          code: model.product_id,
          department: model.department_name,
          isAmortisized: model.is_amortisized,
          percentage: model.perc
        }
        : material
      )
    }));
  }, [setChoices]);
  const handlePlaceSelection = useCallback((place, materialid) => {
    setChoices(prev => ({
      ...prev, materials: prev.materials.map(material => material.id === materialid
        ? {
          ...material,
          place: place.name,
          placeid: place.id
        }
        : material
      )
    }));
  }, [setChoices]);
  const setCode = useCallback((material, materialid) => {
    setChoices(prev => ({
      ...prev, materials: prev.materials.map(prevMaterial => prevMaterial.id === materialid
        ? {
          ...prevMaterial,
          code: material.product_id,
          approx_price: material.approx_price,
          department: material.department_name,
          materialId: material.id
        }
        : prevMaterial
      )
    }));
  }, [setChoices])
  return (
    <>
      <ul className="new-order-table">
        <li>
          <div>#</div>
          <div>Məhsul</div>
          <div style={{ width: '170px', maxWidth: '235px' }}>Kod</div>
          <div style={{ maxWidth: '120px' }}>Say</div>
          <div style={{ width: '170px', maxWidth: '150px' }}>Ölçü vahidi</div>
          <div>İstifadə yeri</div>
          <div>Əlavə məlumat</div>
          <div>Təsvir</div>
          <div> <IoIosAdd title="Əlavə et" cursor="pointer" onClick={handleAddClick} size="20" style={{ margin: 'auto' }} /></div>
        </li>
        {
          props.choices.materials.map((material, index) => {
            return (
              <NewOrderTableRow
                index={index}
                orderType={orderType}
                place={material.place}
                key={material.id}
                materialid={material.id}
                className={material.class}
                materialName={material.materialName}
                structure={structure}
                code={material.code}
                handleRowDelete={handleRowDelete}
                count={material.count}
                additionalInfo={material.additionalInfo}
                department={material.department}
                tesvir={material.tesvir}
                setPlaceList={props.setPlaceList}
                placeList={placeList}
                setCode={setCode}
                handlePlaceSelection={handlePlaceSelection}
                handleChange={handleChange}
                handleModelSelection={handleModelSelection}
                handlePlaceSearch={handlePlaceSearch}
                searchByMaterialName={searchByMaterialName}
              />
            )
          })
        }
      </ul>
    </>
  )
}
export default React.memo(NewOrderTableBody)
