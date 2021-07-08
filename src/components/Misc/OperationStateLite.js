import React, { useEffect, useRef } from "react"

const OperationStateLite = (props) => {
    const { state, setState } = props;
    const ref = useRef(null)
    useEffect(() => {
        const element = ref.current;
        const handleAnimationEnd = () => {
            setState(undefined)
        }
        if (state === false) {
            element.style.animation = "visibility-hide 500ms ease-in-out both";
            element.addEventListener("animationend", handleAnimationEnd, false);
        }
        return () => {
            element.removeEventListener("animationend", handleAnimationEnd, false);
        }
    }, [state, setState])
    return (
        <div ref={ref} onClick={props.handleOperationStateClick} style={{ width: "fit-content" }} className="operation-state-lite">
            {props.text}
        </div>
    )
}

export default OperationStateLite