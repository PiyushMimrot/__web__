import { useParams, Link, useLocation } from "react-router-dom";
import Addbutton from "../../../utils/AddButton/Addbutton";
import AddSectionform from "./AddSectionform";
import { SERVER } from "../../../config";
import { useEffect, useState } from "react";
import EditSectionform from "./EditSectionform";
import Swal from "sweetalert2";
import QRCode from "qrcode.react";
import { AiFillEdit, AiFillDelete, AiOutlineEye } from "react-icons/ai";
import { IoClose, IoEye } from "react-icons/io5";
import { InstilTable, TableState } from "../../MainComponents/InstillTable";
import { motion } from "framer-motion";
import { GrDownload } from "react-icons/gr";
import { FaPeopleGroup } from "react-icons/fa6";
import { getTypeToken } from "../../../Context/localStorage";

const type = getTypeToken();

export default function Sections() {
  const [status, setStatus] = useState();
  const [edit, setEdit] = useState({});

  const params = useParams();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [qr, setQr] = useState({ visible: false });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await getSections();
      await getClassTeacher();
      setIsLoading(false);
    })();
  }, []);

  // useEffect(()=>{
  //     console.log('u')
  //     // teacher.forEach((item)=>{
  //     //     fetch(SERVER + `/staffmanage/staff/${item._id}`)
  //     //     .then((res) => res.json())
  //     //     .then((data) =>{
  //     //         console.log(data)
  //     //     })
  //     // })

  // },[setTeacher])
  const getSections = async () => {
    let resp = await fetch(
      SERVER + `/section/getSectionClass/${location.state}`,
      {
        credentials: "include",
      }
    );
    const data = await resp.json();
    setData(data.data);
  };

  const dataGet = (item) => {
    fetch(SERVER + `/section/getSectionClass/${item._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setStatus("updated"));
  };

  const addSection = (newSec) => {
    // console.log(d);
    if (data.some((item) => item.name === newSec.name)) {
      Swal.fire({
        text: `Section ${newSec.name} is already added in Class ${
          params.className.split("_")[1]
        }`,
        icon: "info",
        timer: 3000,
      });
    } else {
      newSec = { ...newSec, class_id: location.state };

      fetch(SERVER + `/section`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSec),
        credentials: "include",
      }).then(() => {
        getSections();
        Swal.fire({
          title: "Success",
          text: "Section Added Successfully",
          icon: "success",
          timer: 3000,
        });
      });
    }
  };

  const deleteSection = (item) => {
    // console.log(item);
    Swal.fire({
      title: `Want to delete section ${item.name}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(SERVER + `/section/${item._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              getSections();
              Swal.fire(
                "Deleted!",
                `Section ${item.name} has been deleted.`,
                "success"
              );
            } else {
              Swal.fire({
                text: data.message,
                icon: "info",
                timer: 3000,
              });
            }
          });
      }
    });
  };

  const editSection = (item) => {
    console.log(item);

    fetch(SERVER + `/section`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => getSections());
    Swal.fire({
      title: "Success",
      text: "Section Edited Successfully",
      icon: "success",
      timer: 3000,
    });
    // setEdit(0);
  };

  const getClassTeacher = async (id) => {
    // await fetch(SERVER + `/classes/getTeacher/${data.name}`,{credentials:'include'})
    //     .then((res) => res.json())
    //     .then((data) =>{
    //         let d =data[0].classteacher.filter((item)=>item.IsClassTeacher === true);
    //         console.log(d)
    //         setTeacher(d);
    //     })
    // console.log(teacher)
  };

  console.log(data, "data");

  return (
    <div>
      {type === "admin" ? (
        <div className="card">
          <Addbutton
            title={`All Sections In Class ${params.className.split("_")[1]}`}
            buttonTitle="Add New Section"
            formId="addSection"
          />
        </div>
      ) : (
        <h2 className="fw-bold mb-0 text-primary">My Section</h2>
      )}
      {/* <Addbutton title={`All Sections In Class ${(params.className).split('_')[1]}`} buttonTitle="Add New Section" formId="addSection" /> */}
      <div>
        <InstilTable
          tableState={isLoading ? TableState.LOADING : TableState.SUCCESS}
          titles={[
            "ID",
            "SECTION",
            "STUDENTS",
            ...(type == "admin" ? ["ACTIONS", "QR code"] : []),
          ]}
          rows={data.map((item, idx) => {
            return {
              ID: idx + 1,
              SECTION: item.name,
              STUDENTS: (
                <>
                  <Link
                    to={item.name}
                    state={item}
                    style={{ margin: "5px", padding: "5px", width: "45px" }}
                    className=" btn btn btn-outline-primary fs-5"
                  >
                    <FaPeopleGroup />
                  </Link>
                  {item?.count && (
                    <span className="p-3">
                      Total : <b>{item.count}</b>
                    </span>
                  )}
                </>
              ),

              ...(type == "admin"
                ? {
                    ACTIONS: (
                      <tr>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          data-bs-toggle="modal"
                          data-bs-target="#editSection"
                          onClick={() => setEdit(item)}
                        >
                          <AiFillEdit />
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary deleterow"
                          onClick={() => deleteSection(item)}
                        >
                          <AiFillDelete className="text-danger" />
                        </button>
                      </tr>
                    ),
                    "QR code": (
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            setQr({
                              visible: true,
                              sectionId: item._id,
                              sectionName: item.name,
                              clsName: params.className.split("_")[1],
                            })
                          }
                        >
                          <IoEye />
                        </button>
                      </td>
                    ),
                  }
                : {}),
            };
          })}
        />
      </div>
      <AddSectionform formId="addSection" addSection={addSection} />
      <EditSectionform
        formId="editSection"
        editSection={editSection}
        editSectionData={edit || {}}
      />
      <QRPopUp data={qr} onClose={() => setQr({ visible: false })} />
    </div>
  );
}

function QRPopUp({ data, onClose }) {
  return (
    data &&
    data.visible && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          position: "absolute",
          zIndex: 10000,
          top: 0,
          left: 0,
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            width: "400px",
            padding: "25px",
            backgroundColor: "white",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              position: "relative",
              alignSelf: "end",
            }}
          >
            <IoClose
              style={{ cursor: "pointer" }}
              size={25}
              onClick={() => onClose && onClose()}
              color="black"
            />
          </div>
          <QRCode
            size={200}
            includeMargin={true}
            id="QRcode"
            value={data.sectionId}
            renderAs="canvas"
          />
          <div style={{ padding: "10px" }}>
            <h6>Class Name : {data.clsName}</h6>
            <h6>Section Name : {data.sectionName}</h6>
          </div>
          <div
            className="intilbutton"
            onClick={() => {
              const canvas = document.getElementById("QRcode");
              var downloadLink = document.createElement("a");
              downloadLink.href = canvas.toDataURL(`image/jpeg`);
              downloadLink.download = "QRcode.jpeg";
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
            }}
          >
            <GrDownload /> <span>Download</span>
          </div>
        </div>
      </motion.div>
    )
  );
}

// <table className="table">
// <thead>
//   <tr>
//     <th scope="col">ID</th>
//     <th scope="col">SECTION</th>
//     <th scope="col">STUDENTS</th>
//     {/* <th scope="col">TEACHER</th> */}
//     {type === "admin" &&<>
//     <th scope="col">ACTIONS</th>
//     <th scope="col">QR code</th>
//     </>}
//   </tr>
// </thead>
// <tbody>
//   {data.map((item, idx) => {
//     return (
//       <tr key={idx}>
//         <th scope="row" className="text-secondary">
//           {idx + 1}
//         </th>
//         <td>{item.name} </td>
//         <td>
//           <Link
//             to={item.name}
//             state={item}
//             className=" btn btn btn-outline-primary fs-5"
//           >
//             <AiOutlineEye />
//           </Link>
//           <span className="p-3"></span>
//         </td>
//         {type === "admin" && (
//           <>
//         <tr>
//             <button

//               type="button"
//               className="btn btn-outline-secondary"
//               data-bs-toggle="modal"
//               data-bs-target="#editSection"
//               onClick={() => setEdit(item)}
//             >
//               <AiFillEdit />
//             </button>
//             <button
//               type="button"
//               className="btn btn-outline-secondary deleterow"
//               onClick={() => deleteSection(item)}
//             >
//               <AiFillDelete className="text-danger" />
//             </button>
//             </tr>

//             <td>
//                 <FaDownload style={{paddingLeft:'10px'}} size={25}  onClick={()=>{

//                 }}/>
//               <span className="p-3"></span>
//             </td>
//           </>
//         )}
//       </tr>
//     );
//   })}
// </tbody>
// </table>
