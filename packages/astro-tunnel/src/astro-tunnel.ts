import type { DevToolbarApp } from "astro";
import { closeOnOutsideClick } from "./utils";

const appName = "Astro Tunnel";
const appDescription = "Expose your local Astro server to the internet";
const notReadyMessage = "Tunnel not ready";
const readyMessage = "Tunnel ready at ";

export default {
	id: "astro-tunnel",
	name: appName,
	icon: '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#6366F1"/><stop offset="50%" style="stop-color:#8B5CF6"/><stop offset="100%" style="stop-color:#EC4899"/></linearGradient></defs><path d="M0.877075 7.49991C0.877075 3.84222 3.84222 0.877075 7.49991 0.877075C11.1576 0.877075 14.1227 3.84222 14.1227 7.49991C14.1227 11.1576 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1576 0.877075 7.49991ZM7.49991 1.82708C4.36689 1.82708 1.82708 4.36689 1.82708 7.49991C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49991C13.1727 4.36689 10.6329 1.82708 7.49991 1.82708Z" fill="url(#gradient)"></path></svg>',
	init(canvas, eventTarget) {
		const windowElement = document.createElement("astro-dev-toolbar-window");

		const style = document.createElement("style");
		style.textContent = `
      h1 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        color: rgb(255, 255, 255);
        margin: 0px;
        font-size: 22px;
      }

      h3 {
        font-size: 16px;
        font-weight: 400;
        color: white;
        margin: 0px 0px 4px;
      }

      label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        line-height: 1.5rem;
      }

      p {
        margin: 0px;
      }

      a, a:visited {
        color: rgb(9, 105, 218);
      }
    `;
		windowElement.appendChild(style);

		const header = document.createElement("header");
		const title = document.createElement("h1");
		title.textContent = appName;
		header.appendChild(title);
		windowElement.appendChild(header);

		const hr = document.createElement("hr");
		windowElement.appendChild(hr);

		const field = document.createElement("label");
		const section = document.createElement("section");
		const fieldTitle = document.createElement("h3");
		fieldTitle.textContent = appDescription;
		const fieldDescription = document.createElement("p");
		fieldDescription.textContent = notReadyMessage;
		section.appendChild(fieldTitle);
		section.appendChild(fieldDescription);
		const toggle = document.createElement("astro-dev-toolbar-toggle");
		toggle.input.addEventListener("change", (e) => {
			import.meta.hot?.send("astro-tunnel:toggled", {
				// Send the state of the toggle to the server
				// @ts-ignore
				checked: e.currentTarget?.checked,
			});
		});
		import.meta.hot?.on("astro-tunnel:tunnel-url", (data) => {
			// Got the tunnel URL from the server
			if (data.url) {
				toggle.input.checked = true;
				fieldDescription.textContent = readyMessage;
				const a = document.createElement("a");
				a.href = data.url;
				a.textContent = data.url;
				a.target = "_blank";
				a.rel = "noopener noreferrer";
				fieldDescription.appendChild(a);
				eventTarget.dispatchEvent(
					new CustomEvent("toggle-notification", {
						detail: {
							state: true,
						},
					}),
				);
			} else {
				toggle.input.checked = false;
				fieldDescription.textContent = notReadyMessage;
				eventTarget.dispatchEvent(
					new CustomEvent("toggle-notification", {
						detail: {
							state: false,
						},
					}),
				);
			}
		});
		field.appendChild(section);
		field.appendChild(toggle);
		windowElement.appendChild(field);

		canvas.appendChild(windowElement);

		closeOnOutsideClick(eventTarget);
	},
} satisfies DevToolbarApp;
