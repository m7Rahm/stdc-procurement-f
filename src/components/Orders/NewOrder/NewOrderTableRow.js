import React, { useRef, useState } from 'react'
import { FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa'
import useFetch from '../../../hooks/useFetch';
import { productUnit } from '../../../data/data'
import InputSearchList from '../../Misc/InputSearchList';

const NewOrderTableRow = (props) => {
  const rowRef = useRef(null);
  const { orderType, structure, materialid, className, additionalInfo, count, placeList, tesvir } = props;
  const modelListRef = useRef(null);
  const placeListRef = useRef(null);
  const [models, setModels] = useState([]);
  const [places, setPlaces] = useState([]);
  const modelInputRef = useRef(null);
  const placeInputRef = useRef(null);
  const timeoutRef = useRef(null);
  const codeRef = useRef(null);
  const fetchGet = useFetch("GET");
  const fetchPost = useFetch("POST")

  const handleAmountChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    if (value === '' || Number(value) > 0) {
      props.setChoices(prev => ({ ...prev, materials: prev.materials.map(material => material.id === materialid || material.materialId === materialid ? { ...material, [name]: value } : material) }))
    }
  }
  const handleAmountFocusLose = (e) => {
    const value = e.target.value;
    const name = e.target.name
    if (value === '')
      props.setChoices(prev => ({ ...prev, materials: prev.materials.map(material => material.id === materialid || material.materialId === materialid ? { ...material, [name]: 0 } : material) }))
  }
  const handleAmountChangeButtons = (action) => {
    props.setChoices(prev => ({ ...prev, materials: prev.materials.map(material => material.id === materialid || material.materialId === materialid ? { ...material, count: action === 'inc' ? +material.count + 1 : material.count - 1 } : material) }))
  }

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    props.setChoices(prev => ({ ...prev, materials: prev.materials.map(material => material.id === materialid || material.materialId === materialid ? { ...material, [name]: value } : material) }))
  }

  const handleRowDelete = () => {
    rowRef.current.classList.add("delete-row");
    if (props.material.id === materialid) {
      rowRef.current.addEventListener('animationend', () => props.setChoices(prev => ({ ...prev, materials: prev.materials.filter(material => material.id !== materialid) })))// ||   
    } else {
      rowRef.current.addEventListener('animationend', () => props.setChoices(prev => ({ ...prev, materials: prev.materials.filter(material => material.materialId !== materialid) })))// || material.id !== materialid
    }
  }
  const setModel = (_, model) => {
    props.setChoices(prev => ({
      ...prev, materials: prev.materials.map(material => material.id === materialid || material.materialId === materialid
        ? {
          ...material,
          materialId: model.id,
          materialName: model.title,
          approx_price: model.approx_price,
          code: model.product_id,
          department: model.department_name,
          isAmortisized: model.is_amortisized,
          percentage: model.perc,
          isService: orderType
        }
        : material
      )
    }));
    codeRef.current.value = model.product_id;
    modelInputRef.current.value = model.title;
    modelListRef.current.style.display = "none";
  }

  const setPlace = (_, place) => {
    props.setChoices(prev => ({
      ...prev, materials: prev.materials.map(material => material.id === materialid || material.materialId === materialid
        ? {
          ...material,
          place: place.name,
          placeid: place.id
        }
        : material
      )
    }));
    placeInputRef.current.value = place.name;
    placeListRef.current.style.display = "none";
  }
  const handleInputSearch = (e) => {
    const value = e.target.value;
    let valueWithoutE = value.replace(/e/gi, '[eə]')
      .replace(/ch?/gi, '[cç]')
      .replace(/o/gi, '[oö]')
      .replace(/i/gi, '[iı]')
      .replace(/gh?/gi, '[gğ]')
      .replace(/sh?/gi, '[sş]')
      .replace(/u/gi, '[uü]');
    props.setChoices(prev => ({
      ...prev, materials: prev.materials.map(material => material.id === materialid || material.materialId === materialid
        ? {
          ...material,
          materialId: null,
          materialName: value,
          approx_price: '',
          code: '',
          department: '',
          isAmortisized: '',
          percentage: '',
          isService: orderType
        }
        : material
      )
    }));
    fetchGet(`/api/material-by-title?title=${encodeURIComponent(valueWithoutE)}&orderType=${orderType}&structure=${structure}`)
      .then(respJ => {
        setModels(respJ)
      })
      .catch(ex => console.log(ex))
  }

  const handlePlaceSearch = (e) => {
    const value = e.target.value;
    const charArray = value.split("");
    const reg = charArray.reduce((conc, curr) => conc += `${curr}(.*)`, "")
    const regExp = new RegExp(`${reg}`, "gi");
    const searchResult = placeList.filter(place => regExp.test(place.name));
    setPlaces(searchResult);
    props.setChoices(prev => ({ ...prev, materials: prev.materials.map(material => material.id === materialid || material.materialId === materialid ? { ...material, place: value } : material) }))
  }
  const searchByCode = (e) => {
    const data = { product_id: e.target.value, orderType: orderType, structure: structure };
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    timeoutRef.current = setTimeout(() => {
      fetchPost('/api/get-by-product-code', data)
        .then(respJ => {
          timeoutRef.current = null;
          if (respJ.length === 1) {
            const material = respJ.length !== 0 ? respJ[0] : {};
            modelInputRef.current.value = material.title || "";
            props.setChoices(prev => ({
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
            modelListRef.current.style.display = "none";
          } else {
            modelListRef.current.style.display = "block";
            setModels(respJ);
          }
        })
        .catch(ex => {
          console.log(ex);
          timeoutRef.current = null;
        })
    }, 500)
  }

  return (
    <li ref={rowRef} className={className}>
      <div>{props.index + 1}</div>
      {/* Məhsul */}
      <div style={{ position: 'relative' }}>
        <InputSearchList
          listid="modelListRef"
          defaultValue={props.material.materialName ? props.material.materialName : props.material.material_name}
          placeholder="Məhsul"
          inputRef={modelInputRef}
          listRef={modelListRef}
          name="model"
          text="title"
          items={models}
          handleInputChange={handleInputSearch}
          handleItemClick={setModel}
        />
      </div>
      {/* Kod */}
      <div style={{ position: 'relative', width: '170px', maxWidth: '200px' }}>
        <input
          type="text"
          placeholder="Kod"
          defaultValue={props.material.code}
          ref={codeRef}
          name="model"
          autoComplete="off"
          onChange={searchByCode}
        />
      </div>
      {/* Say */}
      <div style={{ maxWidth: '140px' }}>
        <div style={{ backgroundColor: 'transparent', padding: '0px 15px' }}>
          <FaMinus cursor="pointer" onClick={() => { if (count > 1) handleAmountChangeButtons('dec') }} color="#ffae00" style={{ margin: '0px 3px' }} />
          <input
            name="count"
            style={{ width: '40px', textAlign: 'center', padding: '0px 2px', margin: '0px 5px', flex: 1 }}
            type="text"
            onBlur={handleAmountFocusLose}
            onChange={handleAmountChange}
            value={count}
          />
          <FaPlus cursor="pointer" onClick={() => handleAmountChangeButtons('inc')} color="#3cba54" style={{ margin: '0px 3px' }} />
        </div>
      </div>
      {/* Ölçü vahidi */}
      <div style={{ maxWidth: '140px' }}>
        <select
          name="unit"
          value={props.material.unit}
          onChange={handleChange}
        >
          {
            productUnit.map(unit =>
              <option value={unit.val} key={unit.val}>{unit.text}</option>
            )
          }
        </select>
      </div>

      {/* Istifade yeri */}
      <div style={{ position: 'relative' }}>
        <InputSearchList
          defaultValue={props.material.place}
          placeholder="Istifadə yeri"
          text="name"
          name="place"
          listid="placeListRef"
          inputRef={placeInputRef}
          listRef={placeListRef}
          handleInputChange={handlePlaceSearch}
          items={places}
          handleItemClick={setPlace}
          style={{ width: '150px', maxWidth: ' 200px', outline: models.length === 0 ? '' : 'rgb(255, 174, 0) 2px solid' }}
        />
      </div>
      {/* Əlavə məlumat */}
      <div>
        <input
          style={{ width: '100%' }}
          placeholder="Link və ya əlavə məlumat"
          name="additionalInfo"
          value={additionalInfo}
          type="text"
          onChange={handleChange}
        />
      </div>
      {/* Tesvir */}
      <div>
        <input
          style={{ width: '100%' }}
          placeholder="Təsvir"
          name="tesvir"
          value={tesvir}
          type="text"
          onChange={handleChange}
        />
      </div>
      <div>
        <FaTrashAlt cursor="pointer" onClick={handleRowDelete} title="Sil" color="#ff4a4a" />
      </div>
    </li>
  )
}
export default React.memo(NewOrderTableRow)