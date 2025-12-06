import {Avatar, Button, Card, Descriptions} from "antd";
import APP_ENV from "../env/index.js";
import {useEffect, useState} from "react";

const UserProfile = () => {
	const api = `${APP_ENV.API_BASE_URL}`;
	const [user, setUser] = useState({});

	useEffect(() => {
		const getUserProfile = async () => {
			console.log(localStorage.getItem('token'));
			const res = await fetch(api + '/api/Account/GetProfile',
				{
					method: "GET",
					headers: {
						accept: '*/*',
						Authorization: "Bearer " + localStorage.getItem('token')
					}
				})
			console.log(res);
			if(res.ok){
				const json = await res.json();
				console.log(json)
				setUser(json);
			}
		}
		getUserProfile()
	}, []);
	return (
		<Descriptions
			title="User Profile"
			bordered
			column={1}
			extra={<Avatar size={64} src={`${api}/images/${user.image}`} />}
		>
			<Descriptions.Item label="Name">{user.fullName}</Descriptions.Item>
			<Descriptions.Item label="Email">{user.email}</Descriptions.Item>
			<Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>

		</Descriptions>
	)
}
export default UserProfile;