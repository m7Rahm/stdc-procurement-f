import React, { useCallback, useEffect, useRef, useState } from 'react'
import SideBar from '../../components/Common/SideBar'
import VisaContent from '../../components/Orders/Visas/VisaContent'
import useFetch from '../../hooks/useFetch'

const initData = {
  userName: '',
  startDate: null,
  endDate: null,
  docType: -3,
  from: 0,
  until: 20
}

const documentType = 10
const Visas = (props) => {
  const o_index = window.location.pathname.match(/(\d+)$/);
  const event_name = useRef(`${props.module_id}-${props.sub_module_id}`);
  const orderid = o_index ? Number(o_index[1]) : undefined;
  useEffect(() => {
    setActive((prev) => {
      return prev !== orderid ? orderid : prev;
    });
  }, [orderid])
  const [active, setActive] = useState(orderid);
  const fetchPost = useFetch("POST");
  const updateList = useCallback((data) => fetchPost('/api/visas', data), [fetchPost]);
  return (
    <div style={{ display: 'flex', position: 'relative' }}>
      <SideBar
        updateList={updateList}
        setActive={setActive}
        event_name={event_name.current}
        initData={initData}
      />
      <VisaContent
        tranid={active}
        setActive={setActive}
        navigationRef={props.navigationRef}
        documentType={documentType}
      />
    </div>
  )
}
export default Visas