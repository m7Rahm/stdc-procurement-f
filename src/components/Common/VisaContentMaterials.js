import React, { useState, useRef, useContext } from 'react'
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa'
import OperationResult from '../Misc/OperationResult'
import useFetch from '../../hooks/useFetch'
import { TokenContext } from '../../App'

const VisaContentMaterials = (props) => {
	const { forwardType, canProceed, orderContent } = props;
	const tokenContext = useContext(TokenContext)
	const userData = tokenContext[0].userData;
	const [operationResult, setOperationResult] = useState({ visible: false, desc: '' });
	const { emp_version_id, order_type } = props.orderContent[0];
	let orders = [];
	if (forwardType === 3)
		orders = orderContent.filter(material => material.techizatci_id === userData.userInfo.structureid)
	else
		orders = orderContent
	return (
		orders.length !== 0 &&
		<>
			{
				operationResult.visible &&
				<OperationResult
					setOperationResult={setOperationResult}
					operationDesc={operationResult.desc}
				/>
			}
			<table className="order-table-protex" >
				<thead>
					<tr>
						<td>#</td>
						<td style={{ textAlign: 'left', maxWidth: "300px" }}>Məhsul</td>
						<td style={{ maxWidth: '140px' }}>Kod</td>
						<td style={{ maxWidth: '140px' }}>Say</td>
						<td style={{ maxWidth: '140px' }}>İstifadə yeri</td>
						{
							((forwardType === 3 || forwardType === 5) && order_type === 1) &&
							<td style={{ maxWidth: '140px' }}>Məbləğ</td>
						}
						<td>Əlavə məlumat</td>
						<td style={{ maxWidth: '140px' }}>Təsviri</td>
						<td style={{ width: '50px', flex: 'none' }}></td>
					</tr>
				</thead>
				<tbody>
					{
						orders.map((material, index) =>
							<TableRow
								index={index}
								setOperationResult={setOperationResult}
								key={material.order_material_id}
								canProceed={canProceed}
								empVersion={emp_version_id}
								userData={userData}
								forwardType={forwardType}
								material={material}
							/>
						)
					}
				</tbody>
			</table>
			<div className="sender-comment">{orders[0].sender_comment}</div>
		</>
	)
}

export default React.memo(VisaContentMaterials)

const TableRow = (props) => {
	const { canProceed, setOperationResult, index, forwardType, userData } = props;
	const {
		amount,
		material_comment,
		order_material_id,
		material_name,
		total,
		department_id,
		order_type,
		title,
		result,
		product_id,
		mat_ass,
		description,
		can_influence: canInfluence
	} = props.material;
	const fetchPost = useFetch("POST");
	const structureid = userData.userInfo.structureid;
	const [disabled, setDisabled] = useState(true);
	const servicePriceRef = useRef(null);
	let canEdit = false;
	if (forwardType === 5)
		canEdit = structureid === department_id
	else if (forwardType === 3)
		canEdit = true;
	const handleEditClick = () => {
		setDisabled(prev => {
			canProceed.current[order_material_id] = !prev;
			return !prev
		})
	}
	const handleDone = () => {
		const data = {
			materialid: order_material_id,
			price: servicePriceRef.current.value
		}
		fetchPost('/api/update-service-price', data)
			.then(respJ => {
				if (respJ[0].operation_result === 'success')
					setDisabled(prev => {
						canProceed.current[order_material_id] = !prev;
						return !prev
					})
				else
					setOperationResult({ visible: true, desc: respJ[0].operation_result })
			})
			.catch(ex => console.log(ex))
	}
	const handleCancel = () => {
		servicePriceRef.current.value = total;
		canProceed.current[order_material_id] = true;
		setDisabled(true)
	}
	return (
		<tr>
			<td>{index + 1}</td>
			<td style={{ textAlign: 'left' }}>
				{material_name || title}
			</td>
			<td style={{ textAlign: 'left', maxWidth: "140px" }}>
				{product_id}
			</td>
			<td style={{ maxWidth: '140px' }}>
				<div style={{ backgroundColor: 'transparent', padding: '0px 15px' }}>
					<div style={{ width: '40px', textAlign: 'center', padding: '0px 2px', margin: 'auto', flex: 1 }}>
						{amount}
					</div>
				</div>
			</td>
			<td style={{ maxWidth: "140px" }}>
				{mat_ass}
			</td>
			{
				((forwardType === 3 || forwardType === 5) && order_type === 1) &&
				<td style={{ maxWidth: '140px' }}>
					<input disabled={disabled} defaultValue={total} ref={servicePriceRef} />
				</td>
			}
			<td>
				<span style={{ width: '100%' }} >
					{material_comment}
				</span>
			</td>
			<td>
				<span style={{ width: '100%' }} >
					{description}
				</span>
			</td>
			<td style={{ minWidth: '50px', flex: 'none' }}>
				{
					canEdit && order_type === 1 && result === 0 && canInfluence &&
					<>
						{
							disabled && result === 0
								? <FaEdit cursor="pointer" color="#F4B400" onClick={handleEditClick} />
								: <>
									<FaCheck color="#0F9D58" cursor="pointer" onClick={handleDone} />
									<FaTimes color="#ff4a4a" cursor="pointer" onClick={handleCancel} />
								</>
						}
					</>
				}
			</td>
		</tr>
	)
}