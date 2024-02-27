/* eslint-disable no-unused-vars */
import { useState } from 'react';
import SubsbribeModal from '../SubscibeModal/SubscribeModal.jsx';
import './Subscription.css';
import { IoRestaurantSharp } from 'react-icons/io5';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';
import BasicPlanImg from './BasicPlanImg.jsx';

import PremiumPlanImg from './PremiumPlanImg.jsx';
//Vista de imagen para comenzar la suscripcion al servicio
export default function Subscription() {
	const [loginOpen, setLoginOpen] = useState(false);
	const handleOpenLogin = () => {
		setLoginOpen(true);
	};
	const handleCloseLogin = () => {
		setLoginOpen(false);
	};
	const [subscribeOpen, setSubscribeOpen] = useState(false);
	const handleOpenSubscribe = () => {
		setSubscribeOpen(true);
	};
	const handleCloseSubscribe = () => {
		setSubscribeOpen(false);
	};
	
	const plans = [<BasicPlanImg key="1" />, <PremiumPlanImg key="3" />];
	const [index, setIndex] = useState(0);

	// Funcion para el slider de imagenes mobile
	const leftSlide = () => {
		const newIndex = index === 0 ? plans.length - 1 : index - 1;
		setIndex(newIndex);
	};

	const rightSlide = () => {
		const newIndex = index === plans.length - 1 ? 0 : index + 1;
		setIndex(newIndex);
	};
	return (
		<div className="subscription">
			<h2>
				Suscribete ahora y <span>potencia tu negocio</span> con nuestra
				innovadora plataforma gastronómica
			</h2>
			<div className="subscription-container-web">
				<BasicPlanImg handleOpenSubscribe={handleOpenSubscribe} />
				<PremiumPlanImg handleOpenSubscribe={handleOpenSubscribe} />
			</div>
			<div className="subscription-container-mobile">
				<div>
					<BsFillArrowLeftCircleFill
						className="left-arrow"
						onClick={leftSlide}
					/>
				</div>
				<div>{plans[index]}</div>
				<div>
					<BsFillArrowRightCircleFill
						className="right-arrow"
						onClick={rightSlide}
					/>
				</div>
			</div>
			<div className="slide-circles">
				<div className="slide-circle"></div>
				<div className="slide-circle"></div>
			</div>
			<article
				className={
					subscribeOpen === true
						? `modalSubs modalSubs-is-open`
						: `modalSubs modalSubs-is-close`
				}
			>
				<div className="modalSubs-container">
					<div className="modalSubs-container">
						<SubsbribeModal
							handleCloseSubscribe={handleCloseSubscribe}
							handleOpenLogin={handleOpenLogin}
						/>
					</div>
				</div>
			</article>
		</div>
	);
}
