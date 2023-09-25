import { useState } from 'react';

import {
	MDBSpinner,
	MDBContainer,
	MDBRow,
	MDBCol,
	MDBCard,
	MDBCardHeader,
	MDBCardBody,
	MDBBtn,
	MDBCardFooter,
	MDBInputGroup,
} from "mdb-react-ui-kit";




import { CHAT_API_URL } from "./utils/constants";

export default function App() {

	const [userQuery, setUserQuery] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [userQueriesAndAnswers, setUserQueriesAndAnswers] = useState<{ message: string; isUser: boolean }[]>([
		{
			message: `Hello, How can I help you today?`,
			isUser: false
		}
	]);

	const onSendButtonClicked = () => {
		let newUserQueriesAndAnswers = userQueriesAndAnswers;
		newUserQueriesAndAnswers.push({
			message: userQuery,
			isUser: true
		})
		setUserQueriesAndAnswers(newUserQueriesAndAnswers)
		fetchUserQueryAnswerData();
	}

	const handleKeyDown = (event: any) => {
		if (event.key === 'Enter') {
			setIsLoading(true);
			onSendButtonClicked();
		}
	}


	const fetchUserQueryAnswerData = async () => {
		if (!userQuery || !userQuery.trim().length) {
			return;
		}
		const apiResponse = await fetch(CHAT_API_URL, {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				query: userQuery
			})
		});
		const json = await apiResponse.json();
		const { data } = json;
		setUserQuery("");
		let newQueryReply = [];
		if (data && data.length) {
			newQueryReply = data.map((reply: string) => {
				return {
					message: reply,
					isUser: false
				}
			})
			setUserQueriesAndAnswers([...userQueriesAndAnswers, ...newQueryReply]);
		}
		setIsLoading(false);
	}

	return (
		<MDBContainer fluid className="py-5">
			<MDBRow className="d-flex justify-content-center">
				<MDBCol md="8" lg="6" xl="4">
					<MDBCard>
						<MDBCardHeader
							className="d-flex justify-content-between align-items-center p-3"
							style={{ borderTop: "4px solid #ffa900" }}
						>
							<h5 className="mb-0">Navigator Chatbot</h5>
							<div className="d-flex flex-row align-items-center">

							</div>
						</MDBCardHeader>

						<MDBCardBody>
							{
								userQueriesAndAnswers && userQueriesAndAnswers.length > 0 ?

									userQueriesAndAnswers.map((queryAndAnswer, index) => {
										return (
											<div key={`index_${index}`}>
												{
													queryAndAnswer.isUser ?
														<div className="d-flex flex-row justify-content-end">
															<img
																src="https://t4.ftcdn.net/jpg/01/97/15/87/360_F_197158744_1NBB1dEAHV2j9xETSUClYqZo7SEadToU.jpg"
																alt="avatar 1"
																style={{ width: "45px", height: "100%" }}
															/>
															<div>
																<p
																	className="small p-2 ms-3 mb-3 rounded-3"
																	style={{ backgroundColor: "#f5f6f7" }}
																>
																	{
																		queryAndAnswer.message
																	}
																</p>
															</div>
														</div> :
														<div className="d-flex flex-row justify-content-start mb-4 pt-1">
															<div>
																<p className="small p-2 me-3 mb-3 text-white rounded-3 bg-warning">
																	{
																		queryAndAnswer.message
																	}
																</p>

															</div>
															<img
																src="https://media.istockphoto.com/id/1010001882/vector/%C3%B0%C3%B0%C2%B5%C3%B1%C3%B0%C3%B1%C3%B1.jpg?s=612x612&w=0&k=20&c=1jeAr9KSx3sG7SKxUPR_j8WPSZq_NIKL0P-MA4F1xRw="
																alt="avatar 1"
																style={{ width: "45px", height: "100%" }}
															/>
														</div>
												}

											</div>
										)
									})

									: null
							}
						</MDBCardBody>
						<MDBCardFooter className="text-muted d-flex justify-content-start align-items-center p-3">
							<MDBInputGroup className="mb-0">
								<input
									className="form-control"
									placeholder="Type message"
									type="text"
									onChange={(event) => {
										setUserQuery(event.target.value);
									}} value={userQuery}
									onKeyDown={handleKeyDown}
								/>
								{!isLoading ? (
									<MDBBtn color="warning" style={{ paddingTop: ".55rem" }} onClick={onSendButtonClicked}>
										Send
									</MDBBtn>
								) : (
									null
								)}
							</MDBInputGroup>
							{isLoading ? (
								<MDBSpinner role='status'>
									<span className='visually-hidden'>Loading...</span>
								</MDBSpinner>
							) : (
								null
							)}
						</MDBCardFooter>
					</MDBCard>
				</MDBCol>
			</MDBRow>
		</MDBContainer>

	);
}