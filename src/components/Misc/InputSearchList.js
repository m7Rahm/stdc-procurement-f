import React, { useRef, useState } from "react"
import table from "../../styles/Table.module.css"
const InputSearchList = (props) => {
    const [listVisible, setListVisible] = useState(false);
    const inputRef = useRef(null);
    const handleFocus = (e) => {
        if (props.parentRef) {
            props.parentRef.current.style.zIndex = "22"
        }
        setListVisible(true)
    }
    const handleBlur = (e) => {
        const relatedTargetid = e.relatedTarget ? e.relatedTarget.id : null;

        if (relatedTargetid === null || relatedTargetid !== props.listid) {
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
            {listVisible &&
                <ul id={props.listid} ref={props.listRef} tabIndex="2" style={props.style} className={table["material-model-list"]}>
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
                            }}></li>
                        })
                    }
                </ul>
            }
        </>
    )
}

export default InputSearchList