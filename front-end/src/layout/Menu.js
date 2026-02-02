import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Icons } from "../components/Icons";

/**
 * Lumière - Premium Navigation Menu
 * Modern glassmorphism navigation with animated links
 */
function Menu() {
	const location = useLocation();

	const navItems = [
		{ path: "/dashboard", label: "Dashboard", icon: Icons.Dashboard },
		{ path: "/reservations/new", label: "New Reservation", icon: Icons.Plus },
		{ path: "/tables/new", label: "New Table", icon: Icons.Table },
		{ path: "/search", label: "Search", icon: Icons.Search },
	];

	const isActive = (path) => {
		return location.pathname.startsWith(path);
	};

	return (
		<nav className="navbar">
			<div style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				width: '100%',
				maxWidth: '1400px',
				margin: '0 auto'
			}}>
				{/* Logo & Brand */}
				<Link to="/" className="navbar-brand" style={{ textDecoration: 'none' }}>
					<div style={{
						width: '48px',
						height: '48px',
						borderRadius: '12px',
						background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						boxShadow: '0 0 30px rgba(245, 158, 11, 0.3)'
					}}>
						<Icons.Utensils size={24} style={{ color: '#0c0a09' }} />
					</div>
					<div className="navbar-title">
						<span>Lumière</span>
					</div>
				</Link>

				{/* Navigation Links */}
				<ul className="nav-menu">
					{navItems.map((item) => (
						<li key={item.path}>
							<Link
								to={item.path}
								className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
							>
								<item.icon size={18} />
								<span>{item.label}</span>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
}

export default Menu;
