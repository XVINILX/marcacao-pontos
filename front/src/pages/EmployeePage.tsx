import PunchClock from "component/Accordion/PunchClock";
import Button from "component/Button";

import ChartComponent, {
  DataPoint,
} from "component/Charts/QuantityHoursWorked";
import { useAuth } from "contexts/AuthContext";
import { User } from "domain/entities/user";

import React, { useCallback, useEffect, useState } from "react";
import { getUserById } from "services/userService";
import { Form, message, Select } from "antd";
import moment from "moment";
import { createMarcacao, getMarcacoesByUser } from "services/punchClockService";
import { ListMarcacaoPontosDTO } from "domain/entities/punchClock";
import PunchClockTimer from "component/ClockTime";

moment.locale("pt-br");
const EmployeePage: React.FC = () => {
  const [isClockRunning, setIsClockRunning] = useState(false);

  const [authType, setAuthType] = useState<string>("punchClock");
  const { authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [marcacaoList, setMarcacaoList] =
    useState<ListMarcacaoPontosDTO | null>(null);
  const [graphData, setGraphData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const handleUserSearch = async () => {
      try {
        if (authUser) {
          if (authUser.id) {
            const authenticatedUser = await getUserById(authUser?.id);
            setUser(authenticatedUser);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    handleUserSearch();
  }, [authUser]);

  const [dateForm] = Form.useForm();

  const getUserDataForPunchClock = useCallback(async () => {
    try {
      const { year, month } = dateForm.getFieldsValue();

      if (!year || !month) {
        message.error({
          content: "Algo deu errado ao selecionar usuário",
        });
        return;
      }

      if (authUser) {
        const info = await getMarcacoesByUser(authUser.id, month-1, year);
        if (info.notFinished) {
          setIsClockRunning(true);
        }
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
      }
    } catch (err) {
      console.error(err);
    }
  }, [authUser, dateForm]);

  useEffect(() => {
    getUserDataForPunchClock();
  }, [getUserDataForPunchClock]);

  const handleChangePunchClockState = async () => {
    await createMarcacao();

    await getUserDataForPunchClock();
  };

  const handleClockToggle = () => {
    setIsClockRunning((prev) => !prev);

    handleChangePunchClockState();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        gap: "25px",
        width: "350px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          gap: "15px",
        }}
      >
        <Button
          text="Bater ponto"
          type="submit"
          onClick={() => {
            setAuthType("punchClock");
            getUserDataForPunchClock();
          }}
        />
        <Button
          text="Dashboard"
          type="submit"
          onClick={() => {
            setAuthType("dashboard");
            getUserDataForPunchClock();
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "25px",
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
          width: "100%",
        }}
      >
        {authType === "punchClock" && (
          <>
            <div
              style={{
                width: "100%",
                gap: 10,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "start",
                  justifyItems: "start",
                  gap: "25px",
                }}
              >
                <h4
                  style={{
                    fontFamily: "Montserrat",
                    fontWeight: 300,
                    fontSize: "15px",
                    width: "100%",
                    color: "white",
                    textAlign: "left",
                    margin: 0,
                  }}
                >
                  Relógio de ponto
                </h4>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "end",
                  }}
                >
                  <h4
                    style={{
                      fontFamily: "Montserrat",
                      fontWeight: 300,
                      fontSize: "12px",
                      width: "100%",
                      color: "white",
                      textAlign: "right",
                      margin: 0,
                    }}
                  >
                    {user?.loginIdentification}
                  </h4>
                  <b
                    style={{
                      fontWeight: 800,
                      textAlign: "right",
                      color: "white",
                    }}
                  >
                    Usuário
                  </b>
                </div>
              </div>
              <PunchClockTimer
                onToggle={handleClockToggle}
                isRunning={isClockRunning}
                initialMinutes={
                  marcacaoList?.notFinished?.totalMinutesDifference ?? 0
                }
              />
              <b
                style={{
                  fontWeight: 400,
                  textAlign: "left",
                  width: "100%",
                  color: "white",
                  display: "block",
                }}
              >
                Dias anteriores
              </b>
            </div>
            <div style={{ display: "flex", width: "100%" }}>
              <Form
                layout="vertical"
                style={{ display: "flex", color: "white" }}
                form={dateForm}
                initialValues={{
                  month: moment().month() + 1,
                  year: moment().year(),
                }}
                onValuesChange={() => getUserDataForPunchClock()}
              >
                <Form.Item
                  label="Mês"
                  name={"month"}
                  style={{ color: "white" }}
                >
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
            <div style={{ width: "100%" }}>
              {marcacaoList &&
                marcacaoList?.marcacoPontosByDay.map((value) => {
                  return (
                    <PunchClock
                      marcacao={value}
                      content={value.totalForThatDay}
                    ></PunchClock>
                  );
                })}
            </div>
          </>
        )}
        {authType === "dashboard" && (
          <ChartComponent
            totalMonth={marcacaoList?.totalForThatMonth ?? 0}
            data={graphData}
          />
        )}
      </div>
    </div>
  );
};

export default EmployeePage;
