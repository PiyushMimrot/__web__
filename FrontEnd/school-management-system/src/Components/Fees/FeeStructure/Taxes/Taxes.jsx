import axios from "axios";
import { useEffect, useState } from "react";
import { SERVER } from "../../../../config";

import AddTaxesform from "./AddTaxesform";
import Addbutton from "../../../../utils/AddButton/Addbutton";
import Card from "../../../../utils/Card/Card";
import Table2 from "../../../MainComponents/Table2";
import Swal from "sweetalert2";

export default function Tutioncharges() {
  const [taxInfo, setTaxInfo] = useState([]);
  const [edit, setEdit] = useState();

  const tableHeader = {
    id: "ID",
    tax_name: "Tax Name",
    value: "Value (%)",
    action: "Action",
  };
  const fetchTaxes = async () => {
    fetch(SERVER + "/tax", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setTaxInfo(data));
  };

  useEffect(() => {
    fetchTaxes();
  }, []);

  const addTaxes = async (newTax) => {
    try {
      await axios.post(SERVER + "/tax", newTax, { withCredentials: true });
    } catch (error) {
      console.error("Error adding taxes:", error);
    }
    Swal.fire({
      title: "Success",
      text: "Tax Added Successfully",
      icon: "success",
      timer: 3000,
    });
    fetchTaxes();
  };

  const editTax = async (item) => {
    // console.log(item)
    for (let key in item) {
      if (item[key]) {
        edit[key] = item[key];
      }
    }

    let updateData = { ...edit };

    try {
      await axios.put(SERVER + `/tax/${edit._id}`, updateData, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error updating tax:", error);
    }
    setEdit({});
    Swal.fire({
      title: "Success",
      text: "Tax Edited Successfully",
      icon: "success",
      timer: 3000,
    });
    fetchTaxes();
  };

  const deleteTax = (id) => {
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
            .delete(SERVER + `/tax/${id}`, { withCredentials: true })
            .then(() => fetchTaxes());
        } catch (error) {
          console.error("Error deleting tax:", error);
        }

        Swal.fire("Deleted!", "Tax has been deleted.", "success");
      }
    });
  };

  return (
    <Card>
      <div>
        <Addbutton title="Tax" buttonTitle="" formId="addTaxes" />
        <Table2
          tableHeader={tableHeader}
          tableData={taxInfo}
          editTarget="editTax"
          editFunc={setEdit}
          deleteFunc={deleteTax}
          noOfCol={4}
        />
        <AddTaxesform
          formId="addTaxes"
          handleTaxes={addTaxes}
          title="Add new tax"
        />
        <AddTaxesform formId="editTax" handleTaxes={editTax} title="Edit Tax" />
      </div>
    </Card>
  );
}
