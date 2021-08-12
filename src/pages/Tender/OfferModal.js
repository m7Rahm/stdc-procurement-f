import React from 'react'
import NewOfferTableBody from './NewOfferTableBody'
import '../../styles/Orders.css'

function OfferModal(props) {
    return (
        <div>
            <NewOfferTableBody
                // eslint-disable-next-line
                orderInfo={0,""}
                choices={props.choices}
                setChoices={props.setChoices}
            />
            <div className="priceTags saveButton">Yadda saxla</div>
        </div>
    )
}

export default OfferModal
