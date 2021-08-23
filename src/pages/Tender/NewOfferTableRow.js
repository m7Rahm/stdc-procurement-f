import React, { useRef, useState } from 'react'
import { BsArrowsAngleExpand } from 'react-icons/bs'
import { FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa'
import { MdExpandMore } from "react-icons/md"
import InputSearchList from '../../components/Misc/InputSearchList'
// eslint-disable-next-line
import useFetch from '../../hooks/useFetch'
import table from "../../styles/Table.module.css"

function NewOfferTableRow(props) {
    const rowRef = useRef(null);
    const { rowid, additionalInfo, count, handleRowDelete } = props;
    const modelListRef = useRef(null);
    const fetchGet = useFetch("GET")
    const [expandDetails, setExpandDetails] = useState(false);
    // eslint-disable-next-line
    const [models, setModels] = useState([]);
    const modelInputRef = useRef(null);
    const [total, setTotal] = useState(props.count * props.price);
    const priorityRef = useRef(null);
    const handleFocusLose = (e) => {
        const relatedTarget = e.relatedTarget;
        if ((!relatedTarget || !relatedTarget.classList.contains("priority")) && priorityRef.current) {
            priorityRef.current.classList.add(table["close-priority-list"])
            priorityRef.current.addEventListener("animationend", () => setExpandDetails(false), false);
        }
    }
    const handleAmountChangeButtons = (action) => {
        props.handleChange("count", undefined, rowid, true, action)
        if (action === 'inc') {
            setTotal(props.price * (props.count + 1))
            props.handleChange('total', props.price * (props.count + 1), rowid)
        } else setTotal(props.price * (props.count - 1))

    }

    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        if (name === "price") {
            setTotal(value * props.count)
            props.handleChange('total', value * props.count, rowid)
        }
        props.handleChange(name, value, rowid)
    }

    const handleTotalChange = (e) => {
        const value = e.target.value;
        setTotal(value);
        props.handleChange('total', value, rowid)
        handleAmountChange2(value);
    }

    const handleAmountChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        if (value === '' || Number(value) > 0) {
            setTotal(value * props.price)
            props.handleChange(name, value, rowid)
        }
    }

    const handleAmountChange2 = (value) => {
        if (props.count !== 0 || Number(props.count) > 0) {
            props.handleChange("price", Math.floor(value / props.count), rowid)
        }
    }

    const setModel = (_, model) => {
        props.handleModelSelection(model, rowid);
        modelInputRef.current.value = model.title;
        modelListRef.current.style.display = "none";
    }

    const handleInputSearch = (e) => {
        const value = e.target.value;
        // eslint-disable-next-line
        let valueWithoutE = value.replace(/e/gi, '[eə]')
            .replace(/ch?/gi, '[cç]')
            .replace(/o/gi, '[oö]')
            .replace(/i/gi, '[iı]')
            .replace(/gh?/gi, '[gğ]')
            .replace(/sh?/gi, '[sş]')
            .replace(/u/gi, '[uü]');
        props.searchByMaterialName(value, rowid)
        fetchGet(`/api/material-by-title?title=${encodeURIComponent(valueWithoutE)}&orderType=${0}`)
            .then(respJ => {
                setModels(respJ)
            })
            .catch(ex => console.log(ex))
    }
    return (
        <li ref={rowRef} id={rowid} className={props.classname}>
            <div style={{ position: "relative" }}>
                <div style={{ backgroundImage: `linear-gradient(to right, #${props.color.toString(16)}, transparent)` }} className={table["material-color-indicator"]}></div>
                {props.index + 1}
            </div>
            <div style={{ position: 'relative' }} className={table["input-container"]}>
                <InputSearchList
                    listid="modelListRef"
                    // disabled={props.disabled}
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
            </div>
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
            <div>
                <input
                    style={{ width: '100%' }}
                    placeholder="0"
                    name="cem"
                    disabled={props.disabled}
                    value={total}
                    type="number"
                    onChange={handleTotalChange}
                />
            </div>
            <div style={{ position: "relative" }}>
                {
                    !props.alternative
                        ? <MdExpandMore size="20" onBlur={handleFocusLose} cursor="pointer" tabIndex={props.index} onClick={() => setExpandDetails(true)} color="#ff4a4a" />
                        : <FaTrashAlt cursor="pointer" onClick={() => handleRowDelete(rowRef)} color="#ff4a4a" />
                }
                {expandDetails &&
                    <ul ref={priorityRef} className={table["priorities-list"]} style={{ top: "20px", zIndex: "3" }}>
                        <li
                            className="priority"
                            style={{ padding: "13px 26px", width: "fit-content" }}
                            onBlur={handleFocusLose}
                            tabIndex="1"
                            id={rowid}
                            title="Alternativ əlavə et"
                            onClickCapture={props.handleAddClick}
                        >
                            Alternativ <BsArrowsAngleExpand style={{ position: "absolute", left: "0.5rem" }} />
                        </li>
                        <li
                            className="priority"
                            style={{ padding: "13px 26px" }}
                            tabIndex="2"
                            onClick={() => handleRowDelete(rowRef)}
                        >
                            Sil <FaTrashAlt style={{ position: "absolute", left: "0.5rem" }} />
                        </li>
                    </ul>
                }
            </div>
        </li>
    )
}

export default NewOfferTableRow
