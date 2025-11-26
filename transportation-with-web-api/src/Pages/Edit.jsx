import {useParams} from "react-router-dom";
import EditCountry from "../Components/EditCountry.jsx";

const Edit = () => {
	const {id} = useParams();
	return(
		<EditCountry id={id}/>
	)
}

export default Edit;