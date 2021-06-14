import React, { useEffect, useState } from 'react'
import Loading from '../Misc/Loading'
import useFetch from '../../hooks/useFetch'

const getResultText = (result) => {
    if (result === 0)
        return 'Baxılır..'
    else if (result === -1)
        return 'Etiraz Edildi'
    else if (result === 1)
        return 'Təsdiq Edildi'
    else if (result === 2)
        return 'Redaytəyə Qaytarıldı'
    else if (result === 3)
        return 'Redaktə Edildi'
}

const ParticipantsR = (props) => {
    const { id } = props;
    const [checked, setChecked] = useState(false);
    const [participants, setParticipants] = useState(null);
    const fetchGet = useFetch("GET");
    const handleChange = () => {
        setChecked(prev => !prev);
    }
    useEffect(() => {
        fetchGet(`/api/participants/${id}?type=1`)
            .then(respJ => setParticipants(respJ)
            )
            .catch(err => console.log(err))
    }, [id, fetchGet])
    console.log(participants)
    return (
        participants &&
        <div className="sidebar3">
            <ul className='participantsR'>
                <li>
                    <div>Ad Soyad</div>
                    <div>Status</div>
                    <div>Qeyd</div>
                    {/* <div style={{ textAlign: 'left' }}>Qeyd</div> */}
                </li>
                {
                    participants.map((participant, index) =>
                        <li key={index}>
                            <div>{participant.full_name}
                                <div style={{ fontWeight: '600', fontSize: 11, color: '#777777' }}>{participant.vezife || ""}</div>
                            </div>
                            <div>{getResultText(participant.result)}</div>
                            {/* <div>{participant.act_date_time || participant.date_time}</div> */}
                            <div>{/*participant.comment*/"asdsadas"}
                                <div style={{ fontWeight: '600', fontSize: 11, color: '#777777' }}>{participant.act_date_time || participant.date_time}</div>
                            </div>
                            {/* <span style={{fontSize: "10px", float: "right", padding: "2px 5px", width: "100px"}}>{participant.act_date_time || participant.date_time}</span> */}
                        </li>
                    )
                }
            </ul>
            {/*
          participants.map((participant, index) =>
          <div className="order-card-info-wrapper"
                    style={{ display: 'flex', flexDirection: 'column' }}
                >
                    <div className="order-card-info-additional">
                        <div className="order-card-info ">{participant.full_name}</div>
                    </div>
                    <div className="order-card-info-additional">
                        <div className="order-card-info ">{participant.vezife || ""}</div>
                    </div>
                    <div className="order-card-info-additional">
                        <div className="order-card-info ">{participant.act_date_time || participant.date_time}</div>
                    </div>
                    <div className="order-card-info-additional">
                        <div className="order-card-info ">{getResultText(participant.result)}</div>
                    </div>
                    {participant.comment!==""?
                      <div className="order-card-info-additional">
                          <div className="order-card-info ">{participant.comment}</div>
                      </div>
                      :
                      <></>
                    }
                </div>
          )
        */}
        </div>
    )
}

export default ParticipantsR;