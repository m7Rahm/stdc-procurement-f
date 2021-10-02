import React, { useCallback, useState } from 'react'
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
  const tran_id = /\d+/.exec(window.location.pathname);
  const [active, setActive] = useState(tran_id);
  const fetchPost = useFetch("POST");
  const updateList = useCallback((data) => fetchPost('/api/visas', data), [fetchPost]);
  return (
    <div style={{ display: 'flex', position: 'relative' }}>
      <SideBar
        updateList={updateList}
        setActive={setActive}
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