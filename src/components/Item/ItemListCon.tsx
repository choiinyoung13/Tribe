import styled from 'styled-components'
import ItemCard from './ItemCard'
import { fetchItems } from '../../utill/fetchItems'
import { useQuery } from 'react-query'
import { useAuth } from '../../hooks/useAuth'
import { getCartItems } from '../../utill/cart/getCartItem'

interface CartItemType {
  itemId: number
  quantity: number
}

export default function ItemListCon() {
  const { session } = useAuth()
  const { data, error, isLoading } = useQuery(
    import.meta.env.VITE_TRIBE_ITEM_QUERY_KEY,
    fetchItems,
    {
      staleTime: Infinity,
      cacheTime: 30 * 60 * 1000,
    }
  )

  const { data: cartData } = useQuery(
    import.meta.env.VITE_CART_ITEM_QUERY_KEY,
    getCartItems,
    {
      enabled: !!session,
      staleTime: Infinity,
      cacheTime: 30 * 60 * 1000,
    }
  )

  if (isLoading) return <div>Loading...</div>

  if (error) return <div>Error...</div>

  const cartItems: CartItemType[] = cartData ? cartData.items : []

  if (data)
    return (
      <ListCon>
        <ListWrapper>
          {data.map(({ id, title, imgurl, originalprice, badge, discount }) => {
            const isInCart = cartItems.some(item => item.itemId === id)
            return (
              <ItemCard
                key={id}
                id={id}
                title={title}
                imgurl={imgurl}
                originalprice={originalprice}
                badge={badge}
                discount={discount}
                isInCart={isInCart}
              />
            )
          })}
        </ListWrapper>
      </ListCon>
    )
}

const ListCon = styled.div`
  width: 100%;
  padding-left: 55px;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    padding-left: 0px;
  }
`

const ListWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: flex-start;
`
