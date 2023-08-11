
import { React, useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
);

const LinePlot = (props) => {
    const [date, setDate] = useState(null);
    const [price, setPrice] = useState(null);
    const mangoName = props.mangoName;
    // const mangoName = 'Asina';

    useEffect(() => {
        fetch(`http://localhost:8000/dateandprice?mango_name=${mangoName}`)
            .then((result) => {
                result.json().then((response) => {
                    // setDate(response.data);
                    const result = [];
                    setDate(result)
                    response.data.forEach(innerArray => {
                        result.push(innerArray[0]);

                    });

                }).catch(error => console.error(error));
            })

        fetch(`http://localhost:8000/dateandpriceprice?mango_name=${mangoName}`)
            .then((result) => {
                result.json().then((res) => {
                    // setPrice(res.data);
                    const price = [];
                    setPrice(price)
                    res.data.forEach(innerArray => {
                        price.push(innerArray[0]);

                    });

                }).catch(error => console.error(error));
            })
    }, [mangoName]);



    const data = {
        labels: date,
        datasets: [
            {
                file: true,
                label: 'Mango Price Chart',
                // data: [10, 20, 10, 40, 20, 60, 70, 10, 20, 10, 40, 20, 60, 120, 20, 10, 40, 20, 60, 70, 10, 20, 10, 40, 20, 60, 70],
                data: price,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                tension: 0.1,
            },
        ]
    };

    const options = {
        plugins: {
            legend: true
        },
        scales: {

        }
    };

    return (
        <div>
            <Line data={data} options={options} />
        </div>
    )
}

export default LinePlot
