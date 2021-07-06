import React, { useRef, useState } from 'react'
import { FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa'
import useFetch from '../../../hooks/useFetch';
import { productUnit } from '../../../data/data'

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

  const handleFocus = () => {
    if (props.modelsListRef.current)
      props.modelsListRef.current.style.display = 'none';
    modelListRef.current.style.display = 'block'
    props.modelsListRef.current = modelListRef.current;
  }

  const handlePlaceFocus = () => {
    if (props.placesListRef.current)
      props.placesListRef.current.style.display = 'none';
    placeListRef.current.style.display = 'block'
    props.placesListRef.current = placeListRef.current;
  }

  // eslint-disable-next-line
  const handleBlur = (e) => {
    const relatedTargetid = e.relatedTarget ? e.relatedTarget.id : null
    if (relatedTargetid === null || relatedTargetid !== 'modelListRef')
      modelListRef.current.style.display = 'none'
  }

  const handlePlaceBlur = (e) => {
    const relatedTargetid = e.relatedTarget ? e.relatedTarget.id : null
    if (relatedTargetid === null || relatedTargetid !== 'placeListRef')
      placeListRef.current.style.display = 'none'
  }

  const handleChange = (e) => {
    const value = e.target.value;
    props.setChoices(prev => ({ ...prev, materials: prev.materials.map(material => material.id === materialid || material.materialId === materialid ? { ...material, additionalInfo: value } : material) }))
  }

  const handleChange2 = (e) => {
    const value = e.target.value;
    props.setChoices(prev => ({ ...prev, materials: prev.materials.map(material => material.id === materialid || material.materialId === materialid ? { ...material, tesvir: value } : material) }))
  }
  // console.log(materialid,props.material.materialId,props.material.id)
  const handleRowDelete = () => {
    rowRef.current.classList.add("delete-row");
    if (props.material.id === materialid) {
      rowRef.current.addEventListener('animationend', () => props.setChoices(prev => ({ ...prev, materials: prev.materials.filter(material => material.id !== materialid) })))// ||   
    } else {
      rowRef.current.addEventListener('animationend', () => props.setChoices(prev => ({ ...prev, materials: prev.materials.filter(material => material.materialId !== materialid) })))// || material.id !== materialid
    }
  }
  const setModel = (model) => {
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

  const setPlace = (model) => {
    // props.choices.materials.map(material=> material.id===materialid || material.materialId===materialid ? console.log("material not found"):console.log(material.id,materialid))

    props.setChoices(prev => ({
      ...prev, materials: prev.materials.map(material => material.id === materialid || material.materialId === materialid
        ? {
          ...material,
          place: model.name
        }
        : material
      )
    }));
    placeInputRef.current.value = model.name;
    placeListRef.current.style.display = "none";
  }

  const handleInputSearch = (e) => {
    const value = e.target.value;
    let valueWithoutE = value.replace('e', '[eə]')
    valueWithoutE = valueWithoutE.replace(/ch?/, '[cç]');
    valueWithoutE = valueWithoutE.replace(/i/, '[iı]');
    valueWithoutE = valueWithoutE.replace(/gh?/, '[gğ]');
    valueWithoutE = valueWithoutE.replace(/sh?/, '[sş]');
    valueWithoutE = valueWithoutE.replace(/u/, '[uü]');
    valueWithoutE = valueWithoutE.replace(/o/, '[oö]');
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
    // eslint-disable-next-line
    fetchGet(`/api/material-by-title?title=${encodeURIComponent(valueWithoutE)}&orderType=${orderType}&structure=${structure == undefined ? "":structure}`)
      .then(respJ => {
        setModels(respJ)
      })
      .catch(ex => console.log(ex))
  }

  const handlePlaceSearch = (e) => {
    let value = e.target.value;
    value = value.replace('e', '[eə]')
    value = value.replace(/ch?/, '[cç]');
    value = value.replace(/i/, '[iı]');
    value = value.replace(/gh?/, '[gğ]');
    value = value.replace(/sh?/, '[sş]');
    value = value.replace(/u/, '[uü]');
    value = value.replace(/o/, '[oö]');
    const charArray = value.split("")
    const reg = charArray.reduce((conc, curr) => conc += `${curr}(.*)`, "")
    const regExp = new RegExp(`${reg}`, "i");
    const searchResult = places.filter(model => regExp.test(model.title))
    setPlaces(searchResult);
    props.setChoices(prev => ({ ...prev, materials: prev.materials.map(material => material.id === materialid || material.materialId === materialid ? { ...material, place: placeInputRef.current.value } : material) }))
  }
  // eslint-disable-next-line
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

  const unitChangeHandler = (e) => {
    const value = e.target.value;
    props.setChoices(prev => ({ ...prev, materials: prev.materials.map(material => material.id === materialid || material.materialId === materialid ? { ...material, unit: value } : material) }))
  }
  return (
    <li ref={rowRef} className={className}>
      <div>{props.index + 1}</div>
      {/* Məhsul */}
      <div style={{ position: 'relative' }}>
        <input
          onBlur={handleBlur}
          onFocus={handleFocus}
          type="text"
          placeholder="Məhsul"
          defaultValue={props.material.materialName ? props.material.materialName : props.material.material_name}
          ref={modelInputRef}
          name="model"
          autoComplete="off"
          onChange={handleInputSearch}
        />
        {
          <ul id="modelListRef" tabIndex="0" ref={modelListRef} style={{ width: '150px', maxWidth: ' 200px' }} className="material-model-list">
            {
              models.map(model => {
                let inputVal = modelInputRef.current.value.replace("-", "\\-");
                inputVal = inputVal.replace(/e/gi, 'eə');
                inputVal = inputVal.replace(/c/gi, 'cç');
                inputVal = inputVal.replace(/i/gi, 'iı');
                inputVal = inputVal.replace(/g/gi, 'gğ');
                inputVal = inputVal.replace(/s/gi, 'sş');
                inputVal = inputVal.replace(/u/gi, 'uü');
                inputVal = inputVal.replace(/o/gi, 'oö');
                const strRegExp = new RegExp(`[${inputVal}]`, 'gi');
                const title = model.title.replace(strRegExp, (text) => `<i>${text}</i>`);
                return <li key={model.id} dangerouslySetInnerHTML={{ __html: title }} onClick={() => setModel(model)}></li>
              })
            }
          </ul>
        }
      </div>
      {/* Kod */}
      <div style={{ position: 'relative', width: '170px', maxWidth: '200px' }}>
        <input
          onBlur={handleBlur}
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
          name="product_unit"
          value={props.material.unit}
          onChange={unitChangeHandler}
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
        <input
          onBlur={handlePlaceBlur}
          onFocus={handlePlaceFocus}
          type="text"
          placeholder="Istifadə yeri"
          ref={placeInputRef}
          name="model"
          defaultValue={props.material.place}
          autoComplete="off"
          onChange={handlePlaceSearch}
        />
        {
          <ul id="placeListRef" tabIndex="0" ref={placeListRef} style={{ width: '150px', maxWidth: ' 200px', outline: models.length === 0 ? '' : 'rgb(255, 174, 0) 2px solid' }} className="material-model-list">
            {
              placeList.map(model => {
                let inputVal = placeListRef.current ? placeInputRef.current.value.replace("-", "\\-") : '';
                inputVal = inputVal.replace(/e/gi, 'eə');
                inputVal = inputVal.replace(/c/gi, 'cç');
                inputVal = inputVal.replace(/i/gi, 'iı');
                inputVal = inputVal.replace(/g/gi, 'gğ');
                inputVal = inputVal.replace(/s/gi, 'sş');
                inputVal = inputVal.replace(/u/gi, 'uü');
                inputVal = inputVal.replace(/o/gi, 'oö');
                const strRegExp = new RegExp(`[${inputVal}]`, 'gi');
                const title = model.name.replace(strRegExp, (text) => `<i>${text}</i>`);
                return <li key={model.id} dangerouslySetInnerHTML={{ __html: title }} onClick={() => setPlace(model)}></li>
              })
            }
          </ul>
        }
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
          onChange={handleChange2}
        />
      </div>
      <div>
        <FaTrashAlt cursor="pointer" onClick={handleRowDelete} title="Sil" color="#ff4a4a" />
      </div>
    </li>
  )
}
export default React.memo(NewOrderTableRow)