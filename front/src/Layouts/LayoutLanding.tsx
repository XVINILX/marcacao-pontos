import { Layout, Tooltip } from "antd";

import { useAuth } from "contexts/AuthContext";
import { ReactNode, useContext } from "react";
import { VscSignOut } from "react-icons/vsc";

const LayoutLandingPage: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { logout, isAuthenticated } = useAuth();

  return (
    <Layout style={{ backgroundColor: "#151F2B", minHeight: "100vh" }}>
      <Layout.Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
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
        </>
        {isAuthenticated && (
          <Tooltip title="Sair">
            <VscSignOut
              style={{ cursor: "pointer", color: "white" }}
              size={"20px"}
              onClick={() => logout()}
            />
          </Tooltip>
        )}
      </Layout.Header>
      <Layout.Content
        style={{
          backgroundColor: "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          padding: "50px",
          alignItems: "center",
        }}
      >
        {children}
      </Layout.Content>
    </Layout>
  );
};
export default LayoutLandingPage;
