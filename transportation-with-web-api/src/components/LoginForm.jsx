import {Button, Checkbox, Form, Input} from "antd";
import APP_ENV from "../env/index.js";
import {useDispatch} from "react-redux";
import {loginSuccess} from "../services/authSlice.js";
import {useNavigate} from "react-router-dom";


const LoginForm = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onFinish = async values => {
		console.log('Success:', values);

		const res = await fetch(`${APP_ENV.API_BASE_URL}/api/Account/Login`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(values)
			});
		const json = await res.json();
		console.log(json);
		dispatch(loginSuccess(json.token));
		navigate('/');
	};
	const onFinishFailed = errorInfo => {
		console.log('Failed:', errorInfo);
	};

	return(
		<Form
			name="basic"
			labelCol={{ span: 8 }}
			wrapperCol={{ span: 16 }}
			style={{ maxWidth: 600, marginTop: '1.5rem'}}
			initialValues={{ remember: true }}
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
			autoComplete="off"
		>
			<Form.Item
				label="Email"
				name="email"
				rules={[{ required: true, message: 'Please input your email!' }]}
			>
				<Input />
			</Form.Item>

			<Form.Item
				label="Password"
				name="password"
				rules={[{ required: true, message: 'Please input your password!' }]}
			>
				<Input.Password />
			</Form.Item>

			<Form.Item label={null}>
				<Button type="primary" htmlType="submit">
					Submit
				</Button>
			</Form.Item>
		</Form>
	)
}
export default LoginForm;