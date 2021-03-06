import React, { useRef } from 'react'
const getColorBasedOnPriority = (priority) => {
	if (priority === 0)
		return ''
	else if (priority === 1)
		return 'rgb(15, 157, 88)'
	else if (priority === 2)
		return 'rgb(244, 180, 0)'
	else if (priority === 3)
		return 'rgb(217, 52, 4)'
}
const VisaCard = (props) => {
	const {
		activeRef,
		id,
		isOpened,
		from,
		priority,
		date,
		checkedAmount,
		iconsPanelRef,
		setIconsVisible,
		setActive,
		// orderid,
		ord_numb
	} = props;
	const stateRef = useRef(null);
	const checkBoxRef = useRef(null)
	const isReadDivRef = useRef(null);
	const backgroundColor = getColorBasedOnPriority(priority);
	const handleCheck = (e) => {
		const prevAmount = checkedAmount.current.length;
		const checked = e.target.checked;
		if (checked)
			checkedAmount.current.push(id)
		else {
			for (let i = 0; i < checkedAmount.current.length; i++)
				if (checkedAmount.current[i] === id)
					checkedAmount.current.splice(i, 1);
		}
		if (prevAmount * checkedAmount.current.length === 0) {
			if (checkedAmount.current.length === 0) {
				iconsPanelRef.current.classList.toggle('icons-panel-hide');
				iconsPanelRef.current.addEventListener('animationend', () => {
					setIconsVisible(false);
					iconsPanelRef.current.classList.remove('icons-panel-hide');
				})
			}
			else
				setIconsVisible(prev => !prev)
		}
	}
	const handleClick = () => {
		window.history.replaceState(null, "", window.location.origin + `/orders/visas/${id}`);
		if (!isOpened) {
			const event = new CustomEvent("inAppEvent", {
				detail: { tranid: id, docType: 0, categoryid: 1 }
			});
			window.dispatchEvent(event)
		}
		setActive(id)
		activeRef.current.style.background = activeRef.current.prevBackColor;
		stateRef.current.style.background = 'skyblue'
		activeRef.current = stateRef.current;
		activeRef.current.prevBackColor = backgroundColor;
		isReadDivRef.current.style.display = 'none';
	}
	return (
		<li onClick={handleClick} ref={stateRef} style={{ backgroundColor: backgroundColor }}>
			<div style={{ height: 'inherit' }}>
				<div ref={isReadDivRef} style={{ width: '3px', float: 'right', height: '100%', background: 'steelblue', display: !isOpened ? 'block' : 'none' }}></div>
				<div style={{ padding: '5px', height: '100%' }}>
					<div style={{ height: '100%', float: 'left', padding: '15px 15px 0px 10px' }}>
						<input ref={checkBoxRef} type="checkbox" onChange={handleCheck} style={{ padding: '3px' }} ></input>
					</div>
					<div style={{ height: '29px', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<span style={{ fontSize: '17px', fontWeight: 200, color: backgroundColor !== '' ? 'white' : '#545454' }}>
							{from}
						</span>
						<span style={{ fontSize: '12px', fontWeight: 200, verticalAlign: 'baseline', color: backgroundColor !== '' ? 'white' : 'gray' }}>
							{date}
						</span>
					</div>
					<div>
						<span style={{ fontSize: '12px', fontWeight: 200, verticalAlign: 'baseline', color: backgroundColor !== '' ? 'white' : 'gray' }}>
							{"Deadline: " + props.deadline}
						</span>
						<span style={{ fontSize: '17px', fontWeight: 500, verticalAlign: 'baseline', float: 'right', color: backgroundColor !== '' ? 'white' : 'rgb(217, 52, 4)' }}>
							{ord_numb}
						</span>
					</div>
					<div>
						<span style={{ fontSize: '12px', fontWeight: 200, verticalAlign: 'baseline', color: backgroundColor !== '' ? 'white' : 'gray' }}>
							{props.order_type === 0 ? "mal-material" : "xidm??t"}
						</span>
					</div>
				</div>
			</div>
		</li>
	)
}
export default React.memo(VisaCard)