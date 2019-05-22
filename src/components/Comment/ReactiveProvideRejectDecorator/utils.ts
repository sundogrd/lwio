import Vue, { WatchHandler } from "vue";
import { ComponentOptions, InjectKey, WatchOptions } from "vue/types/options";

import { ReactiveComponentVue, ReactiveInjectOptions } from "./interfaces";

export function addReactiveProvide<T, V extends Vue>(
	componentOptions: ComponentOptions<V>,
	property: string,
	key?: InjectKey,
) {
	let provide = componentOptions.provide as any;

	if (typeof provide !== "function" || !provide.reactive) {
		const original = componentOptions.provide;

		provide = componentOptions.provide = function(this: V) {
			const ret = Object.create((typeof original === "function" ? original.call(this) : original) || null);

			for (const i in provide.reactive) {
				if (!provide.reactive.hasOwnProperty(i)) continue;
				const reactiveComponent = provide.reactive[i].reactiveComponent;

				if ((this as any)[i]) reactiveComponent.value = (this as any)[i];
				else addData(componentOptions, property, reactiveComponent.value);
				ret[provide.reactive[i].key] = reactiveComponent;
			}

			return ret;
		};

		provide.reactive = {};
	}

	provide.reactive[property] = {
		key: key || property,
		reactiveComponent: new ReactiveComponentVue<T>({
			data: () => ({ internalValue: null }),
			computed: {
				value: {
					get(this: V) { return (this as any).internalValue; },
					set(this: V, value: T) { (this as any).internalValue = value; },
				},
			},
		}),
	};

	return provide.reactive[property] as {
		key: string;
		reactiveComponent: ReactiveComponentVue<T>;
	};
}

export function addReactiveInject<T, V extends Vue>(
	componentOptions: ComponentOptions<V>,
	property: string,
	injectOptions?: InjectKey | ReactiveInjectOptions<T>,
) {
	const originalInjects = componentOptions.inject;
	const injects
		= originalInjects && !(originalInjects instanceof Array)
		? {...originalInjects}
		: {};

	if (originalInjects instanceof Array) {
		originalInjects.forEach(inject => injects[inject] = inject);
	}

	injects[property] = injectOptions || property;
	componentOptions.inject = injects;
}

export function addComputed<T, V extends Vue>(
	componentOptions: ComponentOptions<V>,
	property: string,
	handler: { get(this: V): T | undefined; set?(this: V, value: T): void },
) {
	if (!componentOptions.computed) {
		componentOptions.computed = {};
	}

	componentOptions.computed[property] = handler;
}

export function addData<T, V extends Vue>(
	componentOptions: ComponentOptions<V>,
	dataHandlerOrProperty: ((this: V) => object) | string,
	value?: T,
) {
	let originalData = componentOptions.data;

	componentOptions.data = function(this: V) {
		if (typeof originalData === "function") originalData = originalData.call(this);

		const data
			= (typeof dataHandlerOrProperty === "function")
			? dataHandlerOrProperty.call(this)
			: { [dataHandlerOrProperty]: value || null };

		return {
			...(originalData),
			...(data),
		};
	};
}

export function addLifecycleHook<V extends Vue>(
	componentOptions: ComponentOptions<V>,
	hook: string, hookHandler: (this: V) => void,
) {
	const originalHookHandler = (componentOptions as any)[hook];

	(componentOptions as any)[hook] = function(this: V) {
		if (originalHookHandler) originalHookHandler.call(this);
		hookHandler.call(this);
	};
}

export function addWatcher<T, V extends Vue>(
	componentOptions: ComponentOptions<V>,
	property: string,
	handler: WatchHandler<T>,
	{ deep = false, immediate = false }: WatchOptions = {},
) {
	if (!componentOptions.watch) {
		componentOptions.watch = {};
	}

	componentOptions.watch[property] = {
		deep,
		immediate,
		handler,
	};
}
