import React from "react";
import { Link } from "react-router-dom";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
	return (
		<nav className="navbar-dark navbar-left pt-2 pb-2">
			<div className="container-fluid d-flex p-0">
				<Link className="navbar-brand d-flex  sidebar-brand m-0" to="/">
					<div className="sidebar-brand-text">
						<span>Periodic Tables</span>
					</div>
				</Link>
				<hr className="sidebar-divider my-0" />
				<ul
					className="navbar-nav text-light d-flex flex-row"
					id="accordionSidebar"
				>
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
				<div className="text-center d-none d-md-inline">
					<button
						className="btn rounded-circle border-0"
						id="sidebarToggle"
						type="button"
					/>
				</div>
			</div>
		</nav>
	);
}

export default Menu;
