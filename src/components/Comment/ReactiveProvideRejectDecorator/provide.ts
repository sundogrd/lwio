import Vue from "vue";
import { InjectKey } from "vue/types/options";
import { createDecorator } from "vue-class-component";

import { addReactiveProvide, addWatcher } from "./utils";


export function ReactiveProvide<T, V extends Vue>(key?: InjectKey) {
	return createDecorator((componentOptions, property) => {
		const { reactiveComponent }
			= addReactiveProvide<T, V>(componentOptions, property, key);

		addWatcher<T, V>(
			componentOptions,
			property,
			value => reactiveComponent.value = value,
		);
	});
}
