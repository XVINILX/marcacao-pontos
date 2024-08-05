import Button from "component/Button";

import React, { useState } from "react";
import AdminAuth from "./AdminAuth";
import EmployeeAuth from "./EmployeeAuth";
import { RiArrowGoBackFill } from "react-icons/ri";
const HomePage: React.FC = () => {
  const [authType, setAuthType] = useState<string>("initial");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        gap: "25px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "25px",
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        {authType === "initial" && (
          <>
            <h1
              style={{
                fontFamily: "Montserrat",
                fontWeight: 300,
                fontSize: "25px",
                width: "100%",
                color: "white",
                textAlign: "left",
              }}
            >
              Ponto
              <b style={{ fontWeight: 800 }}> Ilumeo</b>
            </h1>
            <Button
              text="Administrador"
              type="submit"
              onClick={() => setAuthType("admin")}
            />
            <Button
              text="Bater ponto"
              type="submit"
              onClick={() => setAuthType("employee")}
            />
          </>
        )}
        {authType === "admin" && (
          <>
            <RiArrowGoBackFill
              color="white"
              style={{
                border: "1px solid white",
                borderRadius: "100%",
                width: "25px",
                height: "25px",
                display: "flex",
                alignSelf: "start",
                cursor: "pointer",
                padding: "4px",
              }}
              onClick={() => setAuthType("initial")}
            />

            <AdminAuth></AdminAuth>
          </>
        )}
        {authType === "employee" && (
          <>
            <RiArrowGoBackFill
              color="white"
              style={{
                border: "1px solid white",
                borderRadius: "100%",
                width: "25px",
                height: "25px",
                display: "flex",
                alignSelf: "start",
                cursor: "pointer",
                padding: "4px",
              }}
              onClick={() => setAuthType("initial")}
            />
            <EmployeeAuth></EmployeeAuth>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
