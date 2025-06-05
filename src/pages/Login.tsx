import React, { useState, FormEvent, ChangeEvent } from "react";
import {
  Container,
  Tabs,
  Tab,
  Form,
  Button,
  Card,
  Row,
  Col,
} from "react-bootstrap";

// Tipos para los formularios
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterFormData {
  name: string;
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
  agreeToTerms: boolean;
}

// Tipo para las tabs
type ActiveTab = "login" | "register";

// Props del componente
interface LoginProps {
  onLogin?: (data: LoginFormData) => void;
  onRegister?: (data: RegisterFormData) => void;
  onSocialLogin?: (provider: string) => void;
}

const Login: React.FC<LoginProps> = ({
  onLogin,
  onRegister,
  onSocialLogin,
}) => {
  // Estado para la tab activa
  const [activeTab, setActiveTab] = useState<ActiveTab>("login");

  // Estados para el formulario de login
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Estados para el formulario de registro
  const [registerForm, setRegisterForm] = useState<RegisterFormData>({
    name: "",
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
    agreeToTerms: false,
  });

  // Handler para cambiar de tab
  const handleTabSelect = (selectedTab: string | null): void => {
    if (selectedTab === "login" || selectedTab === "register") {
      setActiveTab(selectedTab);
    }
  };

  // Handlers para login form
  const handleLoginInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handlers para register form
  const handleRegisterInputChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value, type, checked } = e.target;
    setRegisterForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit handlers
  const handleLoginSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onLogin?.(loginForm);
  };

  const handleRegisterSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (registerForm.password !== registerForm.repeatPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    if (!registerForm.agreeToTerms) {
      alert("Debes aceptar los términos y condiciones");
      return;
    }
    onRegister?.(registerForm);
  };

  // Handler para login social
  const handleSocialLogin = (provider: string): void => {
    onSocialLogin?.(provider);
  };

  return (
    <div>
    <Container className="mt-5" style={{ maxWidth: "500px" }}>
      <Card>
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={handleTabSelect}
            className="mb-3"
            fill
          >
            <Tab eventKey="login" title="Iniciar Sesión">
              <div className="mt-4">
                <div className="text-center">
                  <p className="text-muted">Inicia sesión con:</p>
                  <div className="d-flex justify-content-center gap-3">
                    <Button
                      variant="outline-light"
                      onClick={() => handleSocialLogin("google")}
                      className="d-flex align-items-center gap-2"
                    >
                      <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google"
                        style={{width: "20px", height: "20px" }}
                      />
                    </Button>
                  </div>
                  <p className="text-muted mt-2">o con tu correo</p>
                </div>

                <Form onSubmit={handleLoginSubmit}>
                  <Form.Group className="mb-3" controlId="loginEmail">
                    <Form.Control
                      type="email"
                      placeholder="Correo electronico"
                      name="email"
                      value={loginForm.email}
                      onChange={handleLoginInputChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="loginPassword">   
                    <Form.Control
                      type="password"
                      placeholder="Contraseña"
                      name="password"
                      value={loginForm.password}
                      onChange={handleLoginInputChange}
                      required
                    />
                  </Form.Group>

                  <Row className="mb-3">
                    <Col>
                      <Form.Check
                        type="checkbox"
                        id="rememberMe"
                        label="Recordarme"
                        name="rememberMe"
                        checked={loginForm.rememberMe}
                        onChange={handleLoginInputChange}
                      />
                    </Col>
                    <Col className="text-end">
                      <Button variant="link" size="sm">
                        ¿Olvidaste tu contraseña?
                      </Button>
                    </Col>
                  </Row>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                  >
                    Iniciar Sesión
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <p>
                    ¿No tienes una cuenta?{" "}
                    <Button
                      variant="link"
                      onClick={() => setActiveTab("register")}
                    >
                      Regístrate
                    </Button>
                  </p>
                </div>
              </div>
            </Tab>

            <Tab eventKey="register" title="Registrarse">
              <div className="mt-4">
                <div className="text-center">
                  <p className="text-muted">Regístrate con:</p>
                  <div className="d-flex justify-content-center gap-3 mb-2">
                    <Button
                      variant="outline-light"
                      onClick={() => handleSocialLogin("google")}
                      className="d-flex align-items-center gap-2"
                    >
                      <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google"
                        style={{ width: "20px", height: "20px" }}
                      />
                    </Button>
                  </div>
                  <p className="text-muted">o con tu correo</p>
                </div>

                <Form onSubmit={handleRegisterSubmit}>
                  <Form.Group className="mb-3" controlId="registerName">
                    <Form.Control
                      type="text"
                      placeholder="Nombre completo"
                      name="name"
                      value={registerForm.name}
                      onChange={handleRegisterInputChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="registerUsername">
                    <Form.Control
                      type="text"
                      placeholder="Usuario"
                      name="username"
                      value={registerForm.username}
                      onChange={handleRegisterInputChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="registerEmail">
                    <Form.Control
                      type="email"
                      placeholder="Correo electronico"
                      name="email"
                      value={registerForm.email}
                      onChange={handleRegisterInputChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="registerPassword">
                    <Form.Control
                      type="password"
                      placeholder="Contraseña"
                      name="password"
                      value={registerForm.password}
                      onChange={handleRegisterInputChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="repeatPassword">
                    <Form.Control
                      type="password"
                      placeholder="Repetir contraseña"
                      name="repeatPassword"
                      value={registerForm.repeatPassword}
                      onChange={handleRegisterInputChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4 d-flex align-items-start" controlId="agreeToTerms">
                    <Form.Check
                      type="checkbox"
                      name="agreeToTerms"
                      checked={registerForm.agreeToTerms}
                      onChange={handleRegisterInputChange}
                      required
                    />
                    <Form.Label className="fw-light mx-3">Acepto los terminos y condiciones</Form.Label>
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100">
                    Registrarse
                  </Button>
                </Form>
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
    </div>
  );
};

export default Login;
