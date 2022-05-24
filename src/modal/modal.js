import React,  { useRef }  from 'react';
import './modal.css';
import {useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState} from "recoil";
import {reservationsState} from "../recoil/atoms";
import { Formik, Field, Form, ErrorMessage, useFormik } from "formik";
import * as Yup from 'yup';
import {
    MuiPickersUtilsProvider,
    DatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';




let payment = '';
let arrivalDate = '';
let departureDate = '';



const Modal = (props) => {
    // open, close, header from parent
    const { open, close, save, header, id, selectedReservation, isAdd } = props;

    const roomSizeRef = useRef(null);
    const roomQuantityRef = useRef(null);
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const streetNameRef = useRef(null);
    const streetNumberRef = useRef(null);
    const zipCodeRef = useRef(null);
    const stateRef = useRef(null);
    const cityRef = useRef(null);
    const extrasRef = useRef(null);
    const personalNoteRef = useRef(null);
    const reminderRef = useRef(null);
    const newsletterRef = useRef(null);
    const confirmRef = useRef(null);



    let updateReservation = {};
    updateReservation = Object.assign({}, selectedReservation);
    payment = '';

    const currentReservations = useRecoilValue(reservationsState); // readonly
    const reservationsHandler = useSetRecoilState(reservationsState); // change value

    const fnSave = () => {

        let tempReservation = {
            "stay": {
                "arrivalDate": arrivalDate,
                "departureDate": departureDate,
            },
            "room": {
                "roomSize": roomSizeRef.current.value,
                "roomQuantity": roomQuantityRef.current.value,
            },
            "firstName": firstNameRef.current.value,
            "lastName": lastNameRef.current.value,
            "email": emailRef.current.value,
            "phone": phoneRef.current.value,
            "addressStreet": {
                "streetName": streetNameRef.current.value,
                "streetNumber": streetNumberRef.current.value,
            },
            "addressLocation": {
                "zipCode": zipCodeRef.current.value,
                "state": stateRef.current.value,
                "city": cityRef.current.value,
            },
            "extras": extrasRef.current.value,
            "payment": payment,
            "note": personalNoteRef.current.value,
            "tags": '',
            "reminder": reminderRef.current.checked,
            "newsletter": newsletterRef.current.checked,
            "confirm": confirmRef.current.checked,
            "id": id
        };


        let newReservations = [];
        if(isAdd) { // add Mode
            currentReservations.forEach(reservation => {
                newReservations.push(reservation);
            });
            newReservations.push(tempReservation);
        } else { // edit Mode
            currentReservations.forEach(reservation => {
                if(reservation.id == id) {
                    newReservations.push(tempReservation)
                } else {
                    newReservations.push(reservation)
                }
            });
        }

        reservationsHandler(newReservations);
        save();
    };

    const fnDelete= () => {
        let newReservations = [];
        currentReservations.forEach(reservation => {
            if(reservation.id == id) {
                // deleted reservation
            } else {
                newReservations.push(reservation)
            }
        });
        reservationsHandler(newReservations);
        save();
    };


    const formik = useFormik({
        initialValues: {
        },
        validationSchema: Yup.object({
            firstName: Yup.string()
                .max(50, 'Must be 50 characters or less'),
            lastName: Yup.string()
                .max(50, 'Must be 50 characters or less'),
            email: Yup.string().email('Invalid email address'),
        }),
        onSubmit: values => {

        },
    });


    const onChangePayment = (e) => {
        payment = e.target.value;
    }

    const onChangeArrivalDate = (data) => {
        arrivalDate = data;
    }

    const onChangeDepartureDate = (data) => {
        departureDate = data;
    }





    return (
        // when open modal, create open Modal Class
        <div className={open ? 'openModal modal' : 'modal'}>
            {open ? (
                <section>
                    <header>
                        {header}
                        <button className="close" onClick={close}>
                            &times;
                        </button>
                    </header>
                    <main>
                        <form onSubmit={formik.handleSubmit} key={1}>
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        Date of Arrival <br/>
                                        {/* Material Ui Date Picker */}
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <DatePicker value={updateReservation.stay.arrivalDate} id="arrivalDate"
                                                        onChange ={onChangeArrivalDate}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </td>
                                    <td>
                                        Date of Departure<br/>
                                        {/* Material Ui Date Picker */}
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <DatePicker value={updateReservation.stay.departureDate}
                                                        id="departureDate"
                                                        onChange ={onChangeDepartureDate}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </td>
                                    <td>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Room Size<br/>

                                        <select defaultValue={updateReservation.room.roomSize}
                                                id="roomSize"
                                                ref={roomSizeRef}
                                        >
                                            <option value='business-suite'>Business Suite</option>
                                            <option value='presidential-suite'>Presidential Suite</option>
                                        </select>

                                    </td>
                                    <td>
                                        Room Quantity <br/>
                                        <input id="roomQuantity" type="text"
                                               {...formik.getFieldProps('roomQuantity')}
                                               defaultValue={updateReservation.room.roomQuantity}
                                               ref={roomQuantityRef}

                                        />
                                    </td>
                                    <td>
                                    </td>
                                </tr>


                                <tr>
                                    <td>
                                        <label htmlFor="firstName">First Name</label><br/>
                                        <input id="firstName" type="text" ref={firstNameRef}
                                               {...formik.getFieldProps('firstName')}
                                               defaultValue={updateReservation.firstName}
                                               ref={firstNameRef}

                                        />

                                        {formik.touched.firstName && formik.errors.firstName ? (
                                            <div>{formik.errors.firstName}</div>
                                        ) : null}
                                    </td>
                                    <td>
                                    </td>
                                    <td>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label htmlFor="lastName">Last Name</label><br/>
                                        <input id="lastName" type="text"
                                               {...formik.getFieldProps('lastName')}
                                               defaultValue={updateReservation.lastName}
                                               ref={lastNameRef}

                                        />

                                        {formik.touched.lastName && formik.errors.lastName ? (
                                            <div>{formik.errors.lastName}</div>
                                        ) : null}
                                    </td>
                                    <td>
                                    </td>
                                    <td>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label htmlFor="email">E-Mail</label><br/>
                                        <input id="email" type="email"
                                               {...formik.getFieldProps('email')}
                                               defaultValue={updateReservation.email}
                                               ref={emailRef}

                                        />

                                        {formik.touched.email && formik.errors.email ? (
                                            <div>{formik.errors.email}</div>
                                        ) : null}
                                    </td>
                                    <td>
                                    </td>
                                    <td>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label htmlFor="phone">Phone Number</label><br/>
                                        <input id="phone" type="text"
                                               {...formik.getFieldProps('phone')}
                                               defaultValue={updateReservation.phone}
                                               ref={phoneRef}

                                        />

                                        {formik.touched.phone && formik.errors.phone ? (
                                            <div>{formik.errors.phone}</div>
                                        ) : null}
                                    </td>
                                    <td>
                                    </td>
                                    <td>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label htmlFor="streetName">Street Name</label><br/>
                                        <input id="streetName" type="text"
                                               {...formik.getFieldProps('streetName')}
                                               defaultValue={updateReservation.addressStreet.streetName}
                                               ref={streetNameRef}

                                        />
                                    </td>
                                    <td>
                                        <label htmlFor="streetNumber">Street Number</label><br/>
                                        <input id="streetNumber" type="text"
                                               {...formik.getFieldProps('streetNumber')}
                                               defaultValue={updateReservation.addressStreet.streetNumber}
                                               ref={streetNumberRef}

                                        />
                                    </td>
                                    <td>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label htmlFor="zipCode">Zip</label><br/>
                                        <input id="zipCode" type="text"
                                               {...formik.getFieldProps('zipCode')}
                                               defaultValue={updateReservation.addressLocation.zipCode}
                                               ref={zipCodeRef}

                                        />
                                    </td>
                                    <td>
                                        <label htmlFor="state">State</label><br/>
                                        <input id="state" type="text"
                                               {...formik.getFieldProps('state')}
                                               defaultValue={updateReservation.addressLocation.state}
                                               ref={stateRef}

                                        />
                                    </td>
                                    <td>
                                        <label htmlFor="city">City</label><br/>
                                        <input id="city" type="text"
                                               {...formik.getFieldProps('city')}
                                               defaultValue={updateReservation.addressLocation.city}
                                               ref={cityRef}

                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={3}>
                                        <label htmlFor="extras">Extras</label><br/>
                                        <input id="extras" type="text"
                                               {...formik.getFieldProps('extras')}
                                               defaultValue={updateReservation.extras}
                                               ref={extrasRef}

                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={3}>
                                        <FormControl>
                                            <FormLabel id="demo-row-radio-buttons-group-label">Payment</FormLabel>
                                            <RadioGroup
                                                row
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                name="row-radio-buttons-group"
                                                defaultValue={updateReservation.payment}
                                                id="payment"
                                                onChange ={onChangePayment}
                                            >
                                                <FormControlLabel value="cc" control={<Radio />} label="Credit Card" />
                                                <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                                                <FormControlLabel value="cash" control={<Radio />} label="Cash" />
                                                <FormControlLabel value="bitcoin" control={<Radio />} label="Bitcoin" />
                                            </RadioGroup>
                                        </FormControl>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={3}>

                                        <label htmlFor="personalNote">Personal Note</label><br/>
                                        <input id="personalNote" type="text"
                                               {...formik.getFieldProps('personalNote')}
                                               defaultValue={updateReservation.note}
                                               ref={personalNoteRef}

                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={3}>

                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={3}>
                                        <div className="toggle-switch">
                                            <input type="checkbox" className="checkbox"
                                                   name="reminder" id="reminder"
                                                   defaultChecked={updateReservation.reminder}
                                                   ref={reminderRef}

                                                    />
                                            <label className="label" htmlFor="reminder">
                                                <span className="inner" />
                                                <span className="switch" />
                                            </label>
                                        </div>
                                        &nbsp;Send me a reminder
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={3}>
                                        <div className="toggle-switch">
                                            <input type="checkbox" className="checkbox"
                                                   name="newsletter" id="newsletter"
                                                   defaultChecked={updateReservation.newsletter}
                                                   ref={newsletterRef}

                                            />
                                            <label className="label" htmlFor="newsletter">
                                                <span className="inner" />
                                                <span className="switch" />
                                            </label>
                                        </div>
                                        &nbsp;Subscribe to newsletter
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={3}>
                                        <input type="checkbox" id="confirm" name="confirm" ref={confirmRef} defaultChecked={updateReservation.confirm} /> &nbsp;I confirm the information given above.
                                    </td>
                                </tr>
                                </tbody>
                            </table>

                        </form>
                    </main>
                    <footer>
                        <button className="close" onClick={close}>
                            close
                        </button>
                        <button className="save" onClick={fnSave}>
                            Save
                        </button>
                        {!isAdd && <button className="delete" onClick={fnDelete}>Delete</button>}

                    </footer>
                </section>
            ) : null}
        </div>
    );





};

export default Modal;
