import { Fade } from 'react-awesome-reveal';
import NavBar from './MainPage/NavBar/NavBar';
import FirstView from './MainPage/FirstView/FirstView';
import AboutUs from './MainPage/AboutUs/AboutUs';
import AppDetails from './MainPage/AppDetails/AppDetails';
import Testimonials from './MainPage/Testimonials/Testimonials';
import Subscription from './MainPage/Subscription/Subscription';
import Footer from './MainPage/Footer/Footer';

export default function MainPage() {
	return (
		<div className="App">
			<NavBar />
			<section>
				<FirstView />
			</section>
			<Fade direction="left" duration={3000}>
				<section id="nosotros">
					<AboutUs />
				</section>
			</Fade>
			<Fade cascade duration={3000}>
				<section>
					<AppDetails />
				</section>
			</Fade>
			<Fade cascade duration={3000}>
				<section id="testimonios">
					<Testimonials />
				</section>
			</Fade>
			<Fade cascade duration={3000}>
				<section id="suscripcion">
					<Subscription />
				</section>
			</Fade>
			<Fade cascade damping={5} duration={3000}>
				<section>
					<Footer />
				</section>
			</Fade>
		</div>
	);
}
