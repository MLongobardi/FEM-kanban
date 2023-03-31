export default function debounce(func, timeout = 300) {
	let timer = false;
	return {
		deb: (...args) => {
			//console.log("debounced");
            clearTimeout(timer);
			timer = setTimeout(() => {
                func.apply(this, args);
                timer = false;
			}, timeout);
		},
		cancel: () => {
			//console.log("canceled");
            clearTimeout(timer);
            timer = false;
		},
		immediate: (...args) => {
			//console.log("immediate");
			func.apply(this, args);
		},
		skip: (...args) => {
			if (timer) {
				//console.log("skipped");
                clearTimeout(timer);
                timer = false;
				func.apply(this, args);
			}
		},
	};
}
