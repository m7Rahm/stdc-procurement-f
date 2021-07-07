import React, { useRef, useState } from "react"
import {
	FaPlus,
	FaTrashAlt,
	FaMinus
} from "react-icons/fa"
import useFetch from "../../hooks/useFetch";
import InputSearchList from "../Misc/InputSearchList";
const EditOrderTableRow = ({ index, row, setOrderState, departments, view, orderType, structure }) => {
	const rowid = row.id;
	const modelsRef = useRef([]);
	const codeRef = useRef(null);
	const rowRef = useRef(null);
	const assignmentRef = useRef(null)
	const modelListRef = useRef(null);
	const timeoutRef = useRef(null);
	const modelInputRef = useRef(null);
	const [deps, setDeps] = useState(departments)
	const fetchPost = useFetch("POST");
	const handleAssignmentBlur = (e) => {
		const relatedTarget = e.relatedTarget
		if (relatedTarget && relatedTarget.classList.contains("structure-dep")) {
			relatedTarget.click()
		}
	}
	const handleAssignmentChange = (e) => {
		const value = e.target.value;
		const charArray = value.split("")
		const reg = charArray.reduce((conc, curr) => conc += curr !== "\\" ? curr + "(.*)" : curr + "\\(.*)", "")
		const regExp = new RegExp(reg, "i")
		setDeps(departments.filter(dep => dep.name.match(regExp)))
	}
	const searchByCode = (e) => {
		const data = { product_id: e.target.value, orderType: orderType, structure: structure };
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		timeoutRef.current = setTimeout(() => {
			fetchPost("/api/get-by-product-code", data)
				.then(respJ => {
					timeoutRef.current = null;
					if (respJ.length !== 0) {
						const updatedRow = respJ.length === 1
							? {
								models: respJ,
								budget: respJ[0].budget,
								title: respJ[0].title,
								material_id: respJ[0].id,
								isAmortisized: respJ[0].is_amortisized,
								department_name: respJ[0].department_name
							}
							: { models: respJ, title: "", material_id: "NaN" }
						if (respJ.length === 1) {
							modelListRef.current.style.display = "none";
						} else if (respJ.length > 1) {
							modelListRef.current.style.display = "block";
						}
						setOrderState(prev => prev.map(row => row.id !== rowid
							? row
							: ({ ...row, ...updatedRow })
						));
					}
				})
				.catch(ex => {
					console.log(ex);
					timeoutRef.current = null;
				})
		}, 500)
	};
	const handleAmountChange = (e) => {
		const value = e.target.value;
		const name = e.target.name;
		if (value === "" || Number(value) > 0) {
			setOrderState(prev => prev.map(row => row.id !== rowid ? row : ({ ...row, [name]: value })))
		}
	}
	const handleAmountFocusLose = (e) => {
		const value = e.target.value;
		const name = e.target.name
		if (value === "")
			setOrderState(prev => prev.map(row => row.id !== rowid ? row : ({ ...row, [name]: 1 })))
	}
	const handleAmountChangeButtons = (action) => {
		setOrderState(prev => prev.map(row => row.id !== rowid ? row : ({ ...row, amount: action === "inc" ? Number(row.amount) + 1 : Number(row.amount) - 1 })))
	}
	const handleChange = (e) => {
		const value = e.target.value;
		const name = e.target.name;
		setOrderState(prev => prev.map(row => row.id !== rowid ? row : ({ ...row, [name]: value })))
	}
	const handleRowDelete = () => {
		if (view === "returned") {
			rowRef.current.classList.add("delete-row");
			rowRef.current.addEventListener("animationend", () => {
				setOrderState(prev => prev.filter(row => row.id !== rowid))
			})
		}
	}
	const setModel = (_, model) => {
		setOrderState(prev => prev.map(row => row.id !== rowid ? row : ({
			...row,
			material_id: model.id,
			title: model.title,
			department_name: model.department_name
		})))
		codeRef.current.value = model.product_id;
		modelListRef.current.style.display = "none";
	}

	const handleInputSearch = (e) => {
		const value = e.target.value;
		const name = e.target.name;
		const charArray = value.split("")
		const reg = charArray.reduce((conc, curr) => conc += `${curr}(.*)`, "")
		const regExp = new RegExp(`${reg}`, "i");
		const searchResult = modelsRef.current.filter(model => regExp.test(model.title))
		setOrderState(prev => prev.map(row => row.id !== rowid ? row : ({ ...row, [name]: value, models: searchResult })))
	}
	const setAssignment = (department) => {
		assignmentRef.current.value = department.name;
		setOrderState(prev => prev.map(row => row.id !== rowid ? row : ({
			...row,
			assignment_id: department.id,
			department_name: department.department_name
		})))
	}
	return (
		<li ref={rowRef} className={row.className}>
			<div>{index + 1}</div>
			<div style={{ position: "relative" }}>
				<InputSearchList
					defaultValue={row.title}
					placeholder="Istifadə yeri"
					text="name"
					name="place"
					disabled={view !== "returned"}
					listid="placeListRef"
					inputRef={modelInputRef}
					listRef={modelListRef}
					handleInputChange={handleInputSearch}
					items={row.models}
					handleItemClick={setModel}
					style={{ width: '150px', maxWidth: ' 200px', outline: row.models.length === 0 ? '' : 'rgb(255, 174, 0) 2px solid' }}
				/>
			</div>
			<div style={{ position: "relative", width: "170px", maxWidth: "200px" }}>
				<input
					onChange={searchByCode}
					type="text"
					disabled={view !== "returned"}
					ref={codeRef}
					placeholder="Kod"
					defaultValue={row.product_id}
					name="product_id"
				/>
			</div>
			<div style={{ maxWidth: "140px" }}>
				<div style={{ backgroundColor: "transparent", padding: "0px 15px" }}>
					{
						view !== "protected" &&
						<FaMinus cursor="pointer" onClick={() => handleAmountChangeButtons("dec")} color="#ffae00" style={{ margin: "0px 3px" }} />
					}
					<input
						name="amount"
						disabled={view !== "returned"}
						style={{ width: "40px", textAlign: "center", padding: "0px 2px", margin: "0px 5px", flex: 1 }}
						type="text"
						onBlur={handleAmountFocusLose}
						onChange={handleAmountChange}
						value={row.amount}
					/>
					{
						view !== "protected" &&
						<FaPlus cursor="pointer" onClick={() => handleAmountChangeButtons("inc")} color="#3cba54" style={{ margin: "0px 3px" }} />
					}
				</div>
			</div>
			<div style={{ position: "relative", zIndex: "2" }}>
				<input
					onBlur={handleAssignmentBlur}
					type="text"
					defaultValue={row.assignment_name}
					name="assignment"
					autoComplete="off"
					ref={assignmentRef}
					disabled={view === "protected"}
					className="assignment-input"
					onChange={handleAssignmentChange}
				/>
				<ul style={{ top: "40px" }} className="structures-list">
					{
						deps.map((department, index) => {
							const inputVal = assignmentRef.current ? assignmentRef.current.value.replace("-", "\\-") : "";
							const strRegExp = new RegExp(`[${inputVal}]`, 'gi');
							const title = department.name.replace(strRegExp, (text) => `<i>${text}</i>`);
							return <li className="structure-dep" tabIndex={index} dangerouslySetInnerHTML={{ __html: title }} key={department.id} onClick={() => setAssignment(department)}></li>
						})
					}
				</ul>
			</div>
			<div>
				<input
					style={{ width: "100%" }}
					placeholder="Link və ya əlavə məlumat"
					name="material_comment"
					disabled={view !== "returned"}
					value={row.material_comment || ""}
					type="text"
					onChange={handleChange}
				/>
			</div>
			<div>
				<input
					style={{ width: "100%" }}
					placeholder="Təsvir"
					name="description"
					disabled={view !== "returned"}
					value={row.description || ""}
					type="text"
					onChange={handleChange}
				/>
			</div>
			<div>
				{view === "returned" &&
					<FaTrashAlt cursor="pointer" onClick={handleRowDelete} title="Sil" color="#ff4a4a" />
				}
			</div>
		</li>
	)
}
export default React.memo(EditOrderTableRow)