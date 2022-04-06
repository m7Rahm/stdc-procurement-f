import React, { useContext, useState, useCallback } from 'react';
import Modal from '../../Misc/Modal'
import VisaContentMaterials from '../../Common/VisaContentMaterials'
import VisaContentHeader from './VisaContentHeader'
import { WebSocketContext } from '../../../pages/SelectModule'
import Chat from '../../Misc/Chat';
import useFetch from '../../../hooks/useFetch';
import ReactDOM from 'react-dom';
const portal_root = document.getElementById('portal');
const OrderContentProtected = (props) => {
	const { current, canProceed, setVisa, footerComponent: Component } = props;
	const forwardType = current[0].forward_type;
	const webSocket = useContext(WebSocketContext);
	const [modalContent, setModalContent] = useState({ visible: false, content: null });
	const orderid = current[0].order_id;
	const handleModalClose = () => {
		setModalContent(prev => ({ ...prev, visible: false }));
	}
	const fetchPost = useFetch("POST");
	const fetchGet = useFetch("GET");
	const sendMessage = useCallback((data) => {
		const apiData = { ...data, docType: 10 };
		return fetchPost(`/api/send-message`, apiData)
	}, [fetchPost]);
	const fetchMessages = useCallback((from = 0) =>
		fetchGet(`/api/messages/${orderid}?from=${from}&replyto=0&doctype=${10}`)
		, [orderid, fetchGet]);
	const handleEditClick = (content) => {
		setModalContent({ visible: true, content, title: "Sifariş № ", number: current[0].ord_numb });
	}
	const updateContent = (updatedCtnt, receivers) => {
		// console.log(receivers)
		const message = JSON.stringify({
			message: "notification",
			receivers,
			data: undefined
		})
		webSocket.send(message)
		setModalContent(prev => ({ ...prev, visible: false }))
		setVisa(prev => prev.map((row, index) => index === 0 ? ({ ...row, ...updatedCtnt }) : row));
	}
	const setRemainder = (id, value) => {
		setVisa(prev => prev.map((row, index) => row.order_material_id === id ? ({ ...row, in_warehouse_amount: value }) : row));
	}
	return (
		current &&
		<div style={{ padding: "20px" }}>
			<>
				{
					modalContent.visible &&
					ReactDOM.createPortal(
						<Modal canBeClosed={true} style={{ overflow: "visible" }} title="Sifariş № " number={current[0].ord_numb} changeModalState={handleModalClose}>
							{modalContent.content}
						</Modal>,
						portal_root
					)
				}
				<VisaContentHeader
					updateContent={updateContent}
					current={current}
					navigationRef={props.navigationRef}
					visaContentRef={props.visaContentRef}
					version={current[0].emp_version_id}
					handleEditClick={handleEditClick}
					intention={current[0].intention}
					orderNumb={current[0].ord_numb}
					clicked={props.clicked}
				/>
			</>
			<VisaContentMaterials
				orderContent={current}
				setRemainder={setRemainder}
				canProceed={canProceed}
				forwardType={forwardType}
			/>
			<Component
				current={current[0]}
				canProceed={canProceed}
				handleEditClick={handleEditClick}
				updateContent={updateContent}
				orderContent={current}
				setVisa={setVisa}
				setModalContent={setModalContent}
				setSending={props.setSending}
				setOperationStateText={props.setOperationStateText}
				forwardType={forwardType}
			/>
			<Chat
				loadMessages={fetchMessages}
				documentid={orderid}
				documentType={10}
				sendMessage={sendMessage}
			/>
		</div>
	)
}
export default OrderContentProtected
