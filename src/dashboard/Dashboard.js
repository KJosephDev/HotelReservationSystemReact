
import './dashboard.css';
import React, { useState } from "react";
import {useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState} from "recoil";
import {reservationsState} from "../recoil/atoms";
import Modal from "../modal/modal"
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

function Dashboard() {

    const [keyword, setKeyword] = useState('');
    const [searchType, setSearchType] = useState('email');

    const handleChange = (event) => {
        setSearchType(event.target.value);
    };


    const [modalOpen, setModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(0);

    const [selectedReservation, setSelectedReservation] = useState(null);


    const [isAdd, setIsAdd] = useState(false);

    const openModal = (id) => {
        setModalOpen(true);
        setSelectedId(id);
        setIsAdd(false);
        currentReservations.forEach(reservation => {
            if(reservation.id == id) {
                let tempReservation = Object.assign({}, reservation);
                setSelectedReservation(tempReservation);
            }
        });
    };
    const closeModal = () => {
        setModalOpen(false);
        setSelectedId(0);
    };

    const saveModal = () => {
        setModalOpen(false);
        setSelectedId(0);
    };


    const currentReservations = useRecoilValue(reservationsState); // readonly
    const reservationsHandler = useSetRecoilState(reservationsState); // change value
    const resetReservations = useResetRecoilState(reservationsState); //reset

    const reservationList = [];

    if(currentReservations != undefined) {
        if(currentReservations.length > 0) {
            for (let reservation of currentReservations) {
                reservationList.push(
                    <tr key={reservation.id} onClick={() => openModal(reservation.id)}>
                        <td>{reservation.firstName} {reservation.lastName}</td>
                        <td>{reservation.email}</td>
                    </tr>
                );
            }
        } else {
            reservationList.push(
                <tr key={1}>
                    <td colSpan={2}>No data</td>
                </tr>
            );
        }
    } else {
        reservationList.push(
            <tr key={1}>
                <td colSpan={2}>No data</td>
            </tr>
        );
    }

    const search = () => {
        console.log('search ' , keyword);

        if(keyword != '') {
            let filteredList = []
            currentReservations.forEach(reservation => {
                if(searchType == 'name') {
                    if(reservation.firstName.toString().toLowerCase().indexOf(keyword) > -1
                        || reservation.lastName.toString().toLowerCase().indexOf(keyword) > -1) {
                        filteredList.push(reservation);
                    }
                } else if(searchType == 'email') {
                    if(reservation.email.toString().toLowerCase().indexOf(keyword) > -1) {
                        filteredList.push(reservation);
                    }
                }
            });

            reservationsHandler(filteredList);
        } else {
            resetReservations();
        }



    }

    const add = () => {
        console.log('search ' , keyword);
        let newId = currentReservations.length + 1
        setModalOpen(true);
        setSelectedId(newId);
        setIsAdd(true);
        let tempReservation = {
            "stay": {
                "arrivalDate": new Date(),
                "departureDate": new Date(),
            },
            "room": {
                "roomSize": "",
                "roomQuantity": 0
            },
            "firstName": "",
            "lastName": "",
            "email": "",
            "phone": "",
            "addressStreet": {
                "streetName": "",
                "streetNumber": ""
            },
            "addressLocation": {
                "zipCode": "",
                "state": "",
                "city": ""
            },
            "extras": [
            ],
            "payment": "",
            "note": "",
            "tags": [
            ],
            "reminder": false,
            "newsletter": false,
            "confirm": false,
            "id": newId
        };
        setSelectedReservation(tempReservation);
    }

    return (
        <>
            <div id="search-component">
              <h4>Reservation Search</h4>
                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                    <Select
                        id="search-category-filled-label"
                        value={searchType}
                        style={{height: '40px'}}
                        onChange={handleChange}
                    >
                        <MenuItem value='email'>email</MenuItem>
                        <MenuItem value='name' >name</MenuItem>
                    </Select>
                </FormControl><br/>

                <input value={keyword}   name="keyword" onChange={e => setKeyword(e.target.value)} />
                <button onClick={search}>
                    search
                </button>
            </div>
            <button onClick={add}>
                add
            </button>
            <h3>Reservation List</h3>
            <table id="customers">
            <thead style={{"height" : "100%", "width" : "50%"}}>
            <tr>
                <th>name</th>
                <th>email</th>
            </tr>
            </thead>
            <tbody>
            {reservationList}
            </tbody>
            </table>
            <Modal open={modalOpen} close={closeModal} save={saveModal} header="Reservation Information" id={selectedId} isAdd={isAdd} selectedReservation={selectedReservation}>
            </Modal>
        </>
    );

}
export default Dashboard;
