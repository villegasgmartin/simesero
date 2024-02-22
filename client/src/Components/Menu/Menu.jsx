import './Menu.css';

import { IoRestaurantSharp } from 'react-icons/io5';
import { GiHotMeal } from 'react-icons/gi';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { PiCallBell } from 'react-icons/pi';
import { TbReportMoney } from 'react-icons/tb';
import { MdFoodBank } from 'react-icons/md';


import Products from './Products/Products';
import Cart from './Cart/Cart';
import Call from './Call/Call';
import Chat from './Chat/Chat';
import Pay from './Pay/Pay';

import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function Menu() {
	const [selectedSection, setSelectedSection] = useState('products');
	const micart = useSelector((state) => state.productsAdeedToMinicart);
	const qProducts = micart?.length;

	const handleSectionClick = (sectionId) => {
		setSelectedSection(sectionId);
	};

	return (
		<main className="menu-container">
			<header className="menu-header-container">
				<div className="menu-header">
					<div>
						<IoRestaurantSharp className="menu-dec-logo" />
					</div>
					
					
				</div>
			</header>{' '}
			<main>
				<section
					id="products"
					className={selectedSection === 'products' ? '' : 'hidden-section'}
				>
					<Products />
				</section>
				<section
					id="cart"
					className={selectedSection === 'cart' ? '' : 'hidden-section'}
				>
					<Cart />
				</section>
				<section
					id="chat"
					className={selectedSection === 'chat' ? '' : 'hidden-section'}
				>
					<Chat />
				</section>
				<section
					id="call"
					className={selectedSection === 'call' ? '' : 'hidden-section'}
				>
					<Call />
				</section>
				<section
					id="pay"
					className={selectedSection === 'pay' ? '' : 'hidden-section'}
				>
					<Pay />
				</section>
			</main>
			<footer>
				<div className="footer-container">
					<a
						href="#products"
						onClick={() => handleSectionClick('products')}
						className={selectedSection === 'products' ? 'selected' : ''}
					>
						<MdFoodBank className="footer-icon" />
					</a>
					<a
						href="#cart"
						onClick={() => handleSectionClick('cart')}
						className={selectedSection === 'cart' ? 'selected' : ''}
					>
						<GiHotMeal className="footer-icon" />
						{qProducts === 0 ? (
							<></>
						) : (
							<h4 className="q-products-nav">{qProducts}</h4>
						)}
					</a>
					<a
						href="#chat"
						onClick={() => handleSectionClick('chat')}
						className={selectedSection === 'chat' ? 'selected' : ''}
					>
						<BsFillChatDotsFill className="footer-icon" />
					</a>
					<a
						href="#profile"
						onClick={() => handleSectionClick('call')}
						className={selectedSection === 'call' ? 'selected' : ''}
					>
						<PiCallBell className="footer-icon" />
					</a>
					<a
						href="#pay"
						onClick={() => handleSectionClick('pay')}
						className={selectedSection === 'pay' ? 'selected' : ''}
					>
						<TbReportMoney className="footer-icon" />
					</a>
				</div>
			</footer>
		</main>
	);
}