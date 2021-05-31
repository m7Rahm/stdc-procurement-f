import React, { useRef, useState } from 'react'
import { FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa'
import useFetch from '../../../hooks/useFetch';
import { productUnit } from '../../../data/data'

const NewOrderTableRow = (props) => {
  const rowRef = useRef(null);
  const { orderType, structure, materialid, className, count, placeList, setPlaceList } = props;
  const modelListRef = useRef(null);
  const placeListRef = useRef(null);
  const [unit, setUnit] = useState(1);
  const [materials, setMaterials] = useState([])
  const [models, setModels] = useState([]);
  const [places, setPlaces] = useState([]);
  const modelInputRef = useRef(null);
  const codeInputRef = useRef(null);
  const placeInputRef = useRef(null);
  const timeoutRef = useRef(null);
  const codeRef = useRef(null);
  const fetchGet = useFetch("GET");
  const fetchPost = useFetch("POST")
  const handleAmountChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    if (value === '' || Number(value) > 0) {
      setMaterials(prev => prev.map(material => material.id === materialid ? { ...material, [name]: value } : material))
      props.setChoices(prevState => ({
        ...prevState,
        selectedData: { ...prevState.selectedData, say: value }
      }))
    }
  }
  const handleAmountFocusLose = (e) => {
    const value = e.target.value;
    const name = e.target.name
    if (value === '')
      setMaterials(prev => prev.map(material => material.id === materialid ? { ...material, [name]: 0 } : material))
  }
  const handleAmountChangeButtons = (action) => {
    setMaterials(prev => prev.map(material => material.id === materialid ? { ...material, count: action === 'inc' ? Number(material.count) + 1 : material.count - 1 } : material))
    if (action === 'inc') {
      props.setChoices(prevState => ({
        ...prevState,
        selectedData: { ...prevState.selectedData, say: prevState.selectedData.say + 1 }
      }))
    } else {
      props.setChoices(prevState => ({
        ...prevState,
        selectedData: { ...prevState.selectedData, say: prevState.selectedData.say - 1 }
      }))
    }
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

  const handleRowDelete = () => {
    rowRef.current.classList.add("delete-row");
    rowRef.current.addEventListener('animationend', () => setMaterials(prev => prev.filter(material => material.id !== materialid)))
  }
  const setModel = (model) => {
    setMaterials(prev => prev.map(material => material.id === materialid
      ? {
        ...material,
        materialId: model.id,
        approx_price: model.approx_price,
        code: model.product_id,
        department: model.department_name,
        isService: model.is_service,
        isAmortisized: model.is_amortisized,
        percentage: model.perc
      }
      : material
    ));
    codeRef.current.value = model.product_id;
    modelInputRef.current.value = model.title;
    modelListRef.current.style.display = "none";
  }

  const setPlace = (model) => {
    placeInputRef.current.value = model.name;
    placeListRef.current.style.display = "none";
  }

  const handleInputSearch = (e) => {
    const value = e.target.value;
    // if (subGlCategory !== "-1" && subGlCategory !== undefined && subGlCategory !== "") {
    //   const charArray = value.split("")
    //   const reg = charArray.reduce((conc, curr) => conc += `${curr}(.*)`, "")
    //   const regExp = new RegExp(`${reg}`, "i");
    //   const searchResult = modelsRef.current.filter(model => regExp.test(model.title))
    //   setModels(searchResult);
    //   props.setChoices(prevState => ({
    //     ...prevState,
    //     selectedData: { ...prevState.selectedData, model: searchResult }
    //   }))
    // } else {
    fetchGet(`/api/material-by-title?title=${value}&orderType=${orderType}&structure=${structure}`)
      .then(respJ => {
        setModels(respJ)
        props.setChoices(prevState => ({
          ...prevState,
          selectedData: { ...prevState.selectedData, model: respJ }
        }))
      })
      .catch(ex => console.log(ex))
    // }
  }
  const updateInfoValue = (e) => {
    const target_value = e.target.value
    props.setChoices(prevState => ({
      ...prevState,
      selectedData: { ...prevState.selectedData, info: target_value }
    }))
  }
  const handlePlaceSearch = (e) => {
    const value = e.target.value;
    // if (subGlCategory !== "-1" && subGlCategory !== undefined && subGlCategory !== "") {
    const charArray = value.split("")
    const reg = charArray.reduce((conc, curr) => conc += `${curr}(.*)`, "")
    const regExp = new RegExp(`${reg}`, "i");
    const searchResult = places.filter(model => regExp.test(model.title))
    setPlaces(searchResult);
    props.setChoices(prevState => ({
      ...prevState,
      selectedData: { ...prevState.selectedData, places: searchResult }
    }))
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
            setMaterials(prev => prev.map(prevMaterial => prevMaterial.id === materialid
              ? {
                ...prevMaterial,
                code: material.product_id,
                approx_price: material.approx_price,
                department: material.department_name,
                materialId: material.id
              }
              : prevMaterial
            ));
            modelListRef.current.style.display = "none";
          } else {
            modelListRef.current.style.display = "block";
            setModels(respJ);
            props.setChoices(prevState => ({
              ...prevState,
              selectedData: { ...prevState.selectedData, model: respJ }
            }))
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
        <input
          onBlur={handleBlur}
          onFocus={handleFocus}
          type="text"
          placeholder="Məhsul"
          ref={modelInputRef}
          name="model"
          autoComplete="off"
          onChange={handleInputSearch}
        />
        {
          <ul id="modelListRef" tabIndex="0" ref={modelListRef} style={{ width: '150px', maxWidth: ' 200px', outline: models.length === 0 ? '' : 'rgb(255, 174, 0) 2px solid' }} className="material-model-list">
            {
              models.map(model => {
                const inputVal = modelInputRef.current.value;
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
          // onFocus={handleFocus}
          type="text"
          placeholder="Kod"
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
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
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
          autoComplete="off"
          onChange={handlePlaceSearch}
        />
        {
          <ul id="placeListRef" tabIndex="0" ref={placeListRef} style={{ width: '150px', maxWidth: ' 200px', outline: models.length === 0 ? '' : 'rgb(255, 174, 0) 2px solid' }} className="material-model-list">
            {
              placeList.map(model => {
                const inputVal = placeListRef.current ? placeInputRef.current.value : '';
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
          value={props.choices.selectedData ? props.choices.selectedData.info : ""}
          type="text"
          onChange={(e) => updateInfoValue(e)}
        />
      </div>
      <div>
        <FaTrashAlt cursor="pointer" onClick={handleRowDelete} title="Sil" color="#ff4a4a" />
      </div>
    </li>
  )
}
export default React.memo(NewOrderTableRow)