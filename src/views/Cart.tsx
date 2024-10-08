import styled from 'styled-components'
import CartItem from '../components/Cart/CartItem'
import Button from '../components/Common/Button'
import TotalPriceSection from '../components/Cart/TotalPriceSection'
import useWindowWidth from '../hooks/useWindowWidth'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { priceCalculation } from '../utill/priceCalculation'
import EmptyCart from '../components/Cart/EmptyCart'
import { useAuth } from '../hooks/useAuth'
import { useCartMutations } from '../mutations/useCartMutations'
import { UseQueryResult, useQuery } from 'react-query'
import { fetchCartItems } from '../config/api/cart/fetchCartItems'
import { QUERY_KEYS } from '../config/constants/queryKeys'
import loadingIcon from '../assets/images/logo/ball-triangle.svg'
import { countCheckItemAmount } from '../utill/countCheckItemAmount'
import { CartItemType } from '../types/CartItemType'
import Swal from 'sweetalert2'
import UnauthorizedAccess from '../components/Common/UnauthorizedAccess'
import { addPurchaseHistory } from '../config/api/cart/addPurchaseHistory'

interface CartItemsResponse {
  items: CartItemType[]
}

export default function Cart() {
  const windowWidth = useWindowWidth()
  const navigate = useNavigate()
  const [totalPrice, setTotalPrice] = useState(0)
  const { session, isLoading: isAuthLoading } = useAuth()
  const [allItemChecked, setAllItemChecked] = useState(false)
  const [isAllItemReceivingDateSelected, setIsAllItemReceivingDateSelected] =
    useState(false)

  const { deleteCartItemMutation, toggleAllCartItemStatusMutation } =
    useCartMutations()

  const { data: cartData, isLoading }: UseQueryResult<CartItemsResponse> =
    useQuery(
      QUERY_KEYS.CART_ITEMS,
      () => {
        if (session) {
          return fetchCartItems(session.user.id)
        }
      },
      {
        enabled: !!session,
        staleTime: Infinity,
        cacheTime: 30 * 60 * 1000,
      }
    )

  useEffect(() => {
    if (cartData && cartData.items.length > 0 && session) {
      // 모든 체크된 아이템이 선택되었는지 확인
      const isAllItemSelected = cartData.items.every(item => item.checked)
      setAllItemChecked(isAllItemSelected)

      // 체크된 아이템들만 수령일이 선택되었는지 확인
      const isAllCheckedItemReceivingDateSelected = cartData.items
        .filter(item => item.checked) // checked가 true인 아이템만 필터링
        .every((item: CartItemType) => item.receivingDate !== 0)

      setIsAllItemReceivingDateSelected(isAllCheckedItemReceivingDateSelected)

      // 체크된 항목들에 대한 총 가격 계산
      const total = cartData.items
        .filter(item => item.checked)
        .reduce(
          (sum, item) =>
            sum +
            priceCalculation(item.originalPrice, item.discount) * item.quantity,
          0
        )
      setTotalPrice(total)
    }
  }, [cartData, session, setTotalPrice])

  if (isAuthLoading || isLoading) {
    return (
      <LoadingPage>
        <LoadingIcon>
          <img src={loadingIcon} alt="" />
        </LoadingIcon>
      </LoadingPage>
    )
  }

  if (!session) {
    return <UnauthorizedAccess />
  }

  return (
    cartData && (
      <CartCon>
        <CartWrapper>
          <Title>장바구니</Title>
          {windowWidth <= 1024 && (
            <CheckHeader>
              <CheckHeaderLeft>
                <div>
                  <input
                    type="checkbox"
                    checked={allItemChecked}
                    onChange={() => {
                      const cartId = session!.user.id

                      setAllItemChecked(prev => {
                        const newValue = !prev
                        toggleAllCartItemStatusMutation.mutate({
                          cartId,
                          allItemChecked: newValue,
                        })
                        return newValue
                      })
                    }}
                  />
                </div>
                <div>
                  전체선택 ({countCheckItemAmount(cartData.items)}
                  {cartData.items.length})
                </div>
              </CheckHeaderLeft>
              <CheckHeaderRight
                onClick={() => {
                  if (session) deleteCartItemMutation.mutate(session.user.id)
                }}
              >
                선택삭제
              </CheckHeaderRight>
            </CheckHeader>
          )}
          {cartData.items.length === 0 ? (
            <EmptyCart />
          ) : (
            <ItemCon>
              <CartItem
                type="header"
                cartId={session?.user.id}
                allItemChecked={allItemChecked}
                setAllItemChecked={setAllItemChecked}
              />
              {cartData.items.map((cartItem, i) => (
                <CartItem
                  key={i}
                  title={cartItem.title}
                  imgUrl={cartItem.imgUrl}
                  price={priceCalculation(
                    cartItem.originalPrice,
                    cartItem.discount
                  )}
                  checked={cartItem.checked}
                  receivingDate={cartItem.receivingDate}
                  setTotalPrice={setTotalPrice}
                  cartId={session?.user.id}
                  itemId={cartItem.itemId}
                  quantity={cartItem.quantity}
                  deliveryperiod={cartItem.deliveryPeriod}
                />
              ))}
            </ItemCon>
          )}

          <ItemSubButtonCon>
            {cartData.items.length > 0 ? (
              <ButtonWrapper>
                <Button
                  colortype="white"
                  hover={false.toString()}
                  onClick={() => {
                    if (session) deleteCartItemMutation.mutate(session.user.id)
                  }}
                >
                  선택상품 삭제
                </Button>
                <Button
                  colortype="white"
                  hover={false.toString()}
                  onClick={() => {
                    Swal.fire({
                      text: '품절 상품이 없습니다.',
                      icon: 'warning',
                      confirmButtonColor: '#1E1E1E',
                      confirmButtonText: '확인',
                      scrollbarPadding: false,
                    })
                  }}
                >
                  품절상품 삭제
                </Button>
              </ButtonWrapper>
            ) : (
              <div></div>
            )}
            <DetailDesc>
              선택 가능한 수령일는 제품 배송기간에 따라 달라집니다.
            </DetailDesc>
          </ItemSubButtonCon>
          <PriceConWrapper>
            <TotalPriceSection totalPrice={totalPrice} />
          </PriceConWrapper>
          <ButtonCon>
            <button
              onClick={() => {
                navigate('/shop')
              }}
            >
              {cartData.items.length > 0 ? '계속 쇼핑하기' : '쇼핑하러 가기'}
            </button>

            {cartData.items.length > 0 &&
            cartData.items.some(item => item.checked) ? ( // 체크된 아이템이 있을 경우
              isAllItemReceivingDateSelected ? (
                <button
                  onClick={() => {
                    Swal.fire({
                      text: '구매해주셔서 감사합니다.',
                      icon: 'success',
                      confirmButtonColor: '#1E1E1E',
                      confirmButtonText: '확인',
                      scrollbarPadding: false,
                      allowOutsideClick: false,
                    }).then(async result => {
                      if (result.isConfirmed) {
                        // 체크된 아이템들만 필터링
                        const checkedItems = cartData.items.filter(
                          item => item.checked
                        )

                        // 구매 데이터를 생성
                        const purchaseDataArray = checkedItems.map(item => ({
                          id: item.itemId,
                          img_url: item.imgUrl,
                          title: item.title,
                          price:
                            priceCalculation(
                              item.originalPrice,
                              item.discount
                            ) * item.quantity,
                          amount: item.quantity,
                          created_at: new Date().toISOString(),
                        }))

                        // 각 상품의 구매 내역을 Supabase에 저장
                        for (const purchaseData of purchaseDataArray) {
                          await addPurchaseHistory(
                            session.user.id,
                            purchaseData
                          )
                        }

                        // 체크된 아이템만 삭제
                        deleteCartItemMutation.mutate(session.user.id)

                        // 확인 버튼을 눌렀을 때 이동할 URL
                        navigate('/shop')
                      }
                    })
                  }}
                >
                  결제하기
                </button>
              ) : (
                <button>수령일을 선택해주세요</button>
              )
            ) : (
              <button>상품을 선택해주세요</button> // 체크된 아이템이 없을 경우
            )}
          </ButtonCon>
        </CartWrapper>
      </CartCon>
    )
  )
}
const CartCon = styled.div`
  width: 100%;
  border-top: 1px solid rgba(210, 210, 210, 1);
  margin-top: 100px;

  @media (max-width: 1024px) {
    margin-top: 90px;
  }

  @media (max-width: 768px) {
    margin-top: 74px;
  }

  @media (max-width: 600px) {
    margin-top: 52px;
  }
`

const CartWrapper = styled.div`
  margin: 40px auto 0;
  width: 75%;

  @media (max-width: 1024px) {
    width: 90%;
    height: auto;
    margin: 42px auto;
  }

  @media (max-width: 600px) {
    width: 100%;
    margin: 16px auto;
    padding: 0 14px;
  }
`

const Title = styled.div`
  margin-bottom: 20px;
  font-size: 1.4rem;
  font-weight: 600;

  @media (max-width: 1024px) {
    display: none;
  }
`

const CheckHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 6px;
`

const CheckHeaderLeft = styled.div`
  display: flex;
  align-items: center;

  input {
    width: 18px;
    height: 18px;
    margin-right: 8px;
  }

  @media (max-width: 600px) {
    font-size: 0.9rem;

    input {
      width: 14px;
      height: 14px;
      margin-right: 8px;
    }
  }
`

const CheckHeaderRight = styled.div`
  cursor: pointer;

  @media (max-width: 600px) {
    font-size: 0.9rem;
  }
`

const ItemCon = styled.div`
  border-top: 3px solid rgba(30, 30, 30, 1);
  border-bottom: 1px solid rgba(120, 120, 120, 1);

  @media (max-width: 1024px) {
    border-top: 2px solid rgba(20, 20, 20, 1);
  }

  @media (max-width: 600px) {
    border-top: 1px solid rgba(20, 20, 20, 1);
  }
`

const ItemSubButtonCon = styled.div`
  display: flex;
  margin-top: 20px;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-end;
    margin-top: 15px;
  }

  @media (max-width: 600px) {
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 280px;

  @media (max-width: 1024px) {
    display: none;
  }
`

const PriceConWrapper = styled.div`
  margin-top: 60px;
  border: 1px solid grey;
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 1024px) {
    margin-top: 50px;
  }

  @media (max-width: 600px) {
    margin-top: 30px;
    margin-bottom: 40px;
  }
`

const DetailDesc = styled.div`
  @media (max-width: 1024px) {
    font-size: 0.9rem;
  }

  @media (max-width: 600px) {
    font-size: 0.8rem;
  }

  @media (max-width: 400px) {
    font-size: 0.7rem;
  }
`

const ButtonCon = styled.div`
  display: flex;
  justify-content: end;
  margin-top: 50px;
  padding-bottom: 50px;

  @media (max-width: 1024px) {
    margin-top: 20px;
    padding-bottom: 0px;
  }

  @media (max-width: 600px) {
    margin-top: 10px;
    flex-direction: column;
    align-items: center;
  }

  button {
    padding: 16px;
    font-size: 1.1rem;
    font-weight: 500;
    cursor: pointer;
    width: 260px;
    border-radius: 6px;

    &:first-of-type {
      background-color: #fff;
      border: 1px solid rgba(150, 150, 150, 1);

      @media (max-width: 600px) {
        margin-bottom: 10px;
      }
    }

    &:last-of-type {
      background-color: rgba(20, 20, 20, 1);
      color: #fff;
      border: none;
      margin-left: 14px;

      @media (max-width: 600px) {
        margin-left: 0px;
      }
    }

    @media (max-width: 600px) {
      width: 100%;
      padding: 12px;
      font-size: 0.9rem;
    }
  }
`

const LoadingPage = styled.div`
  margin-top: 100px;
  width: 100%;
  min-height: 500px;
  height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 1024px) {
    margin-top: 90px;
    height: calc(100vh - 90px);
  }

  @media (max-width: 768px) {
    margin-top: 74px;
    height: calc(100vh - 74px);
  }

  @media (max-width: 600px) {
    margin-top: 52px;
    height: calc(100vh - 112px);
  }
`

const LoadingIcon = styled.div`
  width: 140px;
  height: 140px;
  margin-bottom: 100px;

  img {
    width: 100%;
  }

  @media (max-width: 1024px) {
    width: 130px;
    height: 130px;
  }

  @media (max-width: 600px) {
    width: 120px;
    height: 120px;
  }
`
