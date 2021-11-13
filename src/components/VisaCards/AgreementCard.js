import React, { useRef } from 'react'
const today = new Date();
const weekday = new Array(7);
weekday[0] = "Bazar.";
weekday[1] = "Bazar. E.";
weekday[2] = "Çərşənbə. A.";
weekday[3] = "Çərşənbə";
weekday[4] = "Cümə A.";
weekday[5] = "Cümə";
weekday[6] = "Şənbə";
const get_date_format = (date) => {
    if (date.getDate() === today.getDate()) {
        return `${date.getUTCHours()}:${date.getUTCMinutes()}`
    } else {
        return `${weekday[date.getDay()]}  ${date.getUTCHours()}:${date.getUTCMinutes()}`
    }
}
const AgreementCard = (props) => {
    const date_time = new Date(props.card.date_time)
    const stateRef = useRef(null);
    const display = !props.card.is_read ? 'block' : 'none';
    const handleClick = () => {
        if (props.activeRef.current)
            props.activeRef.current.style.backgroundColor = "transparent";
        stateRef.current.style.backgroundColor = "skyblue";
        if (!props.card.is_read) {

        }
        props.activeRef.current = stateRef.current;
        window.history.replaceState(null, "", `${window.location.origin}${props.path_name}/${props.card.id}`)
        props.setActive(props.card.id)
    }
    return (
        <li onClick={handleClick} ref={stateRef} >
            <div style={{ height: 'inherit' }}>
                <div style={{ width: '3px', float: 'right', height: '100%', background: 'steelblue', display: display }}></div>
                <div style={{ padding: '5px', height: '100%' }}>
                    <div style={{ height: '29px', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textOverflow: "ellipsis" }}>
                        <span className="full-name" style={{ fontSize: '17px', fontWeight: 200, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                            {props.card.full_name}
                        </span>
                        <span className="date-time" style={{ fontSize: '12px', fontWeight: 200, verticalAlign: 'baseline' }}>
                            {get_date_format(date_time)}
                        </span>
                    </div>
                    <div style={{ height: '15px', position: 'relative' }}>
                        <span style={{ fontSize: '12px', fontWeight: 500, verticalAlign: 'baseline', float: "left", color: 'rgb(217, 52, 4)' }}>
                            {props.card.department_name}
                        </span>
                        <span className="deadline" style={{ fontSize: '12px', fontWeight: 200, verticalAlign: 'baseline', float: "right", color: 'gray' }}>
                            {"Deadline: " + props.deadline}
                        </span>
                    </div>
                    <div style={{ height: '23px', paddingTop: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'gray', float: 'left', position: 'relative', zIndex: 0, background: 'whitesmoke', padding: '0px 5px 0px 0px' }}>
                            {props.card.comment}
                        </span>
                    </div>
                </div>
            </div>
        </li>
    )
}
export default AgreementCard