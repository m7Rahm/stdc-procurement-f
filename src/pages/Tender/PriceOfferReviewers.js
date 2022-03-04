import { useEffect, useRef, useState, memo, Suspense } from "react"
import Loading from "../../components/Misc/Loading";
import MySelections from "../../components/Orders/Agreements/MySelections";
import useFetch from "../../hooks/useFetch";
import table from "../../styles/App.module.css"
const PriceOfferReviewers = (props) => {
    const { order_id, refresh } = props
    const [reviewers, set_reviewers] = useState([]);
    const selections_ref = useRef([])
    const fetchGet = useFetch("GET");
    const [expand, set_expand] = useState(false);
    const [selections, set_selections] = useState([]);

    // const selected = useRef({ style: { backgroundColor: "" } })
    const show_selections = (user_id) => {
        const user_selections = selections_ref.current.filter(selection => selection.reviewer_id === user_id);
        set_expand(user_id);
        set_selections(user_selections);
    }
    useEffect(() => {
        let mounted = true;
        if (mounted)
            fetchGet(`/api/price-offer-selections?oid=${order_id}&o=0`)
                .then(resp => {
                    if (mounted && resp.lenth !== 0) {
                        selections_ref.current = resp;
                        const reviewers = [];
                        for (let i = 0; i < resp.length; i++) {
                            if (!reviewers.find(rew => rew.reviewer_id === resp[i].reviewer_id)) {
                                reviewers.push(resp[i])
                            }
                        }
                        set_reviewers(reviewers)
                    }
                })
                .catch(ex => console.log(ex));
        return () => { mounted = false }
    }, [order_id, fetchGet, refresh]);
    return (
        <div className={table["reviewers-container"]}>
            {
                reviewers.map(reviwer =>
                    <div
                        key={reviwer.reviewer_id}
                        onMouseEnter={() => show_selections(reviwer.reviewer_id)}
                        onMouseLeave={() => set_expand(false)}
                    >
                        {reviwer.full_name}
                        {
                            reviwer.reviewer_id === expand &&
                            <Suspense fallback={<Loading />}>
                                <div style={{ position: "absolute", zIndex: 1 }}>
                                    <MySelections download={false} order_id={order_id} user_id={reviwer.reviewer_id} user_selections={selections} />
                                </div>
                            </Suspense>
                        }
                    </div>
                )
            }
        </div>
    )
}
export default memo(PriceOfferReviewers)