import { useContext } from "react";
import { MobXProviderContext } from 'mobx-react';
import { IStore } from "../stores/store";

function useMst(): IStore {
    const store = useContext<{store: IStore}>(MobXProviderContext as any);
  
    return store.store;
}

export default useMst