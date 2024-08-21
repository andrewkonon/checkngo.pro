"use strict";

import AOS from "aos";
import HTTP from "./tools/fetch";

import "aos/dist/aos.css";
import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
	AOS.init({ duration: 1000, delay: 100 });

	init_burger_menu();
	init_scroll_buttons();
	init_send_proposal_button();
	init_terms_and_conditions();
});

function init_burger_menu() {
	document.querySelector("#burger-menu").addEventListener("click", () => {
		document.querySelector("#burger-menu")?.classList.toggle("opened");
		document.querySelector("#header")?.classList.toggle("active");
	});
}

function init_scroll_buttons() {
	const learn_more_button = document.querySelector("#learn_more_button");

	learn_more_button?.addEventListener("click", () => {
		scroll_to_element("qr_section");
	});
}

function init_send_proposal_button() {
	const send_proposal_button = document.getElementById("send_proposal_button");

	send_proposal_button?.addEventListener("click", () => {
		const inputs = {
			name: document.getElementById("proposal_name"),
			restaurant: document.getElementById("proposal_restaurant"),
			phone: document.getElementById("proposal_phone"),
			email: document.getElementById("proposal_email"),
			password: document.getElementById("proposal_password"),
		};

		const body = {
			name: inputs.name.value,
			restaurant: inputs.restaurant.value,
			phone: inputs.phone.value,
			email: inputs.email.value,
			password: inputs.password.value,
		};

		const url = HTTP.build_url("/enp/mail/proposals_for_cooperation", body);

		HTTP.send(url, { method: "GET" }, (response) => {
			if (response.success) {
				alert("Your request has been sent. Thank you for contacting us!");
				Object.values(inputs).forEach((input) => (input.value = ""));
			}
		});
	});
}

function init_terms_and_conditions(){
	const terms_and_conditions = document.getElementById('terms_and_conditions');

	if(!terms_and_conditions) return;

	terms_and_conditions.addEventListener('click', (e) => {
		e.preventDefault();

		document.querySelectorAll('section').forEach(section => {
			section.classList.toggle('hidden');
		})
		
		scroll_to_element('body');
	});
} 

export const scroll_to_element = (id, y_offset) => {
	y_offset ??= -102;
	const element = document.getElementById(id);

	if (!element) return;

	const y = element.getBoundingClientRect().top + window.pageYOffset + y_offset;

	window.scrollTo({ top: y, behavior: "smooth" });
};
