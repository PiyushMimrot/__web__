import image from "../utils/imgs/404.png";

export default function PageNotFound() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <button
        className="btn btn-outline-primary"
        onClick={() => (window.location.href = "/home")}
      >
        Go Home
      </button>
      <img width={"95%"} src={image} />
    </div>
  );
}
