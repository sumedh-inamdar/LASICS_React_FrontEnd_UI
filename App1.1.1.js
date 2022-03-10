import React, { useState, useEffect } from "react";
// import React Functional Components
import { References } from "./components/References";
import { Targets } from "./components/Targets";
import { DaysInPlan } from "./components/DaysInPlan";
import { MaxTimeDiffBetnRefandTar } from "./components/MaxTimeDiffBetnRefandTar";
import { MaxSolarZenithAngle } from "./components/MaxSolarZenithAngle";
import { MaxViewZenithAngle } from "./components/MaxViewZenithAngle";
import { EmailAddressField } from "./components/EmailAddressField";
//https://www.npmjs.com/package//react-datepicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { landandgeoTargets } from "./utils/target2Constants.js";
import "./styles.css";

function App() {
  const [references, setReferences] = useState([]);
  const [refval, setRefval] = useState("AQUA");
  const [refvalErr, setRefvalErr] = useState({});
  const [targets, setTargets] = useState([]);
  const [tarval, setTarval] = useState("NOAA 20");
  const [tarvalErr, setTarvalErr] = useState({});
  // Declare a new state variable called references
  // Add a function called setReferences which will update state variable to User selected value
  // references variable is created and setter call setReferences is used to hold data
  // 'fetch' ed from ./components/References.js using the useEffect Hook.
  //const [targetRestrictions,setTargetRestrictions] = useState([]);

  const [startDate, setStartDate] = useState(new Date());
  const [startDateErr, setStartDateErr] = useState({});

  const [daysinplan, setDaysInPlan] = useState([]);
  const [dipval, setDIPval] = useState(1);
  const [dipvalErr, setDIPvalErr] = useState({});

  const [maxtimediff, setMaxTimeDiff] = useState([]);
  const [timediffval, setTimeDiffval] = useState(15);
  const [timediffvalErr, setTimeDiffvalErr] = useState({});

  const [maxsza, setMaxSZA] = useState([]);
  const [szaval, setSZAval] = useState(70);
  const [szavalErr, setSZAvalErr] = useState({});

  const [maxvza, setMaxVZA] = useState([]);
  const [vzaval, setVZAval] = useState(70);
  const [vzavalErr, setVZAvalErr] = useState({});

  const [emailval, setEmailval] = useState([]);
  const [emailvalErr, setEmailvalErr] = useState({});

  let now = moment();
  //console.log(now);
  //var SPSPlanStartDate = now.format('YYYYMMDD'+'T00:00:00');

  useEffect(() => {
    //fetch("/getTargetNames").then(
    fetch("/serveTargets").then((res) =>
      res.json().then((data) => {
        setReferences(data);
        setTargets(data);
        //console.log(data)
      })
    );
  }, []);

  //useEffect ( () => {
  //fetch("/getTargetRestrictions").then(
  //res => res.json()
  //.then(
  //data =>   {
  //setTargetRestrictions(data)
  //console.log(data)
  //})
  //);
  //}, []);

  useEffect(() => {
    fetch("/serveTimeDiffbetnReferenceandTargetChoices").then((res) =>
      res.json().then((data) => {
        setMaxTimeDiff(data);
        //console.log(data)
      })
    );
  }, []);

  useEffect(() => {
    fetch("/serveDaysInPlanChoices").then((res) =>
      res.json().then((data) => {
        setDaysInPlan(data);
        //console.log(data)
      })
    );
  }, []);

  useEffect(() => {
    fetch("/serveSolarZenithAngleChoices").then((res) =>
      res.json().then((data) => {
        setMaxSZA(data);
        //console.log(data)
      })
    );
  }, []);

  useEffect(() => {
    fetch("/serveViewZenithAngleChoices").then((res) =>
      res.json().then((data) => {
        setMaxVZA(data);
        //console.log(data)
      })
    );
  }, []);

  function SubmitButton() {
    if (refval && tarval && startDate && dipval && szaval && emailval) {
      return <button type='button'>Button</button>;
    } else {
      return (
        <button type='button' disabled>
          Button
        </button>
      );
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const isValid = formValidation();

    //console.log("Reference Selected: " + refval)
    //console.log("Target Selected: " + tarval)
    //console.log("Plan Start Date: " + moment(startDate).format('YYYYMMDD'+'T00:00:00'))
    //console.log("Plan Start Date: " + moment(startDate).format('YYYYMMDD')+'T00:00:00')
    //console.log("Number of Days in Plan: " + dipval)
    //console.log("Max. Time Difference between Reference & Target: " + timediffval)
    //console.log("Max. SZA: " + szaval)
    //console.log("Max. VZA: " + vzaval)
    //alert("Submit was clicked/Sending Data to Python Flask Backend")
    // send POST request to Flask here setup Key - Value pair DICT
    var jsonData = [
      { key: "General:PlanDurationInDays", value: dipval },
      {
        key: "General:PlanStartEpochDate",
        value: moment(startDate).format("YYYYMMDD" + "T00:00:00"),
      },
      { key: "Reference:Name", value: refval },
      {
        key: "Reference:Constraints:Constraint:ConstraintName:max_solar_zenith_angle",
        value: szaval,
      },
      { key: "Targets:Target:TargetName", value: tarval },
      {
        key: "Targets:Target:Constraints:Constraint:ConstraintName:max_time_diff_ref_and_target",
        value: timediffval,
      },
      {
        key: "Targets:Target:Constraints:Constraint:ConstraintName:max_viewing_zenith_angle",
        value: vzaval,
      },
      { key: "PlanRequester:Email", value: emailval },
    ];
    console.log(JSON.stringify(jsonData));
    // send POST request to Flask route echoJSON for testing
    // Send data to the backend via POST if isValid is True
    if (isValid) {
      save();
      console.log("Form has Valid Input: " + isValid);
      fetch("/echoJSON", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });
    }

    if (!isValid) {
      console.log("Form has INValid Input: ");
    }
  };

  const formValidation = () => {
    const refvalErr = {};
    const tarvalErr = {};
    const startDateErr = {};
    const dipvalErr = {};
    const timediffvalErr = {};
    const szavalErr = {};
    const vzavalErr = {};
    const emailvalErr = {};

    let isValid = true;

    console.log("Initial isValid State: " + isValid);

    if (refval.trim().length < 4) {
      refvalErr.refvalBad = "Target 1 is not recognized";
      isValid = false;
      console.log(refval + " isValid: " + isValid);
    }

    if (tarval == refval) {
      tarvalErr.tarvalBad = "Target 2 CANNOT BE same as Target 1";
      isValid = false;
      //console.log(tarval + ' isValid: ' + isValid)
      console.log(tarvalErr.tarvalBad);
    }
    //if (tarval.trim().length < 5) {
    //tarvalErr.tarvalBad = "Target is not recognized";
    //isValid = false;
    //}
    //console.log(tarval + ' isValid: ' + isValid)

    if (startDate.length < 5) {
      startDateErr.startDateBad = "Start Date is not recognized";
      isValid = false;
      console.log(startDate + " isValid: " + isValid);
    }
    // Restrict Plan to Max 7 days
    if (dipval > 30) {
      dipvalErr.dipvalBad = "Days in Plan should be between 1-30 Days";
      isValid = false;
      console.log(dipvalErr.dipvalBad);
      console.log(dipval + " isValid: " + isValid);
    }

    if (timediffval < 5) {
      timediffvalErr.timediffvalBad =
        "Time Difference should be greater than 0 Minutes";
      isValid = false;
      console.log(timediffval + " isValid: " + isValid);
    }

    if (szaval < 5.0) {
      szavalErr.szavalBad = "SZA should be greater than 5.0 Deg";
      isValid = false;
      console.log(szaval + " isValid: " + isValid);
    }

    if (vzaval < 5.0) {
      vzavalErr.vzavalBad = "VZA should be greater than 5.0 Deg";
      isValid = false;
      console.log(vzaval + " isValid: " + isValid);
    }

    if (emailval.length < 2) {
      emailvalErr.emailvalBad = "Please enter Valid Email Address";
      isValid = false;
      console.log(emailval + " isValid: " + isValid);
    }

    setRefvalErr(refvalErr);
    setTarvalErr(tarvalErr);
    setStartDateErr(startDateErr);
    setDIPvalErr(dipvalErr);
    setTimeDiffvalErr(timediffvalErr);
    setSZAvalErr(szavalErr);
    setVZAvalErr(vzavalErr);
    setEmailvalErr(emailvalErr);

    console.log(isValid);
    return isValid;
  };

  const save = () => {
    document.querySelector("#submitButton").disabled = true;
    var msg = document.getElementById("msg");
    msg.textContent =
      "Request Created and  Submitted and the button disabled 😀";
  };

  const resetForm = () => {
    document.querySelector("#submitButton").disabled = false;
    document.querySelector("#msg").textContent = "";
    document.querySelector("#mainForm").reset();
    setRefval("AQUA");
    setTarval("NOAA 20");
  };

  return (
    <div className='App'>
      <h2> LASICS (Beta) </h2>

      <form onSubmit={handleSubmit}>
        <h4> Target 1 </h4>
        <References
          references={references}
          onRefChange={setRefval}
          refval={refval}
        />
        <br />
        {Object.keys(refvalErr).map((key) => {
          return <div style={{ color: "red" }}>{refvalErr[key]}</div>;
        })}

        <h4> Target 2 </h4>
        <Targets targets={targets} onTarChange={setTarval} value={tarval} />
        <br />
        {Object.keys(tarvalErr).map((key) => {
          return <div style={{ color: "red" }}>{tarvalErr[key]}</div>;
        })}

        <h4> Choose Plan Start Date </h4>
        <DatePicker
          selected={startDate}
          onChange={(date) => {
            setStartDate(date);
            //SPSPlanStartDate = moment(date).format('YYYYMMDD'+'T00:00:00');
            //console.log(SPSPlanStartDate);
            //const ISOdate = date.toISOString();
            //console.log(date);
            //console.log(ISOdate);
          }}
          maxDate={new Date()}
        />

        <h4> Days in Plan </h4>
        <DaysInPlan daysinplan={daysinplan} onDIPChange={setDIPval} />
        <br />
        {Object.keys(dipvalErr).map((key) => {
          return <div style={{ color: "red" }}>{dipvalErr[key]}</div>;
        })}

        {!landandgeoTargets.includes(tarval) && (
          <div>
            <h4>
              {" "}
              Maximum Time Difference between Reference and Target Meas.
              (Minutes){" "}
            </h4>
            <MaxTimeDiffBetnRefandTar
              maxtimediff={maxtimediff}
              onTimeDiffChange={setTimeDiffval}
            />
          </div>
        )}

        <h4> Maximum Solar Zenith Angle (Deg.) </h4>
        <MaxSolarZenithAngle maxsza={maxsza} onSZAChange={setSZAval} />

        <h4> Maximum View Zenith Angle (Deg.) </h4>
        <MaxViewZenithAngle maxvza={maxvza} onVZAChange={setVZAval} />

        <h4> Email Address to receive LASICS Science Plan </h4>
        <EmailAddressField emailval={emailval} onEmailChange={setEmailval} />
        <br />
        {Object.keys(emailvalErr).map((key) => {
          return <div style={{ color: "red" }}>{emailvalErr[key]} </div>;
        })}
        <br />
        <br />
        <br />
        <input
          id='submitButton'
          type='submit'
          value='Create & Submit LASICS-SPS Request'
        ></input>
        <button id='resetButton' type='button' onClick={resetForm}>
          RESET LASICS-SPS FORM
        </button>
      </form>
      <p id='msg'></p>
    </div>
  );
}

export default App;
