import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Registro from "../component/signup";
import { Context } from "../store/appContext";

const Login = () => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showRegistro, setShowRegistro] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await actions.loginUser(email, password);
        if (response.success) {
            navigate("/cliente-dashboard");
        } else {
            setErrorMessage('Login failed. Please check your email and password.');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            {showRegistro ? (
                <Registro />
            ) : (
                <div className="card p-4" style={{ maxWidth: '700px', width: '100%', height: '450px', backgroundColor: '#312E2D' }}>
                    <div className="card-body text-white text-center">
                        <h2 className="text-white text-center mb-4">Inicio de Sesión</h2>
                        <form className="d-flex flex-column align-items-center" onSubmit={handleSubmit}>
                            <div className="mb-3 text-start col-12">
                                <label htmlFor="exampleInputEmail1" className="form-label text-white">Usuario</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="exampleInputEmail1"
                                    style={{ backgroundColor: '#737373', height: '40px' }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="mb-3 text-start col-12">
                                <label htmlFor="exampleInputPassword1" className="form-label text-white">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="exampleInputPassword1"
                                    style={{ backgroundColor: '#737373', height: '40px' }}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {errorMessage && <div className="mb-3 text-danger">{errorMessage}</div>}
                            <div className="d-flex justify-content-center gap-3 mt-4">
                                <button
                                    type="submit"
                                    className="btn fw-bold"
                                    style={{ backgroundColor: '#7ED957', color: '#312E2D', padding: '10px 20px', borderRadius: '5px' }}
                                >
                                    Iniciar Sesión
                                </button>
                                <button
                                    type="button"
                                    className="btn fw-bold"
                                    style={{ backgroundColor: '#7ED957', color: '#312E2D', padding: '10px 20px', borderRadius: '5px' }}
                                    onClick={() => setShowRegistro(true)}
                                >
                                    Registrarse
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
