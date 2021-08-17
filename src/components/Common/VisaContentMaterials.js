import React, { useState } from 'react'
import OperationResult from '../Misc/OperationResult'

const VisaContentMaterials = (props) => {
	const { forwardType, canProceed, orderContent } = props;
	const [operationResult, setOperationResult] = useState({ visible: false, desc: '' });
	const { emp_version_id } = props.orderContent[0];
	let orders = orderContent;
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
			<table className="order-table-protex" style={{minWidth:"100%"}} >
				<thead>
					<tr>
						<td>#</td>
						<td style={{ textAlign: 'left', maxWidth: "300px" }}>Məhsul</td>
						<td style={{ maxWidth: '140px' }}>Kod</td>
						<td style={{ maxWidth: '140px' }}>Say</td>
						<td style={{ maxWidth: '140px' }}>İstifadə yeri</td>
						<td>Əlavə məlumat</td>
						<td style={{ maxWidth: '140px' }}>Təsviri</td>
						{
							forwardType >= 4 &&
							<>
								<td style={{ maxWidth: "100px" }}>Qalıq</td>
								<td>Çatışmayan</td>
							</>
						}
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
								setRemainder={props.setRemainder}
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
	const { index, forwardType } = props;
	const {
		amount,
		material_comment,
		material_name,
		title,
		product_id,
		mat_ass,
		in_warehouse_amount: inWarehouseAmount,
		description,
		order_material_id: id,
		can_influence: canInfluence
	} = props.material;
	const inputChangeHandler = (e) => {
		const value = e.target.value;
		if (value === "")
			props.setRemainder(id, 0)
		else if (/^\d+(\.\d{0,2})?$/.test(value)) {
			if (value[0] === "0" && value[1] !== ".")
				props.setRemainder(id, value.slice(1))
			else
				props.setRemainder(id, value)
		}
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
			{
				forwardType >= 4 &&
				<>
					<td style={{ maxWidth: "100px" }}>
						<input style={{ border: "none", width: "100%" }} disabled={!canInfluence || forwardType !== 4} value={inWarehouseAmount} onChange={inputChangeHandler} />
					</td>
					<td>{inWarehouseAmount > amount ? 0 : amount - inWarehouseAmount}</td>
				</>
			}
		</tr>
	)
}