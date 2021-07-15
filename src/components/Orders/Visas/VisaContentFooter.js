import React, { useContext, useState } from 'react'
import { TokenContext } from '../../../App'
import useFetch from '../../../hooks/useFetch';
import ForwardDocLayout from '../../Misc/ForwardDocLayout';
import OperationResult from '../../Misc/OperationResult'

const AcceptDecline = React.lazy(() => import('../../modal content/AcceptDecline'))
const EditOrder = React.lazy(() => import('./EditOrder'))

const VisaContentFooter = (props) => {
    const { handleEditClick, current, canProceed, updateContent, forwardDoc } = props;
    const tokenContext = useContext(TokenContext);
    const userData = tokenContext[0].userData;
    const canApprove = userData.previliges.find(prev => prev === 'Sifarişi təsdiq etmək');
    const canDecline = userData.previliges.find(prev => prev === 'Sifarişə etiraz etmək');
    const canReturn = userData.previliges.find(prev => prev === 'Sifarişi redaktəyə qaytarmaq');
    const [operationResult, setOperationResult] = useState({ visible: false, desc: '' });
    const fetchPost = useFetch("POST");
    const setIsModalOpen = (order, receivers, originid) => {
        updateContent({
            id: order.id,
            act_date_time: order.act_date_time,
            result: order.result,
            comment: order.comment
        }, receivers, originid)
    }
    const handleForwardOrder = (receivers, comment) => {
        const data = {
            receivers: receivers.map(receiver => [receiver.id]),
            comment: comment
        }
        fetchPost(`/api/forward-order/${current.order_id}`, data)
            .then(respJ => {
                if (respJ.length === 0)
                    forwardDoc(receivers)
                else
                    setOperationResult({ visible: true, desc: 'Xəta baş verdi' })
            })
            .catch(ex => console.log(ex))
    }
    const hoc = (Component, compoProps) => () => {
        if (!Object.values(canProceed.current).includes(false))
            handleEditClick((props) =>
                <Component
                    {...compoProps}
                    {...props}
                />)
        else
            setOperationResult({ visible: true, desc: "Qiymət seçimi tamamlanmamışdır" })
    }
    return (
        current.result === 0 && current.can_influence
            ? <>
                {
                    operationResult.visible &&
                    <OperationResult
                        setOperationResult={setOperationResult}
                        operationDesc={operationResult.desc}
                    />
                }
                <div className="accept-decline-container">
                    {
                        canDecline && current.forward_type <=2 &&
                        <div
                            onClick={
                                hoc(AcceptDecline,
                                    {
                                        handleModalClose: setIsModalOpen,
                                        tranid: current.id,
                                        action: -1,
                                        setSending: props.setSending,
                                        setOperationStateText: props.setOperationStateText,
                                        setOperationResult: setOperationResult,
                                        backgroundColor: '#D93404'
                                    }
                                )
                            }
                            style={{ background: '#D93404' }}
                        >
                            Etiraz
                        </div>
                    }
                    {
                        canApprove && current.forward_type <=2 &&
                        <div
                            onClick={
                                hoc(AcceptDecline,
                                    {
                                        handleModalClose: setIsModalOpen,
                                        tranid: current.id,
                                        setOperationResult: setOperationResult,
                                        action: 1,
                                        setSending: props.setSending,
                                        setOperationStateText: props.setOperationStateText,
                                        backgroundColor: 'rgb(15, 157, 88)'
                                    }
                                )
                            }
                            style={{ background: 'rgb(15, 157, 88)' }}
                        >
                            Təsdiq
                        </div>
                    }
                    {
                        canReturn && current.forward_type === 1 &&
                        <div
                            onClick={
                                hoc(EditOrder,
                                    {
                                        handleModalClose: setIsModalOpen,
                                        tranid: current.id,
                                        setOperationResult: setOperationResult,
                                        operationResult: operationResult,
                                        action: 2,
                                        setModalContent: props.setModalContent,
                                        setSending: props.setSending,
                                        backgroundColor: '#F4B400',
                                        setVisa: props.setVisa,
                                        orderContent: props.orderContent,
                                        setOperationStateText: props.setOperationStateText,
                                        canProceed: props.canProceed,
                                        forwardType: props.forwardType
                                    }
                                )
                            }
                            style={{ background: '#F4B400' }}
                        >
                            Redaktəyə qaytar
                        </div>
                    }
                    {
                        current.forward_type === 3 &&
                        <div
                            onClick={
                                hoc(AcceptDecline,
                                    {
                                        handleModalClose: setIsModalOpen,
                                        tranid: current.id,
                                        setOperationResult: setOperationResult,
                                        action: 1,
                                        setSending: props.setSending,
                                        setOperationStateText: props.setOperationStateText,
                                        backgroundColor: 'rgb(15, 157, 88)'
                                    }
                                )
                            }
                            style={{ background: '#00a3e4' }}
                        >
                            Anbara yönəlt
                        </div>
                    }
                </div>
            </>
            :
            <>
            </>
    )
}
export default VisaContentFooter