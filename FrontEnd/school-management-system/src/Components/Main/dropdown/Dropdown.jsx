
const Dropdown = ({ label, options, onSelect, find }) => {

  const handleItemClick = (selectedId) => {
    onSelect(selectedId);
  };

  return (

    <>
      <a
        className="btn btn-outline-primary dropdown-toggle"
        role="button"
        id="dropdownMenuLink2"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {label}
      </a>

      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        {options.map((option) => (
          <li key={option._id}>
            <a
              href="#"
              className="dropdown-item"
              onClick={() => {
                handleItemClick(option._id);
              }}
            >
              {option[find]}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Dropdown;
