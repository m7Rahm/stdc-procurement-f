import React, { useContext } from 'react'
import '../../../styles/Orders.css'
import { IoIosClose } from 'react-icons/io'
import { colors } from '../../../data/data'
import { ThemeContext } from '../../../App'
const UnfinishedModal = (props) => {
    const handleClick = (emp) => {
        props.handleSelectChange(emp);
    }
    const handleOrderClick = (orderId) => {
        props.handleOrderSelect(orderId);
    }
    const theme = useContext(ThemeContext)[0]
    return (
        <div className="order-card-wrapper">
            <div onClick={() => handleClick(props.emp)} className="order-card-close-button">
                <IoIosClose className="close-button-card" size="18" />
            </div>
            <div
                className="order-card"
                onClick={() => handleOrderClick(props.emp.id)}
                style={{ left: "0px" }}
            >
                <div className="order-card-info-wrapper"
                    style={{ display: 'flex', flexDirection: 'column' }}
                >
                    <div className="order-card-info-number-wrap" style={{ background: colors[theme].secondary }} >
                        <div className="order-card-info order-card-info-number">Sifariş № {(props.emp.name + 1)}</div>
                    </div>
                    {/* <div className="order-card-info-additional">
                        <div className="order-card-info ">Növü: {props.emp.value[0] === 0 ? "Mal-material" : "Xidmət"}</div>
                    </div>
                    <div className="order-card-info-additional">
                        <div className="order-card-info ">Son tarix: {props.emp.value[1].toISOString().split('T')[0]}</div>
                    </div>
                    <div className="order-card-info-additional">
                        <div className="order-card-info ">Məhsul sayı: {props.emp.value[2].length}</div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}
export default UnfinishedModal