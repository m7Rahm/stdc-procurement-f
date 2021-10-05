import React, { useRef } from 'react'

const CardsList = (Card) => function SideBarContent(props) {
    const { cards = [], setActive } = props;
    const activeRef = useRef({ style: { background: '' } });
    return (
        <ul>
            {
                cards.map(card =>
                    <Card
                        params={props.params}
                        key={card.id}
                        path_name={props.path_name}
                        card={card}
                        setActive={setActive}
                        activeRef={activeRef}
                    />
                )
            }
        </ul>

    )
}
export default CardsList