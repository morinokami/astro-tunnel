export function closeOnOutsideClick(eventTarget: EventTarget) {
	function onPageClick(event: MouseEvent) {
		const target = event.target as Element | null;
		if (!target) return;
		if (!target.closest) return;
		if (target.closest("astro-dev-toolbar")) return;
		eventTarget.dispatchEvent(
			new CustomEvent("toggle-app", {
				detail: {
					state: false,
				},
			}),
		);
	}
	// biome-ignore lint/suspicious/noExplicitAny: explanation
	eventTarget.addEventListener("app-toggled", (event: any) => {
		if (event.detail.state === true) {
			document.addEventListener("click", onPageClick, true);
		} else {
			document.removeEventListener("click", onPageClick, true);
		}
	});
}
