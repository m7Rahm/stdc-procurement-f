import React, { useContext } from 'react'
import { TokenContext } from '../../../App'

function ReturnedOrderCards(props) {
    const tokenContext = useContext(TokenContext)
    const userData = tokenContext[0].userData;
    return (
        <div style={{ cursor: "pointer" }} id={props.orderid} onClick={props.handleCardClick}>
            <div
                className="order-card"
                style={{ left: "0px" }}
            >
                <div className="order-card-info-wrapper"
                    style={{ display: 'flex', flexDirection: 'column' }}
                >
                    <div className="order-card-info-number-wrap" style={{ backgroundColor: props.order[0].emp_id !== userData.userInfo.id ? "rgb(217, 52, 4)" : "" }}>
                        <div className="order-card-info order-card-info-number">
                            {props.full_name}
                            {/* <div style={{ float: "right", color: "white", marginRight: "5px" }}>{props.order[0].create_date_time}</div> */}
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {props.order.map((mat, index) =>
                            <div key={index} style={{ display: 'flex', flexDirection: 'row' }}>
                                <div className="order-card-info-additional" style={{ flex: '2' }}>
                                    <div className="order-card-info ">{mat.material_name}</div>
                                </div>
                                <div className="order-card-info-additional" style={{ flex: '1' }}>
                                    <div className="order-card-info ">{mat.amount}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReturnedOrderCards
