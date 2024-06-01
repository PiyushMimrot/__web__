import axios from "axios";
import { useEffect, useState } from "react";
import { SERVER } from "../../../../config";

import AddChargesform from "./AddChargesform";
import Addbutton from "../../../../utils/AddButton/Addbutton";
import Table2 from "../../../MainComponents/Table2";
import Card from "../../../../utils/Card/Card";
import Swal from "sweetalert2";

export default function Tutioncharges() {
  const [feesInfo, setFeesInfo] = useState([]);
  const [edit, setEdit] = useState();

  const tableHeader = {
    id: "ID",
    charge_name: "Charge Name",
    amount: "Amount",
    date: "Date",
    action: "Action",
  };

  const fetchTutionfee = () => {
    fetch(SERVER + "/tutionfee", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setFeesInfo(data));
  };

  useEffect(() => {
    fetchTutionfee();
  }, []);

  const addCharges = async (newCharges) => {
    try {
      await axios.post(SERVER + "/tutionfee", newCharges, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error adding charges:", error);
    }

    Swal.fire({
      title: "Success",
      text: "Charge Added Successfully",
      icon: "success",
      timer: 3000,
    });
    fetchTutionfee();
  };

  const editTutioncharge = async (item) => {
    // console.log(edit, '  ' , item);
    for (let key in item) {
      if (item[key] !== "") {
        edit[key] = item[key];
      }
    }

    let updateData = { ...edit };
    // console.log(updateData)
    try {
      await axios.put(SERVER + `/tutionfee/${edit._id}`, updateData, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error updating charges:", error);
    }
    Swal.fire({
      title: "Success",
      text: "Charge Edited Successfully",
      icon: "success",
      timer: 3000,
    });
    fetchTutionfee();
    setEdit("");
  };

  const deleteTutioncharge = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await axios.delete(SERVER + `/tutionfee/${id}`, {
            withCredentials: true,
          });
          if (data.success) {
            fetchTutionfee();
          }
        } catch (error) {
          console.error("Error deleting charges:", error);
        }

        Swal.fire("Deleted!", "Charge has been deleted.", "success");
      }
    });
  };
  return (
    <Card>
      <div>
        <Addbutton title="Charges" buttonTitle="" formId="addCharges" />
        <Table2
          tableHeader={tableHeader}
          tableData={feesInfo}
          editTarget="editTutionCharge"
          editFunc={setEdit}
          deleteFunc={deleteTutioncharge}
          noOfCol={5}
        />
        <AddChargesform
          formId="addCharges"
          handleCharges={addCharges}
          title="Add New Charges"
        />
        <AddChargesform
          formId="editTutionCharge"
          handleCharges={editTutioncharge}
          title="Edit Charges"
        />
      </div>
    </Card>
  );
}
