import React, { useRef, useState } from "react"
import { MdAddCircle } from "react-icons/md";
import table from "../../styles/Table.module.css"
const InputSearchList = (props) => {
    const [listVisible, setListVisible] = useState(false);
    const inputRef = useRef(null);
    const newItemRef = useRef(undefined);
    const handleFocus = (e) => {
        if (props.parentRef) {
            props.parentRef.current.style.zIndex = "22"
        }
        setListVisible(true)
    }
    const handleBlur = (e) => {
        const relatedTargetid = e.relatedTarget ? e.relatedTarget.id : null;
        const proceed = e.relatedTarget === newItemRef.current
        if ((relatedTargetid === null || relatedTargetid !== props.listid) && !proceed) {
            if (props.onBlur)
                props.onBlur(inputRef)
            setListVisible(false)
            if (props.parentRef) {
                props.parentRef.current.style.zIndex = "1"
            }
        }
    }
    return (
        <>
            <input
                onBlur={handleBlur}
                onFocus={handleFocus}
                type="text"
                disabled={props.disabled}
                placeholder={props.placeholder}
                ref={inputRef}
                name={props.name}
                defaultValue={props.defaultValue}
                autoComplete="off"
                style={props.inputStyle}
                onChange={props.handleInputChange}
            />
            {listVisible && props.items.length !== 0 &&
                <div style={{ borderRadius: "5px", zIndex: 3, top: "40px", overflow: "hidden", boxShadow: "0px 1px 4px 3px rgba(0, 0, 0, 0.3)", position: "absolute", ...props.style }}>
                    <ul id={props.listid} ref={props.listRef} tabIndex="2" className={table["material-model-list"]}>
                        {
                            props.items.map(item => {
                                let inputVal = inputRef.current ? inputRef.current.value : ""
                                    .replace(/e/gi, 'eə')
                                    .replace(/ch?/gi, 'cç')
                                    .replace(/i/gi, 'iı')
                                    .replace(/gh?/gi, 'gğ')
                                    .replace(/sh?/gi, 'sş')
                                    .replace(/u/gi, 'uü')
                                    .replace(/o/gi, 'oö')
                                inputVal = inputVal.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
                                const strRegExp = new RegExp(`[${inputVal}]`, 'gi');
                                const title = item[props.text].replace(strRegExp, (text) => `<i>${text}</i>`);
                                return <li key={item.id} dangerouslySetInnerHTML={{ __html: title }} onClick={(e) => {
                                    props.handleItemClick(e, item, inputRef);
                                    setListVisible(false);
                                    if (props.parentRef) {
                                        props.parentRef.current.style.zIndex = "1"
                                    }
                                }}>
                                </li>
                            })
                        }
                    </ul>
                    {
                        props.addNewItem &&
                        <div
                            tabIndex="100"
                            ref={newItemRef}
                            style={{ backgroundColor: "lawngreen", color: "white", cursor: "pointer", padding: "5px 8px", fontStyle: "italic", position: "relative" }}
                            onClickCapture={() => {
                                props.handleAddNewItemClick(inputRef.current.value);
                                setListVisible(false);
                            }}
                        >
                            Vendor əlavə et
                            <span style={{ position: "absolute", top: "50%", right: "10px", transform: "translateY(-50%)" }}>
                                <MdAddCircle color="white" />
                            </span>
                        </div>
                    }
                </div>
            }
        </>
    )
}

export default InputSearchList