import React, { lazy, Suspense } from "react"
import useFetch from "../../hooks/useFetch.js";
const DecommissionContent = lazy(() => import("../MiscDocs/DecommissionContent"));
const BudgetIncRequestContent = lazy(() => import("../MiscDocs/BudgetIncRequestContent"))
const MiscDocContainer = (props) => {
    const { docid, docType } = props;
    const fetchParticipantsFunc = useFetch("GET")
    const fetchParticipants = () => fetchParticipantsFunc(`/api/misc-doc-participants?docid=${docid}&docType=${docType}`)

    return (
        <>
            <Suspense fallback="">
                {
                    docType === 1
                        ? <BudgetIncRequestContent
                            docid={docid}
                            docType={docType}
                            fetchParticipants={fetchParticipants}
                            setInitData={props.setInitData}
                        />
                        : docType === 2
                            ? <DecommissionContent
                                docid={docid}
                                docType={docType}
                                fetchParticipants={fetchParticipants}
                                setInitData={props.setInitData}
                            />
                            : <>
                            </>
                }
            </Suspense>
        </>
    )
}
export default React.memo(MiscDocContainer)