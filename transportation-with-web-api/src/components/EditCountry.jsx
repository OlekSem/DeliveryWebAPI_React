import {Button, Form, Image, Input, Upload} from "antd";
import APP_ENV from "../env/index.js";
import {PlusOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";

const toSlug = (text) => {
	return text
		.toString() // Ensure the input is a string
		.normalize('NFD') // Decompose accented characters into base letter and accent
		.replace(/[\u0300-\u036f]/g, '') // Remove all diacritics (accents)
		.toLowerCase() // Convert the string to lowercase
		.trim() // Remove leading/trailing whitespace
		.replace(/[^a-z0-9\s-]/g, '') // Remove all characters that are not letters, numbers, spaces, or hyphens
		.replace(/\s+/g, '-') // Replace spaces with a single hyphen
		.replace(/-+/g, '-'); // Replace multiple consecutive hyphens with a single hyphen
}


const EditCountry = ({id}) => {
	const api = `${APP_ENV.API_BASE_URL}/api/Countries`
	const [form] = Form.useForm();
	const [imageFile, setImageFile] = useState();
	const [fileList, setFileList] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		fetch(api + '/edit/' + id, {
			method: "GET",
		}).then(response => {
			return response.json();
		}).then(data => {
			console.log(data)
			form.setFieldsValue({
				name: data.name,
				code: data.code,
				slug: toSlug(data.name)
			});
			setImageFile(data.image);
			setFileList([
			]);
		})
	}, []);

	const onFinish = async (values) => {
		const formData = new FormData();

		formData.append('Id', id);
		formData.append('Name', values.name);
		formData.append('Code', values.code);
		formData.append('Slug', toSlug(values.name));
		if (fileList.length > 0) {
			formData.append("Image", fileList[0].originFileObj);
		}
		const res = await fetch(api + '/edit/' + id, {
			method: 'PUT',
			body: formData
		});

		const json = await res.json();

		console.log(Object.fromEntries(formData.entries()));
		console.log(res);
		console.log(json);

		if (!res.ok) {
			if (json.errors) {
				const fields = Object.keys(json.errors).map(key => ({
					name: key.toLowerCase(),
					errors: json.errors[key]
				}));

				form.setFields(fields);
			}
		}
		else{
			navigate('/')
		}
	}
	return(
		<Form
			form={form}
			onFinish={onFinish}
			layout={'vertical'}
		>
			<Form.Item label={'Name'} required name={'name'}>
				<Input placeholder={'Enter the name of the country'}/>
			</Form.Item>
			<Form.Item label={'Code'} required name={'code'}>
				<Input placeholder={'Enter the code of the country'}/>
			</Form.Item>
				<Image
					alt={'current image'}
					width={100}
					src={`${APP_ENV.API_BASE_URL}/images/${imageFile}`}
				/>
			<Form.Item label={"Image"}  name={'image'}>
				<Upload
					beforeUpload={() => false}
					listType="picture-card"
					fileList={fileList}
					onChange={({fileList: newList}) => {
						setFileList(newList);
					}}
					maxCount={1}
				>
						<div>
							<PlusOutlined />
							<div style={{ marginTop: 8 }}>Upload</div>
						</div>
				</Upload>
			</Form.Item>
			<Form.Item>
				<Button htmlType={'submit'} type={'primary'}>Submit</Button>
			</Form.Item>
		</Form>
	)
}
export default EditCountry;