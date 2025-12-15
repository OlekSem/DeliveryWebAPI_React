import {useEffect, useState} from "react";
import APP_ENV from "../env/index.js";
import {Card, Col, Row, Tag} from "antd";
import {Meta} from "react-router-dom";
import {DeleteOutlined} from "@ant-design/icons";

const Cities = () => {
	const api = `${APP_ENV.API_BASE_URL}/api/Cities`;
	const [cities, setCities] = useState([])

	const getCities = async () => {
		fetch(api)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				setCities(data);
			});
	}

	const deleteCity = async (id) => {
		await fetch(`${api}/${id}`, { method: "DELETE" });
		await getCities();
	}

	useEffect(() => {
		getCities();
	}, []);

	return (
		<div className={'p-8'}>
			<Row justify={'center'} gutter={[16, 16]}>
				{cities.map((c, index) => {
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
							<Card style={{height: '100%'}}
								  hoverable
								  cover={
									  <img draggable={false}
										   alt={c.name}
										   src={APP_ENV.API_BASE_URL + "/images/" + (c.image || 'defaultCity.webp')}
									  />
								  }
								  actions={[
									  // <Link to={`/edit/${c.id}`} key={"edit/" + c.id}>
									  //   <EditOutlined />
									  // </Link>,
									  <DeleteOutlined onClick={async () =>{ await deleteCity(c.id); console.log(c.id);}} key="delete"/>,
								  ]}
							>
								<Card.Meta
									title={c.name}
									description={
										<>
											<div
												dangerouslySetInnerHTML={{__html: c.description}}
												style={{maxHeight: 150, overflow: "hidden"}}
											/>
											<Tag style={{marginTop: 10}} color="blue">{c.country}</Tag>
										</>
									}
								/>
							</Card>

						</Col>
					);
				})}
			</Row>
		</div>
	)
}
export default Cities