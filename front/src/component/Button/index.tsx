interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

const Button: React.FC<ButtonProps> = ({ text, ...buttonProps }) => {
  return (
    <button
      style={{
        backgroundColor: "#FE8A00",
        width: "100%",
        borderRadius: "4px",
        padding: "15px 0px",
        border: "none",
        textAlign: "center",
        fontFamily: "Montserrat",
        cursor: "pointer",
      }}
      {...buttonProps}
    >
      <p
        style={{
          textAlign: "center",
          fontFamily: "Montserrat",
          color: "#1E2733",
        }}
      >
        {text}
      </p>
    </button>
  );
};

export default Button;
