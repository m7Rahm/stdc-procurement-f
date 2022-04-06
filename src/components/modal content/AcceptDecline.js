import React, { useRef } from 'react'
import useFetch from '../../hooks/useFetch';
const AcceptDecline = (props) => {
    const { tranid, backgroundColor, action, setOperationResult } = props;
    const commentRef = useRef(null);
    const fetchPost = useFetch("POST");
    const placeholder = action
        ? "Əlavə qeydlərinizi daxil edin.."
        : "Səbəb göstərin";
    const handleClick = () => {
        if ((commentRef.current.value !== '' || action !== -1)) {
            const data = {
                action: action,
                comment: commentRef.current.value,
            }
            fetchPost(`/api/accept-decline/${tranid}`, data)
                .then(respJ => {
                    if (respJ.length !== 0 && !respJ[0].error) {
                        // const [{ origin_emp_id: originid }, ...rest] = respJ
                        const receivers = respJ.map(receiver => {
                            const { id, notif_type, module_id, sub_module_id, doc_type, ...rest } = receiver;
                            return {
                                id,
                                notif_type,
                                module_id,
                                sub_module_id,
                                doc_type,
                                data: { ...rest, doc_number: "undefined" }
                            }
                        })
                        props.handleModalClose({
                            id: tranid,
                            act_date_time: "Biraz öncə",
                            result: action,
                            comment: commentRef.current.value
                        }, receivers);
                    }
                    else if (respJ[0].error)
                        setOperationResult({ visible: true, desc: respJ[0].error })
                })
                .catch(err => console.log(err))
        }
    }
    return (
        <div className="accept-decline">
            <div>
                <textarea
                    style={{ minHeight: '150px' }}
                    placeholder={placeholder}
                    ref={commentRef}
                >
                </textarea>
            </div>
            <div onClick={handleClick} style={{ backgroundColor: backgroundColor }}>
                Göndər
            </div>
        </div>
    )
}
export default AcceptDecline