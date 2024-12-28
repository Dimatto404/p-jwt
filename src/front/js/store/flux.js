const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            clients: [],
            token: ""
        },

        actions: {
            registerUser: async (userData) => {
                try {
                    console.log('Datos de usuario enviados:', userData);
                    const response = await fetch(`https://ideal-carnival-jjwg949rvjjfrqx-3001.app.github.dev/registro`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userData)
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Error data:', errorData);
                        throw new Error('Error en el registro: ' + errorData.msg);
                    }
                    const data = await response.json();
                    console.log('Registro exitoso:', data);
                    return { success: true };
                } catch (error) {
                    console.error('Error:', error);
                    return { success: false, error: error.message };
                }
            },

            loginUser: async (email, password) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, password })
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Error data:', errorData);
                        throw new Error('Error en la autenticación: ' + errorData.msg);
                    }

                    const data = await response.json();
                    console.log('Datos recibidos del servidor:', data);
                    localStorage.setItem("token", data.access_token);
                    setStore({
                        token: data.access_token
                    });
                    console.log("Token guardado en store:", data.access_token);
                    return { success: true, data };
                } catch (error) {
                    console.error('Error en loginUser:', error);
                    return { success: false, error: error.message };
                }
            },

            logoutUser: async () => {
                try {
                    const token = localStorage.getItem("token");
                    if (!token) {
                        console.log("No token found");
                        return { success: false, error: "No token found" };
                    }

                    const response = await fetch(`${process.env.BACKEND_URL}/logout`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Error data:', errorData);
                        throw new Error('Error en el cierre de sesión: ' + errorData.message);
                    }

                    localStorage.removeItem("token");
                    setStore({ token: null });

                    console.log("Token eliminado del store");
                    return { success: true };
                } catch (error) {
                    console.error('Error en logoutUser:', error);
                    return { success: false, error: error.message };
                }

            }
        }
    };
};

export default getState;
