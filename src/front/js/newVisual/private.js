import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar";

const Private = () => {
    return (
        <div className="container-fluid d-flex p-0 vh-100">
            <div className="d-flex flex-column w-100" >
                <Navbar />
            </div>
        </div>
    );
};

export default Private;