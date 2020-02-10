import * as React from 'react'

import { User } from '../interfaces'
import { observer } from 'mobx-react'
import useMst from '../hooks/useMst'

type ListDetailProps = {
  item: User
}

const ListDetail: React.FunctionComponent<ListDetailProps> = observer(({
  item: user,
}) => {
  const store = useMst();
  const handleClick = () => {
    console.log(store)
    store.update()
  }
  return (<div>
    <h1>Detail for {user.name}</h1>
    <p>ID: {user.id}</p>
    <p>{store.light ? "light" : "dark"}</p>
    <p>{store.foo}</p>
    <button onClick={handleClick}>toggle</button>
  </div>)
}
)

export default ListDetail
