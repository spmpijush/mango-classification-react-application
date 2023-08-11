import React, { useState, useEffect } from 'react'
// import Axios from 'axios'

const MangoDataAdd = () => {

    const [mangoName, setMangoName] = useState('');
    const [district, setDistrict] = useState('');
    const [date, setDate] = useState('');
    const [price, setPrice] = useState('');
    const [mangoes, setMangoes] = useState([]);

    const fetchData = () => {
        fetch('http://localhost:5000/api/mango')
            .then((response) => response.json())
            .then((data) => {
                setMangoes(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Basic input validation
        if (mangoName === '' || district === '' || date === '' || price === '') {
            alert('Please fill in all the fields');
            return;
        }

        // Create the request body
        const requestBody = {
            mango_name: mangoName,
            district,
            date,
            price,
        };

        // Make the API request
        fetch('http://localhost:5000/api/mango', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data); // Handle the response from the backend
                // Reset the form
                setMangoName('');
                setDistrict('');
                setDate('');
                setPrice('');
                fetchData();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = (id) => {
        fetch(`http://localhost:5000/api/mango/${id}`, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data); // Handle the response from the backend
                fetchData(); // Fetch the updated mango data after deletion
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    console.log(mangoes);
    return (
        <div>
            <div>
                <div className="container-fluid">
                    <div className="container content_main_box p-3">
                        <div className="row">
                            <div className="col-lg-4 col-md-4 col-12">
                                <div className="">
                                    {/* <button onClick={inserttData}>click</button> */}
                                    <form onSubmit={handleFormSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">Mango Name</label>
                                            <input type="text" className="form-control" value={mangoName} onChange={(e) => setMangoName(e.target.value)} name="mango_name" placeholder="Enter Mango Name" id="mango_name" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">District Name</label>
                                            <input type="text" className="form-control" value={district} onChange={(e) => setDistrict(e.target.value)} name="district" placeholder="Enter District Name" id="district" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Date</label>
                                            <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} name="date" id="date" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Mango Price</label>
                                            <input type="text" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} name="price" placeholder="Enter price" id="price" />
                                        </div>
                                        <div className='text-center'>
                                            <button type="submit" className="btn btn-success">Submit</button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                            <div className="col-lg-8 col-md-8 col-12">
                                <div className="inner_border tableheightstyle">
                                    <table className="table  table-striped table-hover table-bordered table-sm table-responsive-sm">
                                        <thead>
                                            <tr>
                                                <th scope="col">SL no</th>
                                                <th scope="col">Mango Name</th>
                                                <th scope="col">District</th>
                                                <th scope="col">Date</th>
                                                <th scope="col">Price</th>
                                                <th scope="col">Option</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* {tableRowsMango} */}
                                            {
                                                mangoes.map((mango, index) => (
                                                    <tr key={index}>
                                                        {/* <th scope="row">{row[0]}</th> */}
                                                        <td>{index + 1}</td>
                                                        <td>{mango.mango_name}</td>
                                                        <td>{mango.district}</td>
                                                        <td>{mango.date}</td>
                                                        <td>{mango.price} / QL</td>
                                                        <td className="text-center text-danger delete_btn_style"><i onClick={() => handleDelete(mango.id)} className="fas fa-trash-alt" /></td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MangoDataAdd




