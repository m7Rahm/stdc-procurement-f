import React, { useEffect, useState } from 'react'
import { FaCheck, FaTimes, FaHourglassHalf, FaPen, FaUserEdit } from 'react-icons/fa'
import useFetch from '../../hooks/useFetch'
import { } from "react-icons/"

const getResultText = (result) => {
    if (result === 0)
        return <FaHourglassHalf title='Baxılır...' />
    else if (result === -1)
        return <FaTimes color="red" title="Etiraz Edildi" />
    else if (result === 1)
        return <FaCheck color="green" title="Təsdiq Edildi" />
    else if (result === 2)
        return <FaUserEdit title="Redaktəyə qaytarıldı" />
    else if (result === 3)
        return <FaPen color="orange" title="Redaktə Edildi" />
}

const ParticipantsR = (props) => {
    const { id } = props;
    const [participants, setParticipants] = useState(null);
    const fetchGet = useFetch("GET");
    const navigationRef = props.navigationRef;
    useEffect(() => {
        const navBar = navigationRef.current;
        navBar.style.right = "25rem";
        fetchGet(`/api/participants/${id}?type=1`)
            .then(respJ => setParticipants(respJ))
            .catch(err => console.log(err))
        return () => {
            navBar.style.right = "0px";
        }
    }, [id, fetchGet, navigationRef])
    const closeParticipantsBar = props.closeParticipantsBar
    return (
        participants &&
        <div className="sidebar3">
            <div>
                <FaTimes onClick={closeParticipantsBar} />
                İştirakçılar
            </div>
            <ul className='participantsR'>
                {
                    participants.map((participant, index) =>
                        <li key={index}>
                            <div>
                                {participant.full_name}
                                {getResultText(participant.result)}
                                <div style={{ fontWeight: "650", fontSize: "0.8rem", color: '#1665d8' }}>{participant.vezife || ""}</div>
                            </div>
                            <div style={{ textAlign: "left", position: "relative" }}>
                                {/*participant.comment*/"asdsadas"}
                                <span>
                                    {participant.act_date_time || participant.date_time}
                                </span>
                            </div>
                            {/* <span style={{fontSize: "10px", float: "right", padding: "2px 5px", width: "100px"}}>{participant.act_date_time || participant.date_time}</span> */}
                        </li>
                    )
                }
            </ul>
        </div>
    )
}

export default ParticipantsR;