import './ClientsTableHome.css';
import { BsCheckCircle } from 'react-icons/bs';
import { BsXCircle } from 'react-icons/bs';
import { VscMail } from 'react-icons/vsc';
import vector from '../../../assets/vector-tabla.png';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getAllClients, validateAdmin } from '../../../redux/actions';

export default function ClientsTableHome() {
	const dispatch = useDispatch();
	const allUsers = useSelector((state) => state.allUsers);

	const validation = useSelector((state) => state.validation.msg);
	const emailAddresses = allUsers.map((user) => user.email).join(';');
	const [pageLoaded, setPageLoaded] = useState(false);
	useEffect(() => {
		dispatch(validateAdmin());
		dispatch(getAllClients());
		Promise.all([dispatch(getAllClients()), dispatch(validateAdmin())]).then(
			() => {
				setPageLoaded(true);
			}
		);
	}, []);

	return (
		<main className="admin-clients-table">
			{pageLoaded ? (
				validation !== 'admin' ? (
					<h1>Usted no tiene acceso</h1>
				) : (
					<div>
						<div className="admin-clients-table-clients">
							<div>
								<h1>{allUsers?.length}</h1>
								<h2>Total Clientes</h2>
							</div>
							<div>
								<img src={vector} alt="" className="table-vector" />
							</div>
						</div>
						<p className="percent-text">
							<span>+12% </span>que el mes pasado
						</p>

						<div className="clients-table-container">
							<div className="table-top">
								<h3>Ultimos clientes</h3>
								<a href="/admin/clientes">Ver todos</a>
								<a
									href={`mailto:${emailAddresses}`}
									target="_blank"
									rel="noreferrer"
								>
									{' '}
									Enviar mensaje a todos
								</a>
							</div>
							<div>
								<table className="clients-table">
									<thead className="clients-table-head">
										<tr>
											<th>Nombre</th>
											<th className="date">Fecha de alta</th>
											<th>Plan</th>
											<th>Estado</th>
											<th>Mensaje</th>
										</tr>
									</thead>
									<tbody className="clients-table-body">
										{allUsers?.map((c) => {
											return (
												<tr key={c.id}>
													<td>{c.storeName}</td>
													<td className="date">{c.date}</td>
													<td>{c.plan}</td>
													{c.status === 1 ? (
														<td>
															<BsCheckCircle className="check-icon" />
														</td>
													) : (
														<td>
															<BsXCircle className="X-icon" />
														</td>
													)}
													<td>
														<a
															href={`mailto:${c.email}`}
															target="_blank"
															rel="noreferrer"
														>
															<VscMail className="mail-icon" />
														</a>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>
						<div className="state-reference">
							<div>
								<BsCheckCircle className="check-icon" />
								<p>Activo</p>
							</div>
							<div>
								<BsXCircle className="X-icon" />
								<p>Suspendido</p>
							</div>
						</div>
					</div>
				)
			) : (
				<p>Cargando...</p>
			)}
		</main>
	);
}