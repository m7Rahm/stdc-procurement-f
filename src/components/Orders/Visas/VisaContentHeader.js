import React, { lazy, useState } from 'react'
import { createPortal } from "react-dom"
import { FaCheck, FaTimes } from 'react-icons/fa'
import { IoIosWarning } from 'react-icons/io'
import VisaVersionsContainer from './VisaVersionsContainer'
import ParticipantsR from "../../modal content/ParticipantsR"
const participants_root = document.getElementById('portal');
// const ParticipantsR = lazy(() => import())
const VisaContentHeader = (props) => {
	const { version, current, orderNumb, handleEditClick, updateContent } = props;
	const visaGenInfo = current[0];
	const tranid = current[0].id;
	const [participantsVisiblity, setParticipantsVisiblity] = useState(false);

	const showOrderVersions = () => {
		handleEditClick((props) =>
			<VisaVersionsContainer
				tranid={tranid}
				version={version}
				content={current}
				doneEditing={updateContent}
				orderNumb={orderNumb}
				{...props}
			/>
		)
	}
	const handleParticipantsTransition = () => {
		if (!participantsVisiblity) {
			props.visaContentRef.current.style.right = "25rem";
			props.navigationRef.current.style.right = "25rem";
		} else {
			props.visaContentRef.current.style.right = "0";
			props.navigationRef.current.style.right = "0";
		}
		setParticipantsVisiblity(prev => !prev)
	}
	const closeParticipantsBar = () => {
		props.visaContentRef.current.style.right = "0px";
		setParticipantsVisiblity(false);
	}
	return (
		<>
			<div className="protex-order-header-container">
				<div>
					<h1>
						{`Sifariş № ${orderNumb}`}
					</h1>
					<div className="toggle-participants" onClick={handleParticipantsTransition}>
						Tarixçəni göstər
					</div>
				</div>
				{
					visaGenInfo.result === 1
						? <span>
							<FaCheck size="30" title={visaGenInfo.act_date_time} color="#34A853" />
						</span>
						: visaGenInfo.result === -1
							? <span>
								<FaTimes title={visaGenInfo.act_date_time} size="30" color="#EA4335" />
							</span>
							: visaGenInfo.result === 3
								? <span>
									<IoIosWarning onClick={showOrderVersions} title={visaGenInfo.act_date_time} cursor="pointer" size="30" color="#EA4335" />
								</span>
								: ''

				}
			</div>
			{
				participantsVisiblity &&
				createPortal(
					<ParticipantsR
						navigationRef={props.navigationRef}
						id={visaGenInfo.order_id}
						closeParticipantsBar={closeParticipantsBar}
					/>,
					participants_root
				)
			}
		</>
	)
}
export default VisaContentHeader