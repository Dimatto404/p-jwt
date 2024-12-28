//import react into the bundle
import React from "react";
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

//import your own components
import Layout from "./layout";

//render your react application

ReactDOM.render(<Layout />, document.querySelector("#app"));
