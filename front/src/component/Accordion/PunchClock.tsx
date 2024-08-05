import React, { useState } from "react";
import "../Accordion/accordion.css";
import { IoIosArrowDown } from "react-icons/io";
import { ReadMarcacaoPontosWithDto } from "domain/entities/punchClock";
import moment from "moment";
interface PunchClockProps {
  marcacao: ReadMarcacaoPontosWithDto;
  content: React.ReactNode;
}

const PunchClock: React.FC<PunchClockProps> = ({ marcacao, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordion-item">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
          padding: "0px 15px 0px 0px",
        }}
      >
        <button
          className={`accordion-button ${isOpen ? "rotate" : ""}`}
          onClick={toggleAccordion}
        >
          <IoIosArrowDown color="white" size={"25"} />
        </button>

        <p>{moment(marcacao.marcacao[0].initialTime).format("DD/MM/YYYY")}</p>
        <p>Total: {marcacao.totalForThatDay}</p>
      </div>
      <div className={`accordion-content ${isOpen ? "open" : ""}`}>
        {marcacao.marcacao.map((marcacao, index) => (
          <div
            key={`accordion${index}`}
            style={{
              border: "solid 1px white",
              borderRight: "none",
              borderLeft: "none",
              color: "white",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div style={{ textAlign: "left", width: "50%" }}>
              <p>Inicio:</p>
              <p>{moment(marcacao.initialTime).format("DD/MM/YYYY hh:mm")}</p>
              <p>Fim:</p>
              <p>{moment(marcacao.finalTime).format("DD/MM/YYYY hh:mm")}</p>
            </div>
            <p style={{ textAlign: "right" }}>
              Tempo Total: {marcacao.timeDifference}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PunchClock;
