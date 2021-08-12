import React, { useRef, useState } from 'react'
import { FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa'
import InputSearchList from '../../components/Misc/InputSearchList'
import { productUnit } from '../../data/data'
import useFetch from '../../hooks/useFetch'


function NewOfferTableRow(props) {
    const rowRef = useRef(null);
    const { orderType, offerid, additionalInfo, count, handleRowDelete } = props;
    const modelListRef = useRef(null);
    const [models, setModels] = useState([]);
    const modelInputRef = useRef(null);
    const timeoutRef = useRef(null);
    const sumRef = useRef(null);
    const fetchGet = useFetch("GET");
    const fetchPost = useFetch("POST");
    const [total, setTotal] = useState(0);


    const handleAmountChangeButtons = (action) => {
        props.handleChange("count", undefined, offerid, true, action)
    }

    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        props.handleChange(name, value, offerid)
    }

    const handleTotalChange = (e) => {
        const value = e.target.value;
        setTotal(value);
    }

    const handleAmountChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        if (value === '' || Number(value) > 0) {
            props.handleChange(name, value, offerid)
        }
    }

    return (
        <li ref={rowRef} id={offerid}>
            <div>{props.index + 1}</div>

            {/*Ad*/}
            <div style={{ position: 'relative', width: '170px', maxWidth: '200px' }}>
                <input
                    type="text"
                    placeholder="Kod"
                    // disabled={props.disabled}
                    // defaultValue={props.code}
                    // ref={codeRef}
                    name="model"
                    autoComplete="off"
                // onChange={searchByCode}
                />
            </div>

            {/* <div style={{ position: 'relative' }}>
                <InputSearchList
                    listid="modelListRef"
                    disabled={props.disabled}
                    defaultValue={props.offerName}
                    placeholder="Məhsul"
                    inputRef={modelInputRef}
                    listRef={modelListRef}
                    name="model"
                    text="title"
                    items={models}
                    handleInputChange={handleInputSearch}
                    handleItemClick={setModel}
                />
            </div> */}

            {/*Say*/}
            <div style={{ maxWidth: '140px' }}>
                <div style={{ backgroundColor: 'transparent', padding: '0px 15px' }}>
                    {!props.disabled && <FaMinus cursor="pointer" onClick={() => { if (count > 1) handleAmountChangeButtons('dec') }} color="#ffae00" style={{ margin: '0px 3px' }} />}
                    <input
                        name="count"
                        disabled={props.disabled}
                        style={{ width: '40px', textAlign: 'center', padding: '0px 2px', margin: '0px 5px', flex: 1 }}
                        type="text"
                        // onBlur={handleAmountFocusLose}
                        onChange={handleAmountChange}
                        value={count}
                    />
                    {!props.disabled && <FaPlus cursor="pointer" onClick={() => handleAmountChangeButtons('inc')} color="#3cba54" style={{ margin: '0px 3px' }} />}
                </div>
            </div>

            {/*Qeyd*/}
            <div>
                <input
                    style={{ width: '100%' }}
                    placeholder="Qeyd"
                    name="note"
                    disabled={props.disabled}
                    value={additionalInfo}
                    type="text"
                    onChange={handleChange}
                />
            </div>

            {/*Qiymet*/}
            <div>
                <input
                    style={{ width: '100%' }}
                    placeholder="0"
                    name="price"
                    disabled={props.disabled}
                    value={props.price}
                    type="number"
                    onChange={handleChange}
                />
            </div>


            {/*Cem*/}
            <div ref={sumRef}>
                <input
                    style={{ width: '100%' }}
                    placeholder="0"
                    name="cem"
                    disabled={props.disabled}
                    value={props.price * props.count}
                    defaultValue={0}
                    type="number"
                    onChange={handleTotalChange}
                />
            </div>

            <div>
                <FaTrashAlt cursor="pointer" onClick={e => handleRowDelete(rowRef)} title="Sil" color="#ff4a4a" />
            </div>

        </li>
    )
}

export default NewOfferTableRow
