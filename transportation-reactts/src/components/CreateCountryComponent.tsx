import {Button, Form, Input, Upload, message} from "antd";
import {PlusOutlined} from '@ant-design/icons';
import {useState} from "react";
import APP_ENV from "../env/index.js";

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


const CreateCountryComponent = () => {
    const api = `${APP_ENV.API_BASE_URL}/api/Countries`;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [fileList, setFileList] = useState([]);
    // const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        if (fileList.length === 0) {
            messageApi.warning("Please upload an image");
            return;
        }
        const formData = new FormData();
        formData.append('Name', values.name);
        formData.append('Code', values.code);
        formData.append('Slug', toSlug(values.name))
        formData.append('Image', fileList[0].originFileObj);

        try {
            const res = await fetch(api, {
                method: 'POST',
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                },
                body: formData
            });
            console.log(res);
            const data = await res.json();
            if (res.ok)
                messageApi.info('Success!')
            else {
                if (data.errors) {
                    const fields = Object.keys(data.errors).map(key => ({
                        name: key.toLowerCase(),
                        errors: data.errors[key]
                    }));

                    form.setFields(fields);
                }
                // messageApi.warning(JSON.stringify(data.errors))
            }
            console.log(data);

        } catch (err) {
            messageApi.error("Error uploading");
            console.error(err);
        }
    }


    return (
        <>
            {contextHolder}
            <>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Create Country</h1>
                <Form
                    form={form}
                    layout={'vertical'}
                    onFinish={onFinish}
                >
                    <Form.Item label={'Name'} required name={'name'}>
                        <Input placeholder={'Enter the name of the country'}/>
                    </Form.Item>
                    <Form.Item label={'Code'} required name={'code'}>
                        <Input placeholder={'Enter the code of the country'}/>
                    </Form.Item>
                    <Form.Item label={"Image"} required name={'image'}>
                        <Upload
                            beforeUpload={() => false}
                            listType="picture-card"
                            fileList={fileList}
                            onChange={({fileList: newList}) => setFileList(newList)}
                            maxCount={1}
                        >
                            {fileList.length === 0 && (
                                <div>
                                    <PlusOutlined/>
                                    <div style={{marginTop: 8}}>Upload</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType={'submit'} type={'primary'}>Submit</Button>
                    </Form.Item>
                </Form>
            </>
        </>
    )
}

export default CreateCountryComponent;