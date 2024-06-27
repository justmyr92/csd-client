import React, { useEffect, useState } from "react";
import loginCover from "../assets/login-cover.png";
import sdgLogo from "../assets/logo-1267x1283.png";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        username: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const { username, password } = inputs;

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (localStorage.getItem("ID")) {
            navigate("/csd/dashboard");
        }
    }, []);

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const body = { username, password };
            const response = await fetch(
                "https://csddashboard-api-3f6cd8c5458a.herokuapp.com/api/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                }
            );

            const parseRes = await response.json();

            console.log(parseRes);

            if (parseRes.message) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: parseRes.message,
                });
            } else {
                if (parseRes.unit_id) {
                    localStorage.setItem("ID", parseRes.unit_id);
                    localStorage.setItem("ROLE", "unit");
                    localStorage.setItem("NAME", parseRes.unit_name);
                } else if (parseRes.sdo_officer_id) {
                    localStorage.setItem("ID", parseRes.sdo_officer_id);
                    localStorage.setItem("ROLE", "sdo");
                    localStorage.setItem("NAME", parseRes.sdo_officer_name);
                } else if (parseRes.csd_officer_id) {
                    localStorage.setItem("ID", parseRes.csd_officer_id);
                    localStorage.setItem("ROLE", "csd");
                    localStorage.setItem("NAME", parseRes.csd_officer_name);
                }
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Login successful",
                    timer: 2000,
                });
                navigate("/csd/dashboard");
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <section className="login__section h-screen">
            <div className="flex h-full w-full">
                <div className="login__form__container w-[40%] flex flex-col justify-center items-center">
                    <div className="login__form__header mb-5 w-[400px] gap-2">
                        <h1 className="text-3xl">Sign In</h1>
                        <p className="text-xl text-gray-500">
                            Sustainable Development Office
                        </p>
                    </div>
                    <form
                        className="form flex flex-col w-[400px]"
                        onSubmit={onSubmitForm}
                    >
                        <div className="form__group mb-5 flex flex-col gap-1">
                            <label className="form__label" htmlFor="username">
                                Username
                            </label>
                            <input
                                className="form__input border-2 border-gray-500 p-3.5 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                type="text"
                                placeholder="Username"
                                name="username"
                                id="username"
                                required
                                autoComplete="off"
                                onChange={(e) => onChange(e)}
                            />
                        </div>
                        <div className="form__group mb-5 flex flex-col gap-1">
                            <label className="form__label" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    className="form__input border-2 border-gray-500 p-3.5 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    name="password"
                                    id="password"
                                    required
                                    autoComplete="off"
                                    onChange={(e) => onChange(e)}
                                />
                                <button
                                    className="absolute top-1/2 transform -translate-y-1/2 right-3 p-2 rounded-md"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    type="button"
                                >
                                    {showPassword ? (
                                        <FontAwesomeIcon icon={faEyeSlash} />
                                    ) : (
                                        <FontAwesomeIcon icon={faEye} />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between mb-5">
                            <div className="form__group mb-5 flex gap-1 items-center">
                                <input
                                    className="form__input w-5 h-5"
                                    type="checkbox"
                                    name="remember"
                                    id="remember"
                                />
                                <label
                                    className="form__label"
                                    htmlFor="remember"
                                >
                                    Remember Me
                                </label>
                            </div>
                            <a href="#" className="text-blue-600">
                                Forgot Password?
                            </a>
                        </div>
                        <button
                            className="form__button bg-blue-600 text-white py-3.5 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
                            type="submit"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
                <div className="login__image__container w-[60%]">
                    <img
                        className="login__image w-full h-full object-cover"
                        src={loginCover}
                    />
                </div>
            </div>
        </section>
    );
};

export default Login;
