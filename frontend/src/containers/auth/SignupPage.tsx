import {
  Container,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { signup } from "../../features/auth/authApi";
import { Link } from "react-router-dom";

const SignupPage = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.auth);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    re_password: "",
  });

  const { first_name, last_name, username, email, password, re_password } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== re_password) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      await dispatch(signup({ email, username, first_name, last_name, password, re_password })).unwrap();
      toast.success("Registro exitoso.");
    } catch (err) {
      console.error("Error al registrarse", err);
      toast.error("Error al registrarse. Por favor, verifica tus datos.");
    }
  };

  return (
      <Container
        fluid
        className="min-vh-100 d-flex align-items-center justify-content-center py-4"
        style={{ background: "#f5f7fa", fontFamily: "'Poppins', sans-serif" }}
      >
        <Card className="shadow" style={{ maxWidth: "500px", width: "100%" }}>
          <Card.Body>
            <div className="mt-4">
              <div className="text-center">
                <h3 className="mb-3 fw-semibold">Crear Cuenta</h3><hr/>
                <p className="text-muted">Usa Google o tu correo</p>
                <div className="d-flex justify-content-center gap-3 mb-3">
                  <Button variant="outline-light" className="d-flex align-items-center gap-2">
                    <img
                      src="https://developers.google.com/identity/images/g-logo.png"
                      alt="Google"
                      style={{ width: "20px", height: "20px" }}
                    />
                  </Button>
                </div>
                <p className="text-muted">o completa el formulario</p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Nombre"
                    name="first_name"
                    value={first_name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Apellido"
                    name="last_name"
                    value={last_name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Usuario"
                    name="username"
                    value={username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Correo electrónico"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="Contraseña"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="Repetir contraseña"
                    name="re_password"
                    value={re_password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4 d-flex align-items-start">
                  <Form.Check
                    type="checkbox"
                    name="agreeToTerms"
                    required
                  />
                  <Form.Label className="fw-light mx-3">
                    Acepto los términos y condiciones
                  </Form.Label>
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100 mb-3 border-0"
                  disabled={loading}
                  style={{
                    background: "#0e2238",
                }}
                >
                  {loading ?
                    <div className="d-flex justify-content-center align-items-center">
                      <Oval
                        color="#0e2238"
                        width={20}
                        height={20}
                        secondaryColor="#ccc"
                        ariaLabel="loading"
                      />
                    </div> :
                    "Registrarse"
                  }
                </Button>
              </Form>
              <div className="text-center mt-3 text-secondary">
                            <p >
                              ¿Ya tienes una cuenta? <Link to="/Login">Ingresa</Link>
                            </p>
                          </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
  );
};

export default SignupPage;
