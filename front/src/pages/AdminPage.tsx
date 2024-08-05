import { Form, message, Modal, Select, Table } from "antd";
import PunchClock from "component/Accordion/PunchClock";
import Button from "component/Button";

import Input from "component/Input/Input";
import "moment/locale/pt-br";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { CreateUser, User } from "domain/entities/user";
import { createUser, getAllUsers, getUserById } from "services/userService";
import { FaWhatsapp } from "react-icons/fa";
import { PiEye } from "react-icons/pi";
import { getMarcacoesByUser } from "services/punchClockService";
import { ListMarcacaoPontosDTO } from "domain/entities/punchClock";
import ChartComponent, {
  DataPoint,
} from "component/Charts/QuantityHoursWorked";

moment.locale("pt-br");

const AdminPage: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [searchUser, setUserSearch] = useState<string>("");
  const [userList, setUserList] = useState<User[]>([]);
  const [userDetail, setUserDetail] = useState<User>();

  const [openModal, setOpenModal] = useState<boolean>(false);

  const [marcacaoList, setMarcacaoList] =
    useState<ListMarcacaoPontosDTO | null>(null);

  const [dateForm] = Form.useForm();

  const [graphData, setGraphData] = useState<DataPoint[]>([]);

  const [form] = Form.useForm<CreateUser>();
  const handleFormSubmit = async (values: CreateUser) => {
    try {
      const user = await createUser(values);
      if (user) {
        setOpenModal(false);
        setPage(1);
        message.success({ content: "Usuário criado com sucesso" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserSelection = async (id: string | undefined) => {
    try {
      const { year, month } = dateForm.getFieldsValue();

      if (!id) {
        message.error({ content: "Algo deu errado ao selecionar usuário" });
        return;
      }

      if (!year || !month) {
        message.error({ content: "Algo deu errado ao selecionar usuário" });
        return;
      }

      const info = await getMarcacoesByUser(id, month - 1, year);

      setMarcacaoList(info);

      setGraphData(
        info.marcacoPontosByDay.map((marcacoPonto) => {
          return {
            hours: marcacoPonto.totalMinutesForThatDay,
            date: moment(marcacoPonto.marcacao[0].initialTime).format(
              "DD/MM/YYYY"
            ),
          };
        })
      );

      const user = await getUserById(id);
      setUserDetail(user);
    } catch (err) {
      message.error({ content: "Algo deu errado ao selecionar usuário" });
    }
  };

  const handleUserList = async (
    itemsPerPage: number = 10,
    page: number,
    search: string
  ) => {
    try {
      const users = await getAllUsers(itemsPerPage, page, search);
      if (users) {
        setUserList(users.data);
        setTotalUsers(users.total);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Código",
      dataIndex: "loginIdentification",
      key: "loginIdentification",
      render: (text: string, record: User) => {
        return (
          <>
            {record.loginIdentification ? (
              <div
                style={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "15px",
                  alignItems: "center",
                }}
              >
                {record.loginIdentification}
                <FaWhatsapp color="green" size={"25"} />
              </div>
            ) : (
              <></>
            )}
          </>
        );
      },
    },

    {
      title: "WhatsApp",
      dataIndex: "whatsApp",
      key: "whatsApp",
      render: (text: string, record: User) => {
        return (
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              gap: "15px",
              alignItems: "center",
            }}
          >
            {record.cellphone}
            <FaWhatsapp color="green" size={"25"} />
          </div>
        );
      },
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      render: (text: string, record: User) => {
        return (
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              gap: "15px",
              alignItems: "center",
            }}
            onClick={() => handleUserSelection(record.id)}
          >
            <PiEye color="green" size={"25"} />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    handleUserList(10, page, searchUser);
  }, [page, searchUser]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        gap: "25px",
        width: "1000px",
      }}
    >
      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        title={null}
        width={"80%"}
      >
        <Form<CreateUser>
          form={form}
          onFinish={handleFormSubmit}
          layout="vertical"
          style={{ gap: "15px", display: "flex", flexDirection: "column" }}
        >
          <Input name={"name"} placeholder="Nome completo" />
          <Input name={"email"} placeholder="E-mail" />
          <Input name={"cellphone"} placeholder="Telefone" />

          <Button text="Confirmar" type="submit" />
        </Form>
      </Modal>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: "15px",
        }}
      >
        <Input
          placeholder="Buscar usuário"
          name="searchUser"
          onChange={(e) => setUserSearch(e.target.value)}
        />
        <Button
          text="Criar usuário"
          type="submit"
          onClick={() => setOpenModal(true)}
        />
        <Table
          dataSource={userList}
          columns={columns}
          pagination={{
            current: page,
            pageSize: 10,
            total: totalUsers,
            onChange: (page, pageSize) => {
              setPage(page);
            },
          }}
          scroll={{ x: "max-content" }}
        ></Table>
      </div>
      <div style={{ display: "flex", width: "100%" }}>
        <Form
          layout="vertical"
          style={{ display: "flex", color: "white" }}
          form={dateForm}
          initialValues={{ month: moment().month() + 1, year: moment().year() }}
          onValuesChange={() => handleUserSelection(userDetail?.id)}
        >
          <Form.Item label="Mês" name={"month"} style={{ color: "white" }}>
            <Select
              id="month"
              options={Array.from({ length: 12 }, (_, i) => i + 1).map(
                (month) => ({
                  value: month,
                  label: month,
                })
              )}
              style={{ width: "100px" }}
            ></Select>
          </Form.Item>
          <Form.Item label="Ano" name={"year"}>
            <Select
              id="year"
              options={Array.from(
                { length: 10 },
                (_, i) => new Date().getFullYear() - i
              ).map((y) => ({ value: y, label: y }))}
              style={{ width: "100px" }}
            ></Select>
          </Form.Item>
        </Form>
      </div>
      {userDetail && (
        <>
          <div
            className="w-[100%]"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
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
              {userDetail.name}
            </h1>
            <h4
              style={{
                fontFamily: "Montserrat",
                fontWeight: 300,
                fontSize: "16px",
                width: "100%",
                color: "white",
                textAlign: "right",
                margin: 0,
              }}
            >
              {userDetail.loginIdentification}
            </h4>
          </div>
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
            {moment() ? moment().format("DD/MM/YYYY") : ""}
          </h1>
          <ChartComponent
            totalMonth={marcacaoList?.totalForThatMonth ?? 0}
            data={graphData}
          />
          {marcacaoList &&
            marcacaoList?.marcacoPontosByDay.map((value) => {
              return (
                <PunchClock
                  marcacao={value}
                  content={value.totalForThatDay}
                ></PunchClock>
              );
            })}
        </>
      )}
    </div>
  );
};

export default AdminPage;
