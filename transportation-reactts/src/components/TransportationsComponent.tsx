import APP_ENV from "../env";
import React, {useEffect, useState} from "react";
import {InputNumber, Modal, Table, Tag} from "antd";
import type {ColumnsType} from "antd/es/table";

interface Transportation {
    id: number;
    code: string;
    fromCityName: string;
    fromCountryName: string;
    toCityName: string;
    toCountryName: string;
    departureTime: string;
    arrivalTime: string;
    seatsAvailable: number;
    seatsTotal: number;
    statusName: string;
}

interface Props {
    data: Transportation[];
}

const TransportationsComponent = () => {
    const [data, setData] = useState();
    const [open, setOpen] = React.useState<boolean>(false);
    const [selectedId, setSelectedId] = React.useState<number | null>(null);
    const [quantity, setQuantity] = React.useState(1);

    const fetchData = () => {
        fetch(`${APP_ENV.API_BASE_URL}/api/Transportations/GetList`,
            {
                method: "GET",

            })
            .then((res) => {
                console.log(res);
                res.json().then((res) => {
                    console.log(res);
                    setData(res);
                });
            })

    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleBook = () => {
        if (!selectedId)
            return;
        if (localStorage.getItem('token') == "") {
            console.log('unauthorized')
            return;
        }
        console.log('trId - ' + selectedId);
        console.log('quantity - ' + quantity);
        fetch(`${APP_ENV.API_BASE_URL}/api/Carts/AddUpdate`,
            {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                    Authorization: "Bearer " + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    transportationId: selectedId,
                    quantity
                })
            }).then(res => console.log(res))
        setOpen(false);
    }

    const openBookingModal = (id) => {
        setSelectedId(id);
        setOpen(true);
        setQuantity(1);
    }

    const columns: ColumnsType<Transportation> = [
        {
            title: "Code",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "From",
            key: "from",
            render: (_, r) =>
                `${r.fromCityName}, ${r.fromCountryName}`
        },
        {
            title: "To",
            key: "to",
            render: (_, r) =>
                `${r.toCityName}, ${r.toCountryName}`
        },
        {
            title: "Departure",
            dataIndex: "departureTime",
            key: "departureTime"
        },
        {
            title: "Arrival",
            dataIndex: "arrivalTime",
            key: "arrivalTime"
        },
        {
            title: "Seats",
            key: "seats",
            render: (_, r) =>
                `${r.seatsAvailable} / ${r.seatsTotal}`
        },
        {
            title: "Status",
            dataIndex: "statusName",
            key: "statusName",
            render: status => (
                <Tag color={status === "Scheduled" ? "blue" : "default"}>
                    {status}
                </Tag>
            )
        },
        {
            title: "Action",
            dataIndex: '',
            key: 'x',
            render: (_, record) => <a onClick={() => openBookingModal(record.id)}>Book</a>
        }
    ];

    return (
        <>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={data}
                pagination={false}
            />
            <Modal
                title={"Booking Seats"}
                open={open}
                onCancel={() => {
                    setOpen(false)
                }}
                onOk={handleBook}
                okText={"Confirm booking"}
            >
                <InputNumber
                    min={1}
                    placeholder={"Enter the number of seats"}
                    value={quantity}
                    onChange={(value) => setQuantity(value ?? 1)}
                    style={{width: "100%"}}
                />
            </Modal>
        </>
    )
}

export default TransportationsComponent;