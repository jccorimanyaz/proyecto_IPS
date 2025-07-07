import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { login, loadUser } from "../../features/auth/authApi";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap();
      await dispatch(loadUser()).unwrap();
      toast.success("Inicio de sesión exitoso");
    } catch (err) {
      console.error("Error al iniciar sesión", err);
      toast.error(
        "Error al iniciar sesión. Por favor, verifica tus credenciales."
      );
    }
  };

  return (
    <Container
      fluid
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "#f5f7fa",
      }}
    >
      <Card className="shadow" style={{ maxWidth: "500px", width: "100%" }}>
        <Card.Body>
          <div className="mt-4">
            <div className="text-center">
              <h3 className="mb-3 fw-semibold">Inicia Sesión</h3><hr/>
              <p className="text-muted">Usa tu cuenta o Google</p>
              <div className="d-flex justify-content-center gap-3 mb-3">
                <Button
                  variant="outline-light"
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

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="loginEmail">
                <Form.Control
                  type="email"
                  placeholder="Correo electrónico"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="loginPassword">
                <Form.Control
                  type="password"
                  placeholder="Contraseña"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Row className="mb-3">
                <Col>
                  <Form.Check
                    type="checkbox"
                    id="rememberMe"
                    label="Recordarme"
                    name="rememberMe"
                  />
                </Col>
                <Col className="text-end">
                  <Button variant="link" size="sm">
                    ¿Olvidaste tu contraseña?
                  </Button>
                </Col>
              </Row>

              <Button
                type="submit"
                className="w-100 mb-3 border-0"
                disabled={loading}
                style={{
                    background: "#0e2238",
                }}
              >
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center">
                    <Oval
                      color="#0e2238"
                      width={20}
                      height={20}
                      secondaryColor="#ccc"
                      ariaLabel="loading"
                    />
                  </div>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </Form>

            <div className="text-center mt-3 text-secondary">
              <p>
                ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;