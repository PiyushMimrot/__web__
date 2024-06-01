import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDisclosure } from "@chakra-ui/react";
import { SERVER } from "../../config";
import { InstilTable, TableState } from "../MainComponents/InstillTable";
import { AiFillEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import RSB from "../MainComponents/rsb";
import AddButton from "../../utils/AddButton/Addbutton";
import AddStaffType from "./AddStaffType";
import { useNavigate, useNavigation } from "react-router-dom";
import DoubtsStaff from "../Graphs/staff/DoubtsStaff";
import { ImProfile } from "react-icons/im";
import MultipleStaffAdd from "./MultipleStaffAdd";
import Logo from "../.././utils/Adds/Logo.png"
import { Link } from "react-router-dom"
function UploadStaff() {

  const printRef = useRef();
  const [school, setSchool] = useState("");
  const navigation = useNavigate();
  const [Staffs, setStaffs] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    phone: "",
    email: "",
    staff_type: "",
    address: "",
    password: "",
    staffStatus: "",
  });


  const [tableState, setTableState] = useState(TableState.LOADING);

  const keysToDisplay = ["No.", "NAME", "STAFF TYPE", "VIEW", "ACTION"];
  const keysArray = [
    "name",
    "gender",
    "phone",
    "email",
    "staff_type.name",
    "address",
    "status",
  ];

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [Editdata, setEdit] = useState({
    name: "",
    gender: "",
    phone: "",
    email: "",
    staff_type: "",
    address: "",
    password: "",
    staffStatus: "",
    adherCard: "",
    panCard: "",
    photo: "",
    nationality: "",
    religion: "",
  });
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const [staffTypes, setStaffTypes] = useState([]);

  const [staffType, setStaffType] = useState(null);

  const [isPresent, setIsPresent] = useState(false);

  const [showST, setShowST] = useState(false);
  const [showwMssg, setShowMssg] = useState("");
  const [aadharArray, setAadharArray] = useState("");
  const [verifyAad, setverifyAdd] = useState(false);
  const [copyDetail, setCopyDetail] = useState("");
  const [wantNewStaff, setwantNewStaff] = useState(false);

  const [photo, setPhoto] = useState(null);
  const [adherCard, setAdherCard] = useState(null);
  const [panCard, setPanCard] = useState(null);
  const [showFull, setShowFull] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    fetchStaff();
  }, []);


  const printInvoiceFunction = () => {
    window.print(printRef.current.innerHTML);
  };
  useEffect(() => {
    const fetchSession = async () => {
      const res = await axios.get(`${SERVER}/sessions/active`, {
        withCredentials: true,
      });

      const schoolInfoData = await fetch(
        `${SERVER}/school/getschool/${res.data.data.school_id}`,
        {
          credentials: "include",
        }
      );
      const schoolInfo = await schoolInfoData.json();

      setSchool(schoolInfo);
    };
    fetchSession();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await axios.get(`${SERVER}/staffmanage/staff`, {
        withCredentials: true,
      }); // Assuming your backend is running on the same domain
      console.log({ my: response.data });
      setStaffs(response.data);
      setTableState(TableState.SUCCESS);
    } catch (error) {
      console.error("Error fetching staffs:", error);
      setTableState(TableState.ERROR);
    }
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEdit((prevMaterial) => ({
      ...prevMaterial,
      [name]: value,
    }));
  };

  // Submit new edit form data

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    let URL = `${SERVER}/staffmanage/staff/${Editdata._id}`;

    await fetch(URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Editdata),
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the JSON response
      })
      .then((data) => {
        // Handle the successful response here
        //('Material updated successfully:', data);

        Swal.fire({
          title: "Success",
          text: "Staff updated successfully",
          icon: "success",
        });

        onEditModalClose();
        fetchStaff();
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error updating material:", error);
      });
  };

  const handleConfirm = async (id) => {
    try {
      const res = await axios.delete(`${SERVER}/staffmanage/staff/${id}`, {
        withCredentials: true,
      });

      if (res.status === 204) {
        Swal.fire({
          title: "Success",
          text: "Staff deleted successfully",
          icon: "success",
          confirmButtonText: "Ok",
        });
      }

      fetchStaff();
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };

  // Delete a item by id
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleConfirm(id);
      }
      //(`Edit clicked for item with ID: ${id}`);
    });
  };

  const [newStaff, setNewStaff] = useState({
    name: "",
    gender: "",
    phone: "",
    email: "",
    staff_type: "",
    address: "",
    password: "",
    staffStatus: "Active",
    adherCard: "",
    panCard: "",
    photo: "",
    nationality: "",
    religion: "",
    adherNumber: "",
    panNumber: "",
  });

  const addStaffType = (data) => {
    console.log(data);
    fetch(SERVER + `/staffmanage/createStaffType`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: data }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then(() => {
        fetchStaffTypes();

        Swal.fire({
          title: "Success",
          text: "Staff Type successfully Added",
          icon: "success",
          confirmButtonText: "Ok",
          timer: 3000,
        });

        if (wantNewStaff) {
          let modal = new bootstrap.Modal(document.getElementById("tickadd"));
          modal.show();
          setwantNewStaff(false);
        }
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "phone") {
      console.log(Staffs);
      let phN = Staffs.filter((item) => item.phone === value);
      if (phN.length) {
        setShowMssg("Already Exist");
      } else {
        setShowMssg("");
      }
    }
    if (name === "panNumber") {
      setNewStaff((prevMaterial) => ({
        ...prevMaterial,
        [name]: value.toUpperCase(),
      }));
    } else {
      setNewStaff((prevMaterial) => ({
        ...prevMaterial,
        [name]: value,
      }));
    }
  };

  const checkAdherNumber = async (event) => {
    const { name, value } = event.target;
    console.log(value);
    if (value.length <= 12) {
      setNewStaff((prevMaterial) => ({
        ...prevMaterial,
        [name]: value,
      }));
    }
    if (value.length === 12) {
      let { data } = await axios.post(
        `${SERVER}/aadhaarCheck`,
        { adhervalue: value, checkFor: "teacher" },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (data.success && data.isUnique) {
        setCopyDetail("New");
      } else {
        setCopyDetail(data.detail.name);
      }
    }
  };

  const handleEditStatusChange = (newStatus) => {
    setEdit((prevMaterial) => ({
      ...prevMaterial,
      staffStatus: newStatus,
    }));
  };

  const checkPhoneNumber = (phoneN) => {
    // fetch(SERVER + ``)
    let check = Staffs.filter((item) => item.phone === phoneN);
    return check.length ? true : false;
  };

  // Handel Submit data
  const handleSubmit = async (event) => {
    event.preventDefault();
    let regExp = /^(?!\s)[\w\s-]*$/;
    if (regExp.test(newStaff["name"])) {
      try {
        // if (checkPhoneNumber(newStaff.phone)) {
        //   Swal.fire({
        //     text: "Phone Number is already present",
        //     icon: "info",
        //     confirmButtonText: "Ok",
        //   });
        //   return;
        // }

        const staffData = new FormData();
        staffData.append("name", newStaff.name);
        staffData.append("phone", newStaff.phone);
        staffData.append("staff_type", newStaff.staff_type);

        if (showFull) {
          staffData.append("email", newStaff.email);
          staffData.append("address", newStaff.address);
          staffData.append("staffStatus", newStaff.staffStatus);
          staffData.append("adherCard", adherCard);
          staffData.append("panCard", panCard);
          staffData.append("photo", photo);
          staffData.append("nationality", newStaff.nationality);
          staffData.append("religion", newStaff.religion);
          staffData.append("adherNumber", newStaff.adherNumber);
          staffData.append("panNumber", newStaff.panNumber);
        }

        const res = await fetch(`${SERVER}/staffmanage/staff`, {
          method: "POST",
          body: staffData,
          credentials: "include",
        });
        if (res.status === 201) {
          Swal.fire({
            title: "Success",
            text: "Staff added successfully",
            icon: "success",
            confirmButtonText: "Ok",
          });
        }

        onClose(); // Close the modal after successful submission
        fetchStaff();
        setNewStaff({
          name: "",
          gender: "",
          phone: "",
          email: "",
          staff_type: "",
          address: "",
          password: "",
          staffStatus: "Active",
          adherCard: null,
          panCard: null,
          photo: null,
          nationality: "",
          religion: "",
          adherNumber: "",
          panNumber: "",
        });
        setPhoto("");
        setAdherCard("");
        setPanCard("");
        setCopyDetail("");
      } catch (error) {
        console.error("Error creating staff:", error);
      }
    }
    return;
  };

  const fetchStaffTypes = async () => {
    try {
      const response = await axios.get(`${SERVER}/staffmanage/getStaffType`, {
        withCredentials: true,
      }); // Assuming your backend is running on the same domain
      console.log(response);
      setStaffTypes(response.data.data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  useEffect(() => {
    fetchStaffTypes();
  }, []);

  // images states

  console.log(wantNewStaff, "want new staff");
  return (
    <>
      <div className="row">
        <div>
          <div className="d-flex justify-content-between custom-bg rounded-3 p-2">
            <h2 className="fw-bold mb-0 text-primary mt-3">
              Our School Staffs
            </h2>
            <div className="d-flex justify-content-end gap-4">
              <AddButton
                title={""}
                buttonTitle={"Add Staff Type"}
                formId={"addStaffType"}
              />
              <AddButton buttonTitle={"Add Staff"} formId={"tickadd"} />
              <MultipleStaffAdd getStaffs={fetchStaff} />
            </div>
          </div>
          <div
            className="modal fade"
            id="tickadd"
            tabIndex={-1}
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title  fw-bold" id="leaveaddLabel">
                    Add Staff
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  {/* Page -1 */}
                  <div className="">
                    {/* Name */}
                    <div className="mb-3">
                      <label htmlFor="sub" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newStaff.name}
                        className="form-control"
                        id="sub"
                        placeholder="Enter Staff Name"
                        onChange={handleInputChange}
                        required
                        data-bs-toggle="tooltip"
                        data-bs-placement="left"
                        title="Enter Name"
                        style={{ borderColor: newStaff.name && "green" }}
                      />
                    </div>
                    {/* type ,add */}
                    <div className="row">
                      <div className="col">
                        <label htmlFor="staff_type" className="form-label">
                          Staff Type
                        </label>
                        <select
                          name="staff_type"
                          value={newStaff?.staff_type}
                          className="form-select mb-2"
                          aria-label="Default select example"
                          onChange={handleInputChange}
                          required
                          data-bs-toggle="tooltip"
                          data-bs-placement="left"
                          title="Select Staff Type"
                          style={{
                            borderColor: newStaff.staff_type && "green",
                          }}
                        >
                          <option value={0} selected>
                            No Staff Type
                          </option>
                          {staffTypes?.map((item, idx) => {
                            return (
                              <option key={idx} value={item._id}>
                                {item.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="col-2 d-flex mt-3">
                        <button
                          className="btn btn-warning fs-5"
                          onClick={() => {
                            setwantNewStaff(true);
                          }}
                          data-bs-toggle="modal"
                          data-bs-target={`#addStaffType`}
                        >
                          {" "}
                          <AiOutlinePlusCircle />
                        </button>
                      </div>
                      {/* </>
                    )} */}
                    </div>
                    {/* Number */}
                    <div className="row">
                      <div className="mb-3 col">
                        <label htmlFor="phone" className="form-label">
                          Phone Number{" "}
                          <span style={{ color: "red" }}>{showwMssg}</span>
                        </label>
                        <input
                          type="phone number"
                          name="phone"
                          value={newStaff.phone}
                          className="form-control"
                          id="phone"
                          placeholder="Enter Staff Phone Number"
                          onChange={handleInputChange}
                          required
                          data-bs-toggle="tooltip"
                          data-bs-placement="left"
                          title="Enter Your Phone Number"
                          style={{
                            borderColor:
                              newStaff.phone.length === 10 &&
                              /^[0-9]*$/.test(newStaff.phone) &&
                              !showwMssg &&
                              "green",
                          }}
                          maxLength={10}
                          pattern="\b\d{10}\b"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Page -2 */}
                  {showFull && (
                    <div>
                      {/* Gender */}
                      <div className="row">
                        <div className=" col">
                          <label htmlFor="gender" className="form-label">
                            Gender
                          </label>
                          <select
                            name="gender"
                            value={newStaff?.gender}
                            className="form-select mb-2"
                            aria-label="Default select example"
                            onChange={handleInputChange}
                            required
                            data-bs-toggle="tooltip"
                            data-bs-placement="left"
                            title="Select Gender"
                            style={{
                              borderColor: newStaff.gender && "green",
                            }}
                          >
                            <option value={0} selected>
                              Select Gender
                            </option>
                            <option value={"Male"}>Male</option>
                            <option value={"Female"}>Female</option>
                          </select>
                        </div>
                      </div>
                      {/* Email */}
                      <div className="row">
                        <div className="mb-3 col">
                          <label htmlFor="email" className="form-label">
                            Email
                          </label>
                          <input
                            type="text"
                            name="email"
                            value={newStaff.email}
                            className="form-control"
                            id="email"
                            placeholder="Enter Staff Email"
                            onChange={handleInputChange}
                            required
                            data-bs-toggle="tooltip"
                            data-bs-placement="left"
                            title="Enter Email"
                            style={{
                              borderColor: newStaff.email && "green",
                            }}
                          />
                        </div>
                      </div>
                      {/* Address */}
                      <div className="mb-3">
                        <label htmlFor="address" className="form-label">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={newStaff.address}
                          className="form-control"
                          id="address"
                          placeholder="Enter Staff Address"
                          onChange={handleInputChange}
                          required
                          data-bs-toggle="tooltip"
                          data-bs-placement="left"
                          title="Enter Address"
                          style={{
                            borderColor: newStaff.address && "green",
                          }}
                        />
                      </div>
                      {/* Aadhaar Number, PAN Number */}
                      <div className="mb-3">
                        <label htmlFor="address" className="form-label">
                          Aadhaar Number
                        </label>
                        <div className="row">
                          <div className="col">
                            <input
                              type="text"
                              name="adherNumber"
                              className="form-control"
                              placeholder="Enter Staff Aadhaar Number"
                              value={newStaff.adherNumber}
                              onChange={checkAdherNumber}
                              required
                              data-bs-toggle="tooltip"
                              data-bs-placement="left"
                              title="Enter Adher Number"
                              style={{
                                borderColor:
                                  newStaff.adherNumber.length === 12 &&
                                  /^[0-9]*$/.test(newStaff.adherNumber) &&
                                  "green",
                              }}
                              maxLength={12}
                              pattern="\b\d{12}\b"
                            />
                          </div>
                        </div>
                        {copyDetail !== "" && copyDetail !== "New" && (
                          <p className="my-2 bg-danger text-white rounded p-1 ">
                            Already registered as {copyDetail}
                          </p>
                        )}
                        {copyDetail === "New" && (
                          <p className="my-2 bg-success text-white rounded p-1 ">
                            Successfully Verified!!
                          </p>
                        )}
                      </div>
                      <div className="mb-3">
                        <label htmlFor="address" className="form-label">
                          PAN Number
                        </label>
                        <input
                          type="text"
                          name="panNumber"
                          value={newStaff.panNumber}
                          className="form-control"
                          id="panNumber"
                          placeholder="Enter Staff Pan Number"
                          onChange={handleInputChange}
                          required
                          data-bs-toggle="tooltip"
                          data-bs-placement="left"
                          title="Enter Pan Number"
                          style={{
                            borderColor: newStaff.panNumber && "green",
                          }}
                        />
                      </div>
                      {/* Nationality,Religion */}
                      <div className="row">
                        <div className="mb-3 col">
                          <label htmlFor="address" className="form-label">
                            Nationality
                          </label>
                          <input
                            type="text"
                            name="nationality"
                            value={newStaff.nationality}
                            className="form-control"
                            id="nationality"
                            placeholder="Enter Nationality"
                            onChange={handleInputChange}
                            required
                            data-bs-toggle="tooltip"
                            data-bs-placement="left"
                            title="Enter Nationality"
                            style={{
                              borderColor: newStaff.nationality && "green",
                            }}
                          />
                        </div>
                        <div className="mb-3 col">
                          <label htmlFor="address" className="form-label">
                            Religion
                          </label>
                          <input
                            type="text"
                            name="religion"
                            value={newStaff.religion}
                            className="form-control"
                            id="religion"
                            placeholder="Enter Religion"
                            onChange={handleInputChange}
                            required
                            data-bs-toggle="tooltip"
                            data-bs-placement="left"
                            title="Enter Religion"
                            style={{
                              borderColor: newStaff.religion && "green",
                            }}
                          />
                        </div>
                      </div>
                      {/* Images */}
                      <div className="row">
                        <div className="mb-3 col">
                          <i className="icofont-user fs-5" />
                          <label
                            htmlFor="photoUpload"
                            className="form-label btn btn-warning"
                            style={{
                              color: photo ? "green" : "red",
                              cursor: "pointer",
                            }}
                          >
                            Upload Photo
                          </label>
                          <input
                            className="form-control"
                            type="file"
                            id="photoUpload"
                            accept="image/*"
                            onChange={(e) => setPhoto(e.target.files[0])}
                            data-bs-toggle="tooltip"
                            data-bs-placement="left"
                            title="Upload Photo"
                            style={{ display: "none" }}
                          />
                          {photo == "" || photo == null ? null : (
                            <img
                              src={URL.createObjectURL(photo)}
                              alt="assignment"
                              width="120px"
                              height="auto"
                            />
                          )}
                        </div>

                        <div className="mb-3 col">
                          <i className="icofont-file-document fs-5" />
                          <label
                            htmlFor="aadharUpload"
                            className="form-label btn btn-warning"
                            style={{
                              color: adherCard ? "green" : "red",
                              cursor: "pointer",
                            }}
                          >
                            Upload Adhar
                          </label>
                          <input
                            className="form-control"
                            type="file"
                            id="aadharUpload"
                            accept="image/*"
                            onChange={(e) => setAdherCard(e.target.files[0])}
                            data-bs-toggle="tooltip"
                            data-bs-placement="left"
                            title="Upload Aadhar Card"
                            style={{ display: "none" }}
                          />
                          {adherCard == "" || adherCard == null ? null : (
                            <img
                              src={URL.createObjectURL(adherCard)}
                              alt="assignment"
                              width="120px"
                              height="auto"
                            />
                          )}
                        </div>
                        <div className="mb-3 col">
                          <i className="icofont-file-document fs-5" />
                          <label
                            htmlFor="panUpload"
                            className="form-label btn btn-warning"
                            style={{
                              color: panCard ? "green" : "red",
                              cursor: "pointer",
                            }}
                          >
                            Upload Pan
                          </label>
                          <input
                            className="form-control"
                            type="file"
                            id="panUpload"
                            accept="image/*"
                            onChange={(e) => setPanCard(e.target.files[0])}
                            data-bs-toggle="tooltip"
                            data-bs-placement="left"
                            title="Upload Pan Card"
                            style={{ display: "none" }}
                          />
                          {panCard == "" || panCard == null ? null : (
                            <img
                              src={URL.createObjectURL(panCard)}
                              alt="assignment"
                              width="120px"
                              height="auto"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="d-flex justify-content-end mt-3">
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowFull(!showFull)}
                    >
                      {showFull ? "Less" : "More"}
                    </button>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    disabled={
                      // copyDetail !== "New" ||
                      newStaff.name.trim() === "" ||
                        // newStaff.gender.trim() === "" ||
                        newStaff.phone.length !== 10 ||
                        // newStaff.email.trim() === "" ||
                        newStaff.staff_type === ""
                        ? // newStaff.address.trim() === "" ||
                        // newStaff.nationality.trim() === "" ||
                        // newStaff.religion.trim() === "" ||
                        // newStaff.adherNumber.length !== 12 ||
                        // newStaff.panNumber.trim() === ""
                        true
                        : false
                    }
                    type="submit"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    onClick={handleSubmit}
                    data-bs-toggle="tooltip"
                    data-bs-placement="left"
                    title="Add staff"
                  >
                    Add Staff
                  </button>
                </div>
              </div>
            </div>
          </div>

          <InstilTable
            tableState={tableState}
            titles={keysToDisplay}
            rows={Staffs?.map((item, idx) => ({
              [keysToDisplay[0]]: idx + 1,
              [keysToDisplay[1]]: item?.name,
              [keysToDisplay[2]]: item?.staff_type?.name,
              [keysToDisplay[3]]: (
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target={`#viewModel${item._id}`}
                >
                  <ImProfile size={10} />
                </button>
              ),
              [keysToDisplay[4]]: (
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Basic outlined example"
                >
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    data-bs-toggle="modal"
                    data-bs-target="#edittickit"
                    onClick={() => setEdit(item)}
                  >
                    <AiFillEdit />
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary deleterow"
                    onClick={() => handleDelete(item._id)}
                  >
                    <AiFillDelete className="text-danger" />
                  </button>
                </div>
              ),
            }))}
          />

          {/* Model for view staff */}

          {Staffs?.map((item, idx) => {
            return (
              <div
                key={idx}
                className="modal fade"
                id={`viewModel${item._id}`}
                tabIndex={-1}
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered modal-md " ref={printRef}>
                  <div className="modal-content ">
                    <div className="modal-header bg-primary ">
                      <h5 className="modal-title text-light fw-bold" id="edittickitLabel">
                        {item?.name} Details
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      />
                    </div>
                    <div className="modal-body ">
                      <div className="card teacher-card ">
                        <div className="card-body  teacher-fulldeatil">
                          <div className="profile-teacher  text-center  me-2 ">
                            <a href="#">
                              <img
                                // src={`${SERVER}/staffmanage/staff/photo/${item._id}`}
                                src={`${SERVER}/staffphoto/${item?.photo}`}
                                onError={(e) => {
                                  e.target.src =
                                    "/assets/images/gallery/no-image.png";
                                }}
                                className="avatar xl rounded-circle img-thumbnail shadow-sm"
                              />
                            </a>
                            <div className="about-info d-flex align-items-center mt-2 justify-content-center flex-column">
                              <h6 className="mb-0 fw-bold d-block fs-4">
                                {item.name}
                              </h6>
                              <span className="text-muted mt-0 fs-6">
                                Employee Id
                              </span>
                              <span className="py-0 fw-bold medium-90 text-muted fs-6">
                                {item?.staff_type?.name}
                              </span>
                            </div>
                          </div>
                          <div className="border-dark ms-1    w-100">

                            <div className="row g-2 pt-1 ">
                              <div className="col-xl-5">
                                <div className="d-flex align-items-center">
                                  <i className="icofont-ui-touch-phone fs-6" />
                                  <span className=" fs-6">
                                    {item.phone}
                                  </span>
                                </div>
                              </div>
                              <div className="col-xl-4">
                                <div className="d-flex align-items-center">
                                  <i className="icofont-email fs-5" />
                                  <span className="fs-6">
                                    {item.email}
                                  </span>
                                </div>
                              </div>
                              <div className="col-xl-5">
                                <div className="d-flex align-items-center">
                                  <i className="icofont-address-book fs-5" />
                                  <span className="ms-2 fs-6">
                                    {item.address}
                                  </span>
                                </div>
                              </div>

                              <div className="col-xl-5">
                                <div className="d-flex align-items-center">
                                  <i class="icofont-card fs-5"></i>
                                  <span className="ms-2 fs-6">
                                    {item?.adherNumber}
                                  </span>
                                </div>
                              </div>

                              <div className="col-xl-5">
                                <div className="d-flex align-items-center">
                                  <i class="icofont-card fs-5"></i>
                                  <span className="ms-2 fs-6">
                                    {item?.panNumber}
                                  </span>
                                </div>
                              </div>

                              <div className="col-xl-5">
                                <div className="d-flex align-items-center">
                                  <i className="icofont-address-book fs-5" />
                                  <span className="ms-2 fs-6">
                                    {item.staffStatus}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-end">
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-lg "
                          onClick={printInvoiceFunction}
                        >
                          <i className="fa fa-print"></i> Print
                        </button>


                        <Link to={"/staff/" + item?._id} state={{ userData: item }} >
                          <button className="btn btn-primary " data-bs-dismiss="modal"
                            aria-label="Close"
                          >More
                          </button>
                        </Link>



                      </div>
                    </div>
                    <div className="d-flex bg-primary  align-items-center p-1 m-1 rounded">
                      <img style={{ height: "80px" }}
                        src={
                          school?.logo
                            ? `${SERVER}/school_logo/${school?.logo}`
                            : Logo
                        }
                        onError={(e) => {
                          e.currentTarget.src = Logo;
                        }}
                        alt="logo"
                        className="avatar xl rounded-circle img-thumbnail shadow-sm"
                      />
                      <p className="text-light fw-bold ms-2 fs-5 mt-2">
                        {school?.name}</p>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}

          {/* model for edit staff */}

          <div
            className="modal fade"
            id="edittickit"
            tabIndex={-1}
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold" id="edittickitLabel">
                    Edit Staff
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <form>
                      <label htmlFor="sub1" className="form-label">
                        Edit Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="form-control mb-2"
                        id="sub1"
                        value={Editdata?.name}
                        onChange={handleEditInputChange}
                      />
                      <label htmlFor="sub2" className="form-label">
                        Edit Gender
                      </label>
                      <select
                        name="gender"
                        value={Editdata?.gender}
                        className="form-select mb-2"
                        aria-label="Default select example"
                        onChange={handleEditInputChange}
                      >
                        <option value={0} selected>
                          Select Gender
                        </option>
                        <option value={"Male"}>Male</option>
                        <option value={"Female"}>Female</option>
                      </select>
                      <label htmlFor="sub3" className="form-label">
                        Edit Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        className="form-control mb-2"
                        id="sub3"
                        value={Editdata?.phone}
                        onChange={handleEditInputChange}
                      />
                      <label htmlFor="sub4" className="form-label">
                        Edit Email
                      </label>
                      <input
                        type="text"
                        name="email"
                        className="form-control mb-2"
                        id="sub4"
                        value={Editdata?.email}
                        onChange={handleEditInputChange}
                      />
                      <label htmlFor="sub5" className="form-label">
                        Edit Staff Type
                      </label>
                      <select
                        name="staff_type"
                        value={Editdata?.staff_type._id || ""}
                        className="form-select mb-2"
                        aria-label="Default select example"
                        onChange={handleEditInputChange}
                      >
                        <option value={0} selected>
                          No Staff Type
                        </option>
                        {staffTypes?.map((item, idx) => {
                          return (
                            <option key={idx} value={item._id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </select>
                      <label htmlFor="sub6" className="form-label">
                        Edit address
                      </label>
                      <input
                        type="text"
                        name="address"
                        className="form-control mb-2"
                        id="sub6"
                        value={Editdata?.address}
                        onChange={handleEditInputChange}
                      />
                      <label htmlFor="sub7" className="form-label">
                        Staff Status
                      </label>
                      <div className="form-check form-switch theme-switch">
                        <input
                          className="form-check-input"
                          id="statusToggle"
                          type="checkbox"
                          checked={Editdata.staffStatus === "Active"}
                          value={Editdata.staftatus}
                          onChange={(e) =>
                            handleEditStatusChange(
                              e.target.checked ? "Active" : "Inactive"
                            )
                          }
                        />
                      </div>
                    </form>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    onClick={handleEditSubmit}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AddStaffType
          addStaffType={addStaffType}
          stafftypes={staffTypes}
          formId={"addStaffType"}
          wantNewStaff={wantNewStaff}
          setwantNewStaff={setwantNewStaff}
        />
      </div>
      {/* </div> */}
    </>
  );
}

export default UploadStaff;
