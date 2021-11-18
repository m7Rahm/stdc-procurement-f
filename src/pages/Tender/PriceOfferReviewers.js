import { useEffect, useRef, useState, memo } from "react"
import useFetch from "../../hooks/useFetch";
import table from "../../styles/App.module.css"
const PriceOfferReviewers = (props) => {
    const { order_id, refresh } = props
    const [reviewers, set_reviewers] = useState([]);
    const selections_ref = useRef([])
    const fetchGet = useFetch("GET");
    const selected = useRef({ style: { backgroundColor: "" } })
    const handle_click = (e, user_id) => {
        selected.current.style.backgroundColor = "lightblue";
        e.target.style.backgroundColor = "red";
        selected.current = e.target;
        const user_selections = selections_ref.current.filter(selection => selection.reviewer_id === user_id)
        console.log(user_selections)

    }
    useEffect(() => {
        let mounted = true;
        if (mounted)
            fetchGet(`/api/price-offer-selections?oid=${order_id}&o=0`)
                .then(resp => {
                    console.log(resp)
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
                        onClick={(e) => handle_click(e, reviwer.reviewer_id)}
                    >
                        {reviwer.full_name}
                    </div>
                )
            }
        </div>
    )
}
export default memo(PriceOfferReviewers)