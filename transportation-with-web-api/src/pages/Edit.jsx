import {useParams} from "react-router-dom";
import EditCountry from "../components/EditCountry.jsx";

const Edit = () => {
	const {id} = useParams();
	return(
		<EditCountry id={id}/>
	)
}

export default Edit;