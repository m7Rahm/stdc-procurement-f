import React, { useEffect } from "react"

const OperationStateLite = React.forwardRef((props, ref) => {
    const { state, setState } = props;
    useEffect(() => {
        const element = ref.current;
        const handleAnimationEnd = () => {
            setState(undefined)
        }
        if (state === false)
            element.addEventListener("animationend", handleAnimationEnd, false);
        return () => {
            element.removeEventListener("animationend", handleAnimationEnd, false);
        }
    }, [state, setState, ref])
    return (
        <div ref={ref} className="operation-state-lite">
            {props.text}
        </div>
    )
})

export default OperationStateLite