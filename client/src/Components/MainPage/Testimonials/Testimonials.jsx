/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import './Testimonials.css';
import img from '../../../assets/img8.webp';

export default function Testimonials() {
	const testimonials = [
		{
			text: '"Teníamos nuestras dudas, pero desde que implementamos SiMesero pudimos agilizar los pedidos para los comensales ansiosos, pero nos encanta por la agilidad que proporcionó al salón con clientes contentos, recomendamos la plataforma"',
			author: 'Omer Salgado'
		},
		{
			text: '"Nos piden mucho poder pagar por separado de una misma mesa, nos suscribimos a la plataforma SiMesero y nos dio una gran ayuda para ordenar este desorden, si recomendamos SiMesero"',
			author: 'Claribel Stochi'
		},
		{
			text: '"Tenemos un salón con 37 mesas y muchas veces no dábamos abasto, implementamos SiMesero y nos ayudó bastante a gestionar mesas en horas pico, si recomendamos SiMesero"',
			author: 'Marcelo Zorte'
		}
	];

	const [currentTestimonial, setCurrentTestimonial] = useState(0);

	const handleCircleClick = (index) => {
		setCurrentTestimonial(index);
	};

	return (
		<div className="testimonials">
			<h2>Testimonios</h2>
			<div className="test-container">
				<div className="test-testimonial">
					<p>{testimonials[currentTestimonial].text}</p>
					<h4>{testimonials[currentTestimonial].author}</h4>
					<div className="test-circles">
						{testimonials.map((_, index) => (
							<div
								key={index}
								className={`test-circle ${
									index === currentTestimonial ? 'active' : ''
								}`}
								onClick={() => handleCircleClick(index)}
							></div>
						))}
					</div>
				</div>
				<div className="test-img-container">
					<img src={img} alt="" className="text-img" />
				</div>
			</div>
		</div>
	);
}
