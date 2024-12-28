import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showRedirectButton, setShowRedirectButton] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Datos del formulario:', formData);
        const result = await actions.registerUser(formData);
        console.log("Resultado del registro:", result);
        if (result.success) {
            setShowRedirectButton(true);
            setErrorMessage('');
        } else {
            setErrorMessage(result.error || 'Error en el registro');
        }
    };

    const handleRedirect = () => {
        navigate("/loginpostregister");
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4" style={{ maxWidth: '700px', width: '100%', height: '450px', backgroundColor: '#312E2D' }}>
                <div className="card-body text-white">
                    <h2 className="text-white text-center mb-4">Registro</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 text-start">
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
                        <div className="mb-3 text-start">
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
                        <div className="d-flex justify-content-center mt-4">
                            <button
                                type="submit"
                                className="btn fw-bold"
                                style={{ backgroundColor: '#7ED957', color: '#312E2D', padding: '10px 20px', borderRadius: '5px' }}
                            >
                                Confirmar Registro
                            </button>
                        </div>
                    </form>
                    {errorMessage && (
                        <div className="mt-4 text-center text-danger">
                            {errorMessage}
                        </div>
                    )}
                    {showRedirectButton && (
                        <div className="d-flex justify-content-center mt-4">
                            <button
                                onClick={handleRedirect}
                                className="btn fw-bold"
                                style={{ backgroundColor: '#7ED957', color: '#312E2D', padding: '10px 20px', borderRadius: '5px' }}
                            >
                                Ir a la página de inicio
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Signup;

