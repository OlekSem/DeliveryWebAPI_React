import {Button, Form, Input, Upload, message, Select} from "antd";
import APP_ENV from "../env/index.js";
import {PlusOutlined} from "@ant-design/icons";
import {Editor} from "@tinymce/tinymce-react";
import {useEffect, useState} from "react";

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


const CreateCityComponent = () => {
    // const editorRef = useRef(null);
    const api = `${APP_ENV.API_BASE_URL}/api/Cities`;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [fileList, setFileList] = useState([]);
    const [description, setDescription] = useState("");
    const [select, setSelect] = useState();
    // const [loading, setLoading] = useState(false);


    const onFinish = async (values) => {
        form.setFields([
            {name: 'name', errors: []},
            {name: 'code', errors: []},
            {name: 'description', errors: []},
            {name: 'image', errors: []}
        ]);
        const formData = new FormData();
        if (fileList.length > 0) {
            formData.append('Image', fileList[0].originFileObj);
        }
        formData.append('Name', values.name);
        formData.append('Slug', toSlug(values.name))
        if (description.length > 0)
            formData.append('Description', description);
        formData.append('CountryId', values.country)

        try {
            console.log(Object.fromEntries(formData.entries()))
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

    const getCountriesList = async () => {
        const res = await fetch(api.replace('Cities', 'Countries'))
        const json = await res.json();
        const list = json.map(r => {
            return {value: r.id, label: r.name}
        });
        setSelect(list);
        console.log(json);
    }
    useEffect(() => {
        getCountriesList()
    }, []);


    return (
        <>
            {contextHolder}
            <>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Create City</h1>
                <Form
                    form={form}
                    layout={'vertical'}
                    onFinish={onFinish}
                >
                    <Form.Item label={'Name'} required name={'name'}>
                        <Input placeholder={'Enter the name of the country'}/>
                    </Form.Item>
                    <Form.Item label={'Country'} required name={'country'}>
                        <Select
                            aria-required
                            onChange={(value) => {
                                setDescription(value)
                            }}
                            options={select}
                        />
                    </Form.Item>
                    <Form.Item label={'Description'} name={'description'}>
                        <Editor
                            apiKey='3e4b16d71lt28vvxjdo2pf7ctdd876x6sarjbfo470cqqjpz'
                            onEditorChange={(c) => {
                                setDescription(c);
                                form.setFieldValue("description", c);
                            }}/>
                    </Form.Item>
                    <Form.Item label={"Image"} name={'image'}>
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

export default CreateCityComponent;