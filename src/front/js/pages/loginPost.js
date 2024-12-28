import React, { useContext, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const LoginPost = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await actions.loginUser(formData.email, formData.password);
        if (response.success) {
            navigate("/cliente-dashboard");
        } else {
            setErrorMessage('Credenciales incorrectas, vuelve a intentarlo');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4" style={{ maxWidth: '700px', width: '100%', height: '450px', backgroundColor: '#312E2D' }}>
                <div className="card-body rounded text-white">
                    <h2 className="text-white text-center mb-4">Inicio de Sesión</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 text-start col-12">
                            <label htmlFor="email" className="form-label text-white">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                style={{ backgroundColor: '#FFFFFF', height: '40px' }}
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3 text-start col-12">
                            <label htmlFor="password" className="form-label text-white">Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                style={{ backgroundColor: '#FFFFFF', height: '40px' }}
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        {errorMessage && <div className="mb-3 text-danger text-center">{errorMessage}</div>}
                        <div className="d-flex justify-content-center mt-4">
                            <button
                                type="submit"
                                className="btn fw-bold"
                                style={{ backgroundColor: '#7ED957', color: '#312E2D', padding: '10px 20px', borderRadius: '5px' }}
                            >
                                Iniciar Sesión
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPost;
