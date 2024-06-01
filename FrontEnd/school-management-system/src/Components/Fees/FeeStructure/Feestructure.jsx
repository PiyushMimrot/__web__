import Tutioncharges from "./Charges/Tutioncharges";
import Extracharges from "./ExtraCharges/Extracharges";
import Specialcharges from "./SpecialCharges/Specialcharges";
import Taxes from "./Taxes/Taxes";
export default function FeeStructure() {
  return (
    // <div>
    //   <div className="row align-item-center row-deck g-3 mb-3">
    //     <Tutioncharges />
    //     <Taxes />
    //   </div>
    //   <div className="row align-item-center row-deck g-3 mb-3">
    //     <Extracharges />
    //     <Specialcharges />
    //   </div>
    // </div>
    <>
      <h3 className="fw-bold py-2 text-primary">Fee Structure</h3>
      <ul className="nav nav-tabs nav-justified" role="tablist">
        <li className="nav-item" role="presentation">
          <a
            className="nav-link active text-primary"
            id="justified-tab-0"
            data-bs-toggle="tab"
            href="#tutioncharges"
            role="tab"
            aria-controls="justified-tabpanel-0"
            aria-selected="true"
          >
            {" "}
            Tution
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className="nav-link text-primary"
            id="justified-tab-1"
            data-bs-toggle="tab"
            href="#taxes"
            role="tab"
            aria-controls="justified-tabpanel-1"
            aria-selected="false"
          >
            {" "}
            Taxes
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className="nav-link text-primary"
            id="justified-tab-1"
            data-bs-toggle="tab"
            href="#extracharges"
            role="tab"
            aria-controls="justified-tabpanel-1"
            aria-selected="false"
          >
            {" "}
            Class
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className="nav-link text-primary"
            id="justified-tab-1"
            data-bs-toggle="tab"
            href="#specialcharges"
            role="tab"
            aria-controls="justified-tabpanel-1"
            aria-selected="false"
          >
            {" "}
            Special
          </a>
        </li>
      </ul>

      <div className="tab-content pt-5" id="tab-content">
        {/* tutioncharges -Tab */}
        <div
          className="tab-pane active"
          id="tutioncharges"
          role="tabpanel"
          aria-labelledby="justified-tab-0"
        >
          <div className="d-flex justify-content-center">
            <Tutioncharges />
          </div>
        </div>

        {/* taxes -Tab  */}
        <div
          className="tab-pane"
          id="taxes"
          role="tabpanel"
          aria-labelledby="justified-tab-1"
        >
          <Taxes />
        </div>

        {/* extracharges -Tab */}
        <div
          className="tab-pane"
          id="extracharges"
          role="tabpanel"
          aria-labelledby="justified-tab-1"
        >
          <Extracharges />
        </div>

        {/* specialcharges -Tab */}
        <div
          className="tab-pane"
          id="specialcharges"
          role="tabpanel"
          aria-labelledby="justified-tab-1"
        >
          <Specialcharges />
        </div>
      </div>
    </>
  );
}
