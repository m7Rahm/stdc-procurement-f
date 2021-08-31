import "../../styles/Tender.css"
const DeleteDocButton=(props)=>{
    return( <div className={"filesDeleteButton"} id={props.id} onClick={props.deleteDocHandler}>x</div>)
}
export default DeleteDocButton;