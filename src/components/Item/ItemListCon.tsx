import { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import ItemCard from './ItemCard'
import { useQuery, useInfiniteQuery } from 'react-query'
import { useAuth } from '../../hooks/useAuth'
import { fetchCartItems } from '../../config/api/cart/fetchCartItems'
import { QUERY_KEYS } from '../../config/constants/queryKeys'
import { fetchUserLikesInfo } from '../../config/api/user/fetchUserInfo'
import { useLocation } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  sortHighestDiscountRate,
  sortHighestPrice,
  sortItmeByFilterObj,
  sortLowestId,
  sortLowestPrice,
} from '../../utill/itemSort'
import { filterState } from '../../recoil/atoms/FilterState'
import { sortedItemsState } from '../../recoil/atoms/SortedItemsState'
import { CartItemType } from '../../types/CartItemType'
import { fetchItemsPerPage } from '../../config/api/items/fetchItems'
import { useInView } from 'react-intersection-observer'
import { shopSortState } from '../../recoil/atoms/SortState'
import ItmeCardSkeletonUI from './ItmeCardSkeletonUI'

export default function ItemListCon() {
  const { session } = useAuth()
  const location = useLocation()
  const sortValue = useRecoilValue(shopSortState)
  const queryParams = new URLSearchParams(location.search)
  const filterData = useRecoilValue(filterState)
  const [sortedItems, setSortedItems] = useRecoilState(sortedItemsState)
  const [isDataReady, setIsDataReady] = useState(false)
  const tabValue = Number(queryParams.get('tab'))
  const listWrapperRef = useRef(null)

  const [ref, inView] = useInView({
    threshold: 0.3,
    initialInView: true,
  })

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery(
      ['items', tabValue],
      ({ pageParam = 0 }) => fetchItemsPerPage(pageParam, 10, tabValue),
      {
        getNextPageParam: lastPage => lastPage.nextCursor || undefined,
        staleTime: 0,
        cacheTime: 0,
      }
    )

  const { data: userLikeData, isLoading: userInfoLoading } = useQuery(
    QUERY_KEYS.USERS,
    () => session && fetchUserLikesInfo(session.user.id),
    {
      enabled: !!session,
      staleTime: Infinity,
      cacheTime: 30 * 60 * 1000,
    }
  )

  const { data: cartData, isLoading: cartLoading } = useQuery(
    QUERY_KEYS.CART_ITEMS,
    () => session && fetchCartItems(session.user.id),
    {
      enabled: !!session,
      staleTime: Infinity,
      cacheTime: 30 * 60 * 1000,
    }
  )

  useEffect(() => {
    // 마운트될 때 페이지를 최상단으로 스크롤
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    setIsDataReady(false)
    setSortedItems([])
  }, [tabValue])

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView])

  useEffect(() => {
    if (data) {
      const fetchFilteredAndSortedItems = async () => {
        let filteredItems = await sortItmeByFilterObj(
          data.pages.flatMap(page => page.items),
          filterData
        )

        if (sortValue === '추천순') {
          filteredItems = sortLowestId(filteredItems)
        } else if (sortValue === '낮은가격순') {
          filteredItems = sortLowestPrice(filteredItems)
        } else if (sortValue === '높은가격순') {
          filteredItems = sortHighestPrice(filteredItems)
        } else if (sortValue === '할인률순') {
          filteredItems = sortHighestDiscountRate(filteredItems)
        }

        await setSortedItems(filteredItems)
        await setIsDataReady(true)
      }

      fetchFilteredAndSortedItems()
    }
  }, [sortValue, filterData, data, setSortedItems])

  const cartItems: CartItemType[] = cartData ? cartData.items : []

  const isInitialLoading = isLoading || cartLoading || userInfoLoading

  return (
    <>
      {isInitialLoading ? (
        <ListCon>
          <ListWrapper>
            {/* 로딩 중일 때 스켈레톤 UI를 10개 정도 보여줌 */}
            {Array.from({ length: 10 }).map((_, index) => (
              <ItmeCardSkeletonUI key={index} />
            ))}
          </ListWrapper>
        </ListCon>
      ) : (
        <ListCon>
          <ListWrapper ref={listWrapperRef}>
            {isDataReady &&
              (sortedItems.length !== 0 ? (
                sortedItems.map(
                  ({
                    id,
                    title,
                    imgurl,
                    originalprice,
                    badge,
                    discount,
                    deliveryperiod,
                  }) => {
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
                        userLikeData={userLikeData?.likes}
                        deliveryPeriod={deliveryperiod}
                      />
                    )
                  }
                )
              ) : (
                <Empty>해당하는 제품이 없습니다.</Empty>
              ))}
          </ListWrapper>
          {hasNextPage && sortedItems.length !== 0 && (
            <LoadingObserver ref={ref}></LoadingObserver>
          )}
        </ListCon>
      )}
    </>
  )
}

const ListCon = styled.div`
  width: 100%;
  padding-left: 55px;
  display: flex;
  flex-direction: column;
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

const LoadingObserver = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Empty = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;

  @media (max-width: 600px) {
    font-size: 1rem;
  }
`
