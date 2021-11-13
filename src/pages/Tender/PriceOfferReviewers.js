import { useEffect, useRef, useState } from "react"
import useFetch from "../../hooks/useFetch";

const PriceOfferReviewers = (props) => {
    const { order_id, refresh } = props
    const [reviewers, set_reviewers] = useState([]);
    const selections_ref = useRef([]);
    const fetchGet = useFetch("GET");
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
        <div>
            {
                reviewers.map(reviwer =>
                    <div key={reviwer.reviewer_id}>{reviwer.full_name}</div>
                )
            }
        </div>
    )
}
export default PriceOfferReviewers