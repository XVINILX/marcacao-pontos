import { Layout } from "antd";
import { ReactNode } from "react";

const LayoutLandingPageSecond: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <Layout>
      <Layout.Content style={{ backgroundColor: "#FFFFF" }}>
        {children}
      </Layout.Content>
    </Layout>
  );
};
export default LayoutLandingPageSecond;
