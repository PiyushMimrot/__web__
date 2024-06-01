import { useState } from "react";
import Swal from "sweetalert2";
import { MdRemoveCircle } from "react-icons/md";

export default function AddClassform({ formId, addClassdata }) {
  const [sectionsBlk, setSectionsBlk] = useState([]);
  const [class_name, setClassname] = useState("");
  const [sections, setSections] = useState([]);

  const addSection = () => {
    setSections([...sections, { name: "" }]);
    setSectionsBlk([...sectionsBlk, 1]);
  };

  const handleClassname = (e) => {
    setClassname(e.target.value);
  };

  const handleSections = (e, idx) => {
    sections[idx][`name`] = e.target.value;
    setSections([...sections]);
  };
  const handleRemoveSec = (e, idx) => {
    sections.splice(idx, 1);
    sectionsBlk.splice(idx, 1);

    setSections([...sections]);
    setSectionsBlk([...sectionsBlk]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sections.length && sections[0].name) {
      let submitData = { name: class_name, sections };
      addClassdata(submitData);
    } else {
      Swal.fire({
        text: "Enter atleast 1 Section",
        icon: "info",
        timer: 3000,
      });
    }

    setSections([]);
    setSectionsBlk([]);
    setClassname("");
  };
  console.log(sections);

  return (
    <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title  fw-bold" id="addholidayLabel">
              {" "}
              Add New Class
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Class Name
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleFormControlInput1"
                placeholder="Enter New Class Name"
                name="name"
                value={class_name}
                onChange={handleClassname}
              />
            </div>
            <div>
              {sectionsBlk.map((item, idx) => {
                return (
                  <div key={idx} class_name="card card-body">
                    <div className="mb-3 row ">
                      <label
                        htmlFor="exampleFormControlInput1"
                        className="form-label col"
                      >
                        Section Name
                      </label>
                      <input
                        type="text"
                        className="form-control col"
                        id="exampleFormControlInput1"
                        placeholder="New Section"
                        name="name"
                        value={sections[idx].name}
                        onChange={(e) => handleSections(e, idx)}
                      />
                      <div
                        className=" btn  col-2 "
                        onClick={(e) => handleRemoveSec(e, idx)}
                      >
                        <MdRemoveCircle className="fs-5 text-danger shadow" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              className="btn btn-secondary w-100"
              onClick={addSection}
              disabled={class_name ? false : true}
            >
              ADD NEW SECTION
            </button>
          </div>
          <div className="modal-footer">
            <button
              disabled={
                class_name.trim() && sections.length && sections[0].name.trim()
                  ? false
                  : true
              }
              type="submit"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
