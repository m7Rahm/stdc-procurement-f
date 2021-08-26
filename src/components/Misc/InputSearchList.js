import React from "react"
import table from "../../styles/Table.module.css"
const InputSearchList = (props) => {
    const handleFocus = () => {
        props.listRef.current.style.display = 'block'
    }
    const handleBlur = (e) => {
        const relatedTargetid = e.relatedTarget ? e.relatedTarget.id : null
        if (relatedTargetid === null || relatedTargetid !== props.listid)
            props.listRef.current.style.display = 'none'
    }
    return (
        <>
            <input
                onBlur={handleBlur}
                onFocus={handleFocus}
                type="text"
                disabled={props.disabled}
                placeholder={props.placeholder}
                ref={props.inputRef}
                name={props.name}
                defaultValue={props.defaultValue}
                autoComplete="off"
                onChange={props.handleInputChange}
            />
            <ul id={props.listid} tabIndex="0" ref={props.listRef} style={props.style} className={table["material-model-list"]}>
                {
                    props.items.map(item => {
                        const inputVal = props.inputRef.current ? props.inputRef.current.value : ""
                            .replace(/e/gi, 'eə')
                            .replace(/ch?/gi, 'cç')
                            .replace(/i/gi, 'iı')
                            .replace(/gh?/gi, 'gğ')
                            .replace(/sh?/gi, 'sş')
                            .replace(/u/gi, 'uü')
                            .replace(/o/gi, 'oö');
                        // const strRegExp = new RegExp(`[${inputVal}]`, 'gi');
                        // const title = item[props.text].replace(strRegExp, (text) => `<i>${text}</i>`);
                        return <li key={item.id} dangerouslySetInnerHTML={{ __html: item[props.text] }} onClick={(e) => props.handleItemClick(e, item)}></li>
                    })
                }
            </ul>
        </>
    )
}

export default InputSearchList