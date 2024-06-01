import axios from "axios";
import { SERVER } from "../../../../config";

import Card from "../../../../utils/Card/Card";
import Addbutton from "../../../../utils/AddButton/Addbutton";
import SpecialChargesform from "./SpecialChargesform";
import Table2 from "../../../MainComponents/Table2";
import Swal from "sweetalert2";

import { useState, useEffect } from "react";

export default function Specialcharges() {
  const [spChargeInfo, setSpchargeInfo] = useState([]);
  const [edit, setEdit] = useState();

  const tableHeader = {
    id: "ID",
    name: "Charge Name",
    value: "Value",
    date: "Date",
    action: "Action",
  };
  const fetchXCharge = () => {
    fetch(SERVER + "/specialCharges", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setSpchargeInfo(data));
  };

  useEffect(() => {
    fetchXCharge();
  }, []);

  const addSpCharge = async (newCharges) => {
    try {
      await axios.post(SERVER + "/specialCharges", newCharges, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error adding charges:", error);
    }

    Swal.fire({
      title: "Success",
      text: "Special Charge Added Successfully",
      icon: "success",
      timer: 3000,
    });

    fetchXCharge();
  };

  const editSpCharge = async (item) => {
    for (let key in item) {
      if (item[key] !== "") {
        edit[key] = item[key];
      }
    }

    let updateData = { ...edit };

    try {
      await axios.put(SERVER + `/specialCharges/${edit._id}`, updateData, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error updating Extra Charge:", error);
    }
    setEdit({});
    Swal.fire({
      title: "Success",
      text: "Special Charge Edited Successfully",
      icon: "success",
      timer: 3000,
    });
    fetchXCharge();
  };

  const deleteSpCharge = (id) => {
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
        try {
          axios
            .delete(SERVER + `/specialCharges/${id}`, { withCredentials: true })
            .then(() => fetchXCharge());
        } catch (error) {
          console.error("Error deleting Special Charge:", error);
        }

        Swal.fire("Deleted!", "Special Charge has been deleted.", "success");
      }
    });
  };

  return (
    <Card>
      <div>
        <Addbutton
          title="Special Charges"
          buttonTitle=""
          formId="addSpCharge"
        />
        <Table2
          tableHeader={tableHeader}
          tableData={spChargeInfo}
          editTarget="editSpCharge"
          editFunc={setEdit}
          deleteFunc={deleteSpCharge}
          noOfCol={5}
        />
        <SpecialChargesform
          formId="addSpCharge"
          handleSpCharge={addSpCharge}
          title="Add New Special Charges"
        />
        <SpecialChargesform
          formId="editSpCharge"
          handleSpCharge={editSpCharge}
          title="Edit Special Charges"
        />
      </div>
    </Card>
  );
}
