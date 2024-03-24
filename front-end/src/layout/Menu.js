import React from "react";
import { Link } from "react-router-dom";
import icon from "../assets/favicon.png";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
	return (
		<nav className="navbar-dark pt-2 pb-2">
			<div className="container-fluid d-flex justify-content-between">
				<Link
					className="navbar-brand sidebar-brand  d-flex m-0 align-items-center"
					to="/"
				>
					<img
						src={icon}
						alt="logo"
						className="img-thumbnail mr-2"
						style={{ width: "20p", height: "20px" }}
					/>
					<div className="sidebar-brand-text">
						<span>Periodic Tables</span>
					</div>
				</Link>
				<ul className="navbar-nav text-light d-flex flex-row">
					<li className="nav-item mr-4">
						<Link className="nav-link" to="/dashboard">
							<span className="oi oi-dashboard" />
							&nbsp;Dashboard
						</Link>
					</li>
					<li className="nav-item mr-4">
						<Link className="nav-link" to="/reservations/new">
							<span className="oi oi-plus" />
							&nbsp;New Reservation
						</Link>
					</li>
					<li className="nav-item mr-4">
						<Link className="nav-link" to="/tables/new">
							<span className="oi oi-layers" />
							&nbsp;New Table
						</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link" to="/search">
							<span className="oi oi-magnifying-glass" />
							&nbsp;Search
						</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
}

export default Menu;
