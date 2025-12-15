import {Form, Select, Input, Space, Button, Upload} from "antd";
import APP_ENV from "../env/index.js";
import {useState} from "react";
import {PlusOutlined} from "@ant-design/icons";

const formItemLayout = {
	labelCol: {
		xs: {span: 24},
		sm: {span: 8},
	},
	wrapperCol: {
		xs: {span: 24},
		sm: {span: 16},
	},
};
const tailFormItemLayout = {
	wrapperCol: {
		xs: {
			span: 24,
			offset: 0,
		},
		sm: {
			span: 16,
			offset: 8,
		},
	},
};

const RegisterForm = () => {
	const [form] = Form.useForm();
	const [fileList, setFileList] = useState([]);
	const onFinish = async values => {
		console.log("Received values:", values);

		const formData = new FormData();

		Object.keys(values).forEach(key => {
			if (key !== "image") formData.append(key, values[key]);
		});

		if (fileList.length > 0) {
			formData.append("image", fileList[0].originFileObj);
		}

		const res = await fetch(`${APP_ENV.API_BASE_URL}/api/Account/Register`, {
			headers: {
				accept: '*/*',
			},
			method: "POST",
			body: formData
		});

		const json = await res.json();
		console.log(json);

		if (json.token) {
			localStorage.setItem("token", json.token);
		}
	};
	const prefixSelector = (
		<Form.Item name="prefix" noStyle>
			<Select
				style={{width: 90}}
				defaultValue={'380'}
				options={[
					{label: '+380', value: '380'},
					{label: '+48', value: '48'},
				]}
			/>
		</Form.Item>
	);
	return (
		<Form
			{...formItemLayout}
			form={form}
			name="register"
			onFinish={onFinish}
			style={{maxWidth: 600, marginTop: 20}}
			scrollToFirstError
		>
			<Form.Item
				name="firstName"
				label="First Name"
				rules={[
					{
						required: true,
						message: 'Please input your first name!',
					},
				]}
			>
				<Input/>
			</Form.Item>
			<Form.Item
				name="lastName"
				label="Last Name"
				rules={[
					{
						required: true,
						message: 'Please input your last name!',
					},
				]}
			>
				<Input/>
			</Form.Item>
			<Form.Item
				name="email"
				label="E-mail"
				rules={[
					{
						type: 'email',
						message: 'The input is not valid E-mail!',
					},
					{
						required: true,
						message: 'Please input your E-mail!',
					},
				]}
			>
				<Input/>
			</Form.Item>

			<Form.Item
				name="password"
				label="Password"
				rules={[
					{
						required: true,
						message: 'Please input your password!',
					},
				]}
				hasFeedback
			>
				<Input.Password/>
			</Form.Item>

			<Form.Item
				name="confirmPassword"
				label="Confirm Password"
				dependencies={['password']}
				hasFeedback
				rules={[
					{
						required: true,
						message: 'Please confirm your password!',
					},
					({getFieldValue}) => ({
						validator(_, value) {
							if (!value || getFieldValue('password') === value) {
								return Promise.resolve();
							}
							return Promise.reject(new Error('The new password that you entered do not match!'))
						},
					}),
				]}
			>
				<Input.Password/>
			</Form.Item>

			<Form.Item
				name="phone"
				label="Phone Number"
				rules={[{required: true, message: 'Please input your phone number!'}]}
			>
				<Space.Compact block>
					{prefixSelector}
					<Input style={{width: '100%'}}/>
				</Space.Compact>
			</Form.Item>
			<Form.Item label={"Image"} name={'image'}>
				<Upload
					beforeUpload={() => false}
					listType="picture-card"
					fileList={fileList}
					onChange={({ fileList: newList }) => setFileList(newList)}
					maxCount={1}
				>
					{fileList.length === 0 && (
						<div>
							<PlusOutlined />
							<div style={{ marginTop: 8 }}>Upload</div>
						</div>
					)}
				</Upload>
			</Form.Item>
			<Form.Item {...tailFormItemLayout}>
				<Button type="primary" htmlType="submit">
					Register
				</Button>
			</Form.Item>
		</Form>
	)
}
export default RegisterForm;