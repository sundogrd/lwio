import { InjectKey } from "vue/types/options";
import { createDecorator } from "vue-class-component";

import { REACTIVE_INJECTS_MANAGER, ReactiveInjectOptions, ReactiveInjectVue } from "./interfaces";
import { addComputed, addLifecycleHook, addReactiveInject } from "./utils";


export function ReactiveInject<T, V extends ReactiveInjectVue<T>>(
	injectOptions?: InjectKey | ReactiveInjectOptions<T>,
) {
	return createDecorator((componentOptions, property) => {
		const internalProperty = `__ri-${property}`;

		if (typeof injectOptions === "object" && !injectOptions.from) {
			injectOptions = { ...injectOptions, from: property };
		}

		if (typeof injectOptions === "string" || typeof injectOptions === "symbol") {
			injectOptions = { from: injectOptions };
		}

		if (!injectOptions) {
			injectOptions = { from: property };
		}

		// Register inject on property.
		addReactiveInject<T, V>(componentOptions, internalProperty, injectOptions);

		addComputed<T, V>(componentOptions, property, {
			get(this) {
				const injects = this[REACTIVE_INJECTS_MANAGER];
				const def = (injectOptions as any).default;


				const reactive = injects && injects[property] && injects[property].reactiveComponent
					|| this[internalProperty];

				return reactive && reactive.value !== undefined && reactive.value
					|| def && (typeof def === "function" ? def.call(this) : def)
					|| undefined;
			},
		});

		addLifecycleHook<V>(componentOptions, "created", function(this: V) {
			const optionsInject: any = this.$options.inject;

			if (!this[REACTIVE_INJECTS_MANAGER]) {
				this[REACTIVE_INJECTS_MANAGER] = {};
			}

			// Move internal property name and inject options to manager.
			this[REACTIVE_INJECTS_MANAGER][property] = {
				injectOptions: optionsInject[internalProperty],
				reactiveComponent: this[internalProperty],
			};

			delete this[internalProperty];
		});
	});
}
