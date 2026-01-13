import {useEffect, useState} from "react";
import {Avatar, Button, DatePicker, Col, Flex, Form, type GetProp, Input, Row, Table, type TableProps, Tag} from "antd";
import type {SorterResult} from "antd/es/table/interface";
import APP_ENV from "../env";
import dayjs from 'dayjs';

interface DataType {
    name: string;
    image: string;
    email: string;
    id: string;
    roles: string[];
}

type ColumnsType<T extends object = object> = TableProps<T>['columns'];
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

const toURLSearchParams = <T extends Record<PropertyKey, any>>(record: T) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(record)) {
        params.append(key, value);
    }
    return params;
};


const columns: ColumnsType<DataType> = [
    {
        title: 'FullName',
        dataIndex: 'fullName',
        sorter: true,
        width: '20%',
    },
    {
        title: 'Image',
        dataIndex: 'image',
        width: '20%',
        render: (_, {image}) => (
            <Avatar
                src={`${APP_ENV.API_BASE_URL}/images/${image}`}
            />
        )
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
    {
        title: 'Roles',
        dataIndex: 'roles',
        render: (_, {roles}) => (
            <Flex gap="small" align="center" wrap>
                {roles.map((role) => {
                    let color = role == 'Admin' ? 'yellow' : 'green';
                    return (
                        <Tag color={color} key={role}>
                            {role.toUpperCase()}
                        </Tag>
                    );
                })}
            </Flex>
        )
    }
];

const isNonNullable = <T, >(val: T): val is NonNullable<T> => {
    return val !== undefined && val !== null;
};

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: SorterResult<any>['field'];
    sortOrder?: SorterResult<any>['order'];
    filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

const getRandomuserParams = (params: TableParams) => {
    const {pagination, filters, sortField, sortOrder, ...restParams} = params;
    const result: Record<string, any> = {};

    // https://github.com/mockapi-io/docs/wiki/Code-examples#pagination
    result.limit = pagination?.pageSize;
    result.page = pagination?.current;

    // https://github.com/mockapi-io/docs/wiki/Code-examples#filtering
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (isNonNullable(value)) {
                result[key] = value;
            }
        });
    }

    // https://github.com/mockapi-io/docs/wiki/Code-examples#sorting
    if (sortField) {
        result.orderby = sortField;
        result.order = sortOrder === 'ascend' ? 'asc' : 'desc';
    }

    // 处理其他参数
    Object.entries(restParams).forEach(([key, value]) => {
        if (isNonNullable(value)) {
            result[key] = value;
        }
    });

    return result;
};


const UsersComponent = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<DataType[]>();
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    const params = toURLSearchParams(getRandomuserParams(tableParams));

    const fetchData = () => {
        setLoading(true);
        console.log(params.toString());
        fetch(`${APP_ENV.API_BASE_URL}/api/Account/Search?${params.toString()}`)
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                setData(Array.isArray(res.items) ? res.items : []);
                setLoading(false);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: 100,
                        // 100 is mock data, you should read it from server
                        // total: data.totalCount,
                    },
                });
            });
    };

    useEffect(fetchData, [
        tableParams.pagination?.current,
        tableParams.pagination?.pageSize,
        tableParams?.sortOrder,
        tableParams?.sortField,
        JSON.stringify(tableParams.filters),
    ]);

    const handleTableChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
            sortField: Array.isArray(sorter) ? undefined : sorter.field,
        });

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    return (
        <>
            <Form
                form={form}
                layout="vertical"
                onFinish={(values) => {
                    const {name, dateRange} = values;

                    setTableParams(prev => ({
                        ...prev,
                        pagination: {
                            ...prev.pagination,
                            current: 1 // reset page on search
                        },
                        filters: {
                            Name: name,
                            StartDate: dateRange?.[0]?.toISOString(),
                            EndDate: dateRange?.[1]?.toISOString()
                        }
                    }));
                }}
            >
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item name="name" label="Name">
                            <Input placeholder="Search by name"/>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="dateRange" label="Created Date">
                            <DatePicker.RangePicker className="w-full"/>
                        </Form.Item>
                    </Col>

                    <Col span={4} className="flex items-end">
                        <Button type="primary" htmlType="submit" block>
                            Search
                        </Button>
                    </Col>

                    <Col span={4} className="flex items-end">
                        <Button
                            block
                            onClick={() => {
                                form.resetFields();
                                setTableParams({
                                    pagination: {
                                        current: 1,
                                        pageSize: 10
                                    }
                                });
                            }}
                        >
                            Reset
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Table<DataType>
                columns={columns}
                rowKey={(record) => record.id}
                dataSource={data}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
            />
        </>
    )
}

export default UsersComponent;