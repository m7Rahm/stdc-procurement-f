import React, { useRef, useState } from 'react'
import { FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa'
import useFetch from '../../../hooks/useFetch';
import InputSearchList from '../../Misc/InputSearchList';

const NewOrderTableRow = (props) => {
  const rowRef = useRef(null);
  const { orderType, materialid, className, additionalInfo, count, place, handleRowDelete } = props;
  const [models, setModels] = useState([]);
  const modelListRef = useRef(null);
  const timeoutRef = useRef(null);
  const codeRef = useRef(null);
  const fetchGet = useFetch("GET");
  const fetchPost = useFetch("POST")

  const handleAmountChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    if (value === '' || Number(value) > 0) {
      props.handleChange(name, value, materialid)
    }
  }
  const handleAmountFocusLose = (e) => {
    const value = e.target.value;
    const name = e.target.name
    if (value === '')
      props.handleChange(name, value, materialid)
  }
  const handleAmountChangeButtons = (action) => {
    props.handleChange("count", undefined, materialid, true, action)
  }

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    props.handleChange(name, value, materialid)
  }

  const setModel = (_, model, inputRef) => {
    props.handleModelSelection(model, materialid)
    codeRef.current.value = model.product_id;
    inputRef.current.value = model.title;
    // modelListRef.current.style.display = "none";
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
    props.searchByMaterialName(value, materialid)
    fetchGet(`/api/material-by-title?title=${encodeURIComponent(valueWithoutE)}&orderType=${orderType}`)
      .then(respJ => {
        setModels(respJ)
      })
      .catch(ex => console.log(ex))
  }

  const searchByCode = (e) => {
    const data = { product_id: e.target.value, orderType: orderType };
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    timeoutRef.current = setTimeout(() => {
      fetchPost('/api/get-by-product-code', data)
        .then(respJ => {
          timeoutRef.current = null;
          modelListRef.current.style.display = "block";
          setModels(respJ);
        })
        .catch(ex => {
          console.log(ex);
          timeoutRef.current = null;
        })
    }, 500)
  }
  return (
    <li ref={rowRef} id={materialid} className={className}>
      <div>{props.index + 1}</div>
      {/* Məhsul */}
      <div style={{ position: 'relative' }}>
        <InputSearchList
          listid="modelListRef"
          disabled={props.disabled}
          defaultValue={props.materialName}
          placeholder="Məhsul"
          listRef={modelListRef}
          name="model"
          text="title"
          style={{ backgroundColor: "white", minWidth: "200px" }}
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
          disabled={props.disabled}
          defaultValue={props.code}
          ref={codeRef}
          name="model"
          autoComplete="off"
          onChange={searchByCode}
        />
      </div>
      {/* Say */}
      <div style={{ maxWidth: '140px', justifyContent: "center" }}>
        <div style={{ backgroundColor: 'transparent', padding: '0px 15px' }}>
          {!props.disabled && <FaMinus cursor="pointer" onClick={() => { if (count > 1) handleAmountChangeButtons('dec') }} color="#ffae00" style={{ margin: '0px 3px' }} />}
          <input
            name="count"
            disabled={props.disabled}
            style={{ width: '40px', textAlign: 'center', padding: '0px 2px', margin: '0px 5px', flex: 1 }}
            type="text"
            onBlur={handleAmountFocusLose}
            onChange={handleAmountChange}
            value={count}
          />
          {!props.disabled && <FaPlus cursor="pointer" onClick={() => handleAmountChangeButtons('inc')} color="#3cba54" style={{ margin: '0px 3px' }} />}
        </div>
      </div>
      {/* Ölçü vahidi */}
      <div style={{ maxWidth: '140px', justifyContent: "center" }}>
        Ədəd
        {/* <select
          name="unit"
          disabled={props.disabled}
          value={props.unit}
          onChange={handleChange}
        >
          {
            productUnit.map(unit =>
              <option value={unit.val} key={unit.val}>{unit.text}</option>
            )
          }
        </select> */}
      </div>

      {/* Istifade yeri */}
      <div>
        <input
          style={{ width: '100%' }}
          placeholder="Link və ya əlavə məlumat"
          name="place"
          disabled={props.disabled}
          value={place || ""}
          type="text"
          onChange={handleChange}
        />
      </div>
      {/* Əlavə məlumat */}
      <div>
        <input
          style={{ width: '100%' }}
          placeholder="Link və ya əlavə məlumat"
          name="additionalInfo"
          disabled={props.disabled}
          value={additionalInfo}
          type="text"
          onChange={handleChange}
        />
      </div>
      <div>
        {!props.disabled && <FaTrashAlt cursor="pointer" onClick={e => handleRowDelete(rowRef)} title="Sil" color="#ff4a4a" />}
      </div>
    </li>
  )
}
export default React.memo(NewOrderTableRow)