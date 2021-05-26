import React, { useEffect, useRef, useState } from 'react'
import { FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa'
import useFetch from '../../../hooks/useFetch';
import {productUnit} from '../../../data/data'

const NewOrderTableRow = (props) => {
  const rowRef = useRef(null);
  const { orderType, structure, setMaterials } = props;
  const modelListRef = useRef(null);
  const codeListRef = useRef(null);
  const placeListRef = useRef(null);
  const [models, setModels] = useState([]);
  const [codes, setCodes] = useState([]);
  const [places,setPlaces] = useState([]);
  const [unit,setUnit] = useState([]);
  const modelsRef = useRef([]);
  const placesRef = useRef([]);
  const codesRef = useRef([]);
  const modelInputRef = useRef(null);
  const codeInputRef = useRef(null);
  const placeInputRef = useRef(null);
  const { materialid, subGlCategory, className, count } = props
  const timeoutRef = useRef(null);
  const codeRef = useRef(null);
  const fetchGet = useFetch("GET");
  const fetchPost = useFetch("POST")
  const handleAmountChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    if (value === '' || Number(value) > 0) {
      setMaterials(prev => prev.map(material => material.id === materialid ? { ...material, [name]: value } : material))
    }
  }
  useEffect(() => {
    const data = { subGlCategoryId: subGlCategory, structureid: structure, orderType: orderType };
    fetchPost('/api/strucutre-budget-info', data)
      .then(respJ => {
        modelsRef.current = respJ;
        if (modelInputRef.current) {
          const modelInput = modelInputRef.current.value.toLowerCase();
          setModels(respJ.filter(model => model.title.toLowerCase().includes(modelInput)));
        }
      })
      .catch(ex => console.log(ex))
  }, [subGlCategory, fetchPost, orderType, structure])


  const handleAmountFocusLose = (e) => {
    const value = e.target.value;
    const name = e.target.name
    if (value === '')
      setMaterials(prev => prev.map(material => material.id === materialid ? { ...material, [name]: 0 } : material))
  }


  const handleAmountChangeButtons = (action) => {
    setMaterials(prev => prev.map(material => material.id === materialid ? { ...material, count: action === 'inc' ? Number(material.count) + 1 : material.count - 1 } : material))
  }


  const handleFocus = () => {
    if (props.modelsListRef.current)
      props.modelsListRef.current.style.display = 'none';
    modelListRef.current.style.display = 'block'
    props.modelsListRef.current = modelListRef.current;
  }
  // eslint-disable-next-line
  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setMaterials(prev => prev.map(material => material.id === materialid ? { ...material, [name]: value } : material))
  }


  const handleBlur = (e) => {
    const relatedTargetid = e.relatedTarget ? e.relatedTarget.id : null
    if (relatedTargetid === null || relatedTargetid !== 'modelListRef')
      modelListRef.current.style.display = 'none'
  }


  const handleRowDelete = () => {
    rowRef.current.classList.add("delete-row");
    rowRef.current.addEventListener('animationend', () => setMaterials(prev => prev.filter(material => material.id !== materialid)))
  }


  const setModel = (model) => {
    fetchGet(`/api/material-quantity/${structure}?pid=` + model.product_id)
      .then(resp => {
        // setQuantity(resp[0].quantity)
      })
      .catch(ex => console.log(ex))
    setMaterials(prev => prev.map(material => material.id === materialid
      ? {
        ...material,
        subGlCategory: model.sub_gl_category_id,
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
    // setBudget(model.budget)
    codeRef.current.value = model.product_id;
    modelInputRef.current.value = model.title;
    modelListRef.current.style.display = "none";
  }


  const handleInputSearch = (e) => {
    const value = e.target.value;
    if (subGlCategory !== "-1" && subGlCategory !== undefined && subGlCategory !== "") {
      const charArray = value.split("")
      const reg = charArray.reduce((conc, curr) => conc += `${curr}(.*)`, "")
      const regExp = new RegExp(`${reg}`, "i");
      const searchResult = modelsRef.current.filter(model => regExp.test(model.title))
      setModels(searchResult);
    } else {
      fetchGet(`/api/material-by-title?title=${value}&orderType=${orderType}&structure=${structure}`)
        .then(respJ => {
          setModels(respJ)
        })
        .catch(ex => console.log(ex))
    }
  }

  const handlePlaceSearch = (e) => {
    const value = e.target.value;
    // if (subGlCategory !== "-1" && subGlCategory !== undefined && subGlCategory !== "") {
      const charArray = value.split("")
      const reg = charArray.reduce((conc, curr) => conc += `${curr}(.*)`, "")
      const regExp = new RegExp(`${reg}`, "i");
      const searchResult = placesRef.current.filter(model => regExp.test(model.title))
      setPlaces(searchResult);
    // } else {
    //   fetchGet(`/api/material-by-title?title=${value}&orderType=${orderType}&structure=${structure}`)
    //     .then(respJ => {
    //       setPlaces(respJ)
    //     })
    //     .catch(ex => console.log(ex))
    // }
  }

  const handleCodeSearch = (e) => {
    const value = e.target.value;
    // if (subGlCategory !== "-1" && subGlCategory !== undefined && subGlCategory !== "") {
      const charArray = value.split("")
      const reg = charArray.reduce((conc, curr) => conc += `${curr}(.*)`, "")
      const regExp = new RegExp(`${reg}`, "i");
      const searchResult = codesRef.current.filter(model => regExp.test(model.title))
      setCodes(searchResult);
    // } else {
    //   fetchGet(`/api/material-by-title?title=${value}&orderType=${orderType}&structure=${structure}`)
    //     .then(respJ => {
    //       setCodes(respJ)
    //     })
    //     .catch(ex => console.log(ex))
    // }
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
                subGlCategory: material.subGlCategory,
                code: material.product_id,
                approx_price: material.approx_price,
                department: material.department_name,
                isAmortisized: material.is_amortisized,
                materialId: material.id,
                models: modelsRef.current.filter(model => model.sub_gl_category_id === material.subGlCategory),
                isService: material.is_service
              }
              : prevMaterial
            ));
            // setQuantity(material.quantity)
            // setBudget(material.budget || 0);
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
          <ul id="modelListRef" tabIndex="0" ref={modelListRef} style={{ width:'150px', maxWidth: ' 200px',outline: models.length === 0 ? '' : 'rgb(255, 174, 0) 2px solid' }} className="material-model-list">
            {
              models.map(model => {
                const titleArr = model.title.split("");
                const inputVal = modelInputRef.current.value;
                const title = <>{titleArr.map((char, index) => {
                  const strRegExp = new RegExp(`[${inputVal}]`, 'gi');
                  if (strRegExp.test(char)) {
                    return <i key={index}>{char}</i>
                  } else {
                    return char
                  }
                })
                }</>
                return <li key={model.id} onClick={() => setModel(model)}>{title}</li>
              })
            }
          </ul>
        }
      </div>


      <div style={{ position: 'relative',width: '170px', maxWidth:'200px' }}>
        <input
          onBlur={handleBlur}
          onFocus={handleFocus}
          type="text"
          placeholder="Kod"
          ref={codeInputRef}
          name="model"
          autoComplete="off"
          onChange={handleCodeSearch}
        />
        {
          <ul id="codeListRef" tabIndex="0" ref={codeListRef} style={{ outline: codes.length === 0 ? '' : 'rgb(255, 174, 0) 2px solid' }} className="material-model-list">
            {
              codes.map(model => {
                const titleArr2 = model.title.split("");
                const inputVal = codeInputRef.current.value;
                const title = <>{titleArr2.map((char, index) => {
                  const strRegExp = new RegExp(`[${inputVal}]`, 'gi');
                  if (strRegExp.test(char)) {
                    return <i key={index}>{char}</i>
                  } else {
                    return char
                  }
                })
                }</>
                return <li key={model.id} onClick={() => setCodes(model)}>{title}</li>
              })
            }
          </ul>
        }
      </div>


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

      <div style={{ maxWidth: '140px' }}>
        <select
            name="product_unit"
            value={unit} 
            onChange={(e)=> setUnit(e.target.value)}
        >
            {
                productUnit.map(unit =>
                    <option value={unit.val} key={unit.val}>{unit.text}</option>
                )
            }
        </select>
      </div>

      {/*Istifade yeri */}

      <div style={{ position: 'relative' }}>
        <input
          onBlur={handleBlur}
          onFocus={handleFocus}
          type="text"
          placeholder="Istifadə yeri"
          ref={placeInputRef}
          name="model"
          autoComplete="off"
          onChange={handlePlaceSearch}
        />
        {
          <ul id="placeListRef" tabIndex="0" ref={placeListRef} style={{ outline: codes.length === 0 ? '' : 'rgb(255, 174, 0) 2px solid' }} className="material-model-list">
            {
              places.map(model => {
                const titleArr3 = model.title.split("");
                const inputVal = placeInputRef.current.value;
                const title = <>{titleArr3.map((char, index) => {
                  const strRegExp = new RegExp(`[${inputVal}]`, 'gi');
                  if (strRegExp.test(char)) {
                    return <i key={index}>{char}</i>
                  } else {
                    return char
                  }
                })
                }</>
                return <li key={model.id} onClick={() => setPlaces(model)}>{title}</li>
              })
            }
          </ul>
        }
      </div>
      <div>
        <FaTrashAlt cursor="pointer" onClick={handleRowDelete} title="Sil" color="#ff4a4a" />
      </div>
    </li>
  )
}
export default React.memo(NewOrderTableRow)