const ConfigIcon = ({ active }) => {
  return (
    <svg
      width="22"
      height="20"
      viewBox="0 0 25 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.6 0V3.9H3.9V0H2.6ZM11.7 0V15.6H13V0H11.7ZM20.8 0V3.9H22.1V0H20.8ZM0 5.2V9.1H6.5V5.2H0ZM18.2 5.2V9.1H24.7V5.2H18.2ZM1.3 6.5H5.2V7.8H1.3V6.5ZM19.5 6.5H23.4V7.8H19.5V6.5ZM2.6 10.4V26H3.9V10.4H2.6ZM20.8 10.4V26H22.1V10.4H20.8ZM9.1 16.9V20.8H15.6V16.9H9.1ZM10.4 18.2H14.3V19.5H10.4V18.2ZM11.7 22.1V26H13V22.1H11.7Z"
        fill={!active ? "#043069" : "white"}
      />
    </svg>
  );
};

export default ConfigIcon;
