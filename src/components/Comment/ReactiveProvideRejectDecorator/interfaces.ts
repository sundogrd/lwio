import Vue from "vue";
import { InjectKey } from "vue/types/options";

export const REACTIVE_INJECTS_MANAGER = "_reactiveInjects";

export interface ReactiveInjectOptions<T> {
	default?: T | (() => T);
	from?: InjectKey;
}

export class ReactiveComponentVue<T> extends Vue {
	value!: T;
}

export class ReactiveInjectVue<T> extends Vue {
	[REACTIVE_INJECTS_MANAGER]: {
		[property: string]: {
			injectOptions: ReactiveInjectOptions<T>;
			reactiveComponent: ReactiveComponentVue<T>;
		};
	};

	[key: string]: any;
}
