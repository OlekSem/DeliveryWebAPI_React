import {Card, Row, Col} from "antd";
import { EditOutlined, EllipsisOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import {useEffect, useState} from "react";
import APP_ENV from "../env/index.js";
import {Link} from "react-router-dom";

const {Meta} = Card;

const Countries = () => {
	const api = `${APP_ENV.API_BASE_URL}/api/Countries`;

	const [loading, setLoading] = useState(true)
	const [countries, setCountries] = useState([])

	const getCountries = async () => {
		fetch(api)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				setCountries(data);
				setLoading(false)
			});
	}

	const deleteCountry = async (id) => {
		await fetch(api + '/delete/' + id, {
			method: "DELETE"
		});
		await getCountries();
	}

	useEffect(() => {
		getCountries();
	}, []);

	return (
		<div className={'p-8'}>
			<Row justify={'center'} gutter={[16, 16]}>
				{countries.map((c, index) => {
					const key = `col-${index}`;
					return (
						<Col span={16}
							 key={key}
							 xs={{flex: '50%'}}
							 sm={{flex: '50%'}}
							 md={{flex: '40%'}}
							 lg={{flex: '30%'}}
							 xl={{flex: '30%'}}
						>
							<Card
								loading={loading}
								hoverable
								cover={
									<img draggable={false}
										 alt={c.name}
										 src={APP_ENV.API_BASE_URL + "/images/" + c.image}
									/>
								}
								actions={[
									<Link to={`/edit/${c.id}`} key={"edit/" + c.id}>
										<EditOutlined />
									</Link>,
									<DeleteOutlined onClick={async () => await deleteCountry(c.id)} key="delete"/>,
								]}
							>
								<Meta title={c.name} description={c.code}/>
							</Card>

						</Col>
					);
				})}
			</Row>
		</div>
	)
}

export default Countries