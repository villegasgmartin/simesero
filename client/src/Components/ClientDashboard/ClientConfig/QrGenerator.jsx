import { useState, useEffect } from 'react';
import QRcode from 'react-qr-code';
import './QrGenerator.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useLocation } from 'react-router-dom';


export default function QrGenerator() {
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const email = searchParams.get('email');
	const encodedEmail = btoa(email);
	const [totalCodes, setTotalCodes] = useState(0);
	const [firstCode, setFirstCode] = useState(0);
	const [generate, setGenerate] = useState(false);
	const [qrCodes, setQrCodes] = useState([]);

	useEffect(() => {
		setQrCodes(generateQRs());
	}, [totalCodes, firstCode]);

	const generateQRs = () => {
		const codes = [];
		for (
			let i = parseInt(firstCode, 10);
			i < parseInt(firstCode, 10) + parseInt(totalCodes, 10);
			i++
		) {
			codes.push(`http://localhost:5173/menulocal?email=${encodedEmail}&mesa=${i}`);
		}
		return codes;
	};

	const handleChangeFirstCode = (e) => {
		setFirstCode(e.target.value);
	};

	const handleChangeTotalCodes = (e) => {
		setTotalCodes(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setGenerate(true);
	};

	const handleDownloadPDF = () => {
		const qrCodeContainer = document.getElementById('qrCodeContainer');
		const qrCodesToPrint = qrCodeContainer.getElementsByClassName('qrCode');

		const pdf = new jsPDF('landscape', 'mm', 'a4');
		const qrCodeWidth = 70;
		const qrCodeHeight = 80;
		const columnSpacing = 30;
		const rowSpacing = 30;

		let codesPrinted = 0;

		for (let i = 0; i < qrCodesToPrint.length; i++) {
			const qrCode = qrCodesToPrint[i];

			html2canvas(qrCode).then((canvas) => {
				const imgData = canvas.toDataURL('image/png');

				if (codesPrinted % 8 === 0) {
					if (codesPrinted !== 0) {
						pdf.addPage(); // Agrega una nueva página cada 8 códigos (4x2)
					}
				}

				const columnIndex = codesPrinted % 4;
				const rowIndex = Math.floor((codesPrinted % 8) / 4);

				const xPosition = columnIndex * (qrCodeWidth + columnSpacing);
				const yPosition = rowIndex * (qrCodeHeight + rowSpacing);

				pdf.addImage(
					imgData,
					'PNG',
					xPosition,
					yPosition,
					qrCodeWidth,
					qrCodeHeight
				);

				codesPrinted++;

				if (i === qrCodesToPrint.length - 1) {
					pdf.save('codigos_qr.pdf');
				}
			});
		}
	};

	return (
		<div>
			<button className="generate-qr-btn">
				<a href={`/dashboard?email=${email}`}>Volver al salón</a>
			</button>
			<div className="qr-amount-container">
				<form action="" onSubmit={handleSubmit} className="qr-amount-form">
					<h3 className='titleqr'>Generador de QR</h3>
					<div>
						<input
							type="number"
							placeholder="Cantidad de codigos a imprimir"
							onChange={handleChangeTotalCodes}
							
						/>
						<input
							type="number"
							placeholder="Numero de inicio"
							onChange={handleChangeFirstCode}
							
						/>
					</div>
					<button className="generate-qr-btn">Generar códigos</button>
					{generate && (
						<button onClick={handleDownloadPDF} className="generate-qr-btn">
							Descargar PDF
						</button>
					)}
				</form>
			</div>
			<div>
				{generate && (
					<div className="qr-code-container" id="qrCodeContainer">
						{qrCodes.map((url, index) => (
							<div key={url} className="qrCode">
								<div>
									<p>Mesa: {Number(firstCode) + index}</p>
									<QRcode value={url} className="qr" />
								</div>
								{index % 2 !== 0 && <div className="clear-float"></div>}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
