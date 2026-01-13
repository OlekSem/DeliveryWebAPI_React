import React from "react"
import APP_ENV from "../env";
import {Button, Modal, Table} from "antd";

const CartComponent: React.FC = () => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [data, setData] = React.useState([]);

    const fetchData = () => {
        fetch(`${APP_ENV.API_BASE_URL}/api/Carts/GetList`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                }
            })
            .then((res) => {
                console.log(res);
                res.json().then((res) => {
                    console.log(res);
                    setData(res);
                });
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const showLoading = () => {
        setOpen(true);
        setLoading(true);

        fetchData();
        setLoading(false);
    }

    return (
        <>
            <Button type={"primary"} onClick={showLoading}>
                Cart
            </Button>
            <Modal
                title={<p>Cart</p>}
                loading={loading}
                open={open}
                onCancel={() => setOpen(false)}
                onOk={() => setOpen(false)}
            >
                {data.length == 0 ? <>no items</> :
                    data.map((cart) => {
                        return (
                            <div className={'border rounded-2xl w-full p-3 m-2'}>
                                <p>{cart.fromCityName}, {cart.fromCountryName}&#9;-&gt;&#9;{cart.toCityName}, {cart.toCountryName}</p>
                                <p>{cart.departureTime}&#9;-&gt;&#9;{cart.arrivalTime}</p>
                                <p>Quantity: {cart.quantity}</p>
                            </div>
                        )
                    })
                }


            </Modal>
        </>
    )
}

export default CartComponent;