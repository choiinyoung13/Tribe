import styled from "styled-components";
import CartItem from "../components/Cart/CartItem";
import Button from "../components/Common/Button";
import TotalPriceSection from "../components/Cart/TotalPriceSection";
import useWindowWidth from "../hooks/useWindowWidth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { priceCalculation } from "../utill/priceCalculation";
import EmptyCart from "../components/Cart/EmptyCart";
import { useAuth } from "../hooks/useAuth";
import { useCartMutations } from "../mutations/useCartMutations";
import { useQuery } from "react-query";
import { fetchCartItems } from "../utill/cart/fetchCartItems";
import { fetchItemById } from "../utill/items/fetchItems";
import { QUERY_KEYS } from "../config/queryKeys";

interface CartItem {
  itemId: number;
  quantity: number;
  receivingDate: number;
  checked: boolean;
  option: string;
}

interface ItemDetails {
  id: number;
  imgurl: string;
  title: string;
  originalprice: number;
  discount: number;
  badge: string[];
  category: string;
  classification: string;
  deliveryperiod: number;
  origin: string;
  size: string;
}

interface DetailedCartItem extends CartItem {
  details: ItemDetails;
}

export default function Cart() {
  const windowWidth = useWindowWidth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<DetailedCartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { session } = useAuth();
  const [allItemChecked, setAllItemChecked] = useState(false);
  const {
    deleteCartItemMutation,
    deleteAllCartItemMutation,
    toggleAllCartItemStatusMutation,
  } = useCartMutations();

  useEffect(() => {
    const allChecked = cartItems.every((item) => item.checked);
    setAllItemChecked(allChecked);
  }, [cartItems]);

  const handleItemCheckedChange = (itemId: number, checked: boolean) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.itemId === itemId ? { ...item, checked } : item
      )
    );
  };

  const {
    data: cartData,
    error,
    isLoading,
  } = useQuery(QUERY_KEYS.CART_ITEMS, fetchCartItems, {
    enabled: !!session,
    staleTime: Infinity,
    cacheTime: 30 * 60 * 1000,
  });

  useEffect(() => {
    const fetchDetailedCartItems = async () => {
      if (cartData) {
        const detailedItemsPromises = cartData.items.map(
          async (cartItem: CartItem) => {
            const itemDetails = await fetchItemById(cartItem.itemId);
            return { ...cartItem, details: itemDetails };
          }
        );

        const detailedItems = await Promise.all(detailedItemsPromises);
        setCartItems(detailedItems);
      }
    };

    fetchDetailedCartItems();
  }, [cartData]);

  if (error) {
    console.error(error);
    return <div>Error loading cart data</div>;
  }

  if (isLoading) {
    return null;
  }

  return (
    <CartCon>
      <Title>장바구니</Title>
      {windowWidth < 1024 && (
        <CheckHeader>
          <CheckHeaderLeft>
            <div>
              <input
                type="checkbox"
                checked={allItemChecked}
                onClick={() => {
                  const cartId = session!.user.id;

                  setAllItemChecked((prev) => {
                    const newValue = !prev;
                    toggleAllCartItemStatusMutation.mutate({
                      cartId,
                      allItemChecked: newValue,
                    });
                    return newValue;
                  });
                }}
              />
            </div>
            <div>전체선택 (1/2)</div>
          </CheckHeaderLeft>
          <CheckHeaderRight
            onClick={() => {
              if (session) deleteCartItemMutation.mutate(session.user.id);
            }}
          >
            선택삭제
          </CheckHeaderRight>
        </CheckHeader>
      )}
      {cartItems.length > 0 ? (
        <ItemCon>
          <CartItem
            type="header"
            cartId={session?.user.id}
            allItemChecked={allItemChecked}
            setAllItemChecked={setAllItemChecked}
            allCartItemMutation={toggleAllCartItemStatusMutation}
          />
          {cartItems.map((cartItem, i) => (
            <CartItem
              key={i}
              title={cartItem.details.title}
              imgUrl={cartItem.details.imgurl}
              price={priceCalculation(
                cartItem.details.originalprice,
                cartItem.details.discount
              )}
              option={cartItem.option}
              checked={cartItem.checked}
              receivingDate={cartItem.receivingDate}
              setTotalPrice={setTotalPrice}
              cartId={session?.user.id}
              itemId={cartItem.itemId}
              handleItemCheckedChange={handleItemCheckedChange}
              quantity={cartItem.quantity}
            />
          ))}
        </ItemCon>
      ) : (
        <EmptyCart />
      )}

      <ItemSubButtonCon>
        {cartItems.length > 0 ? (
          <ButtonWrapper>
            <Button
              colortype="white"
              hover={false.toString()}
              onClick={() => {
                if (session) deleteCartItemMutation.mutate(session.user.id);
              }}
            >
              선택상품 삭제
            </Button>
            <Button colortype="white" hover={false.toString()}>
              품절상품 삭제
            </Button>
          </ButtonWrapper>
        ) : (
          <div></div>
        )}
        <DetailDesc>
          장바구니는 최대 100개의 상품을 담을 수 있습니다.
        </DetailDesc>
      </ItemSubButtonCon>
      <PriceConWrapper>
        <TotalPriceSection totalPrice={totalPrice} />
      </PriceConWrapper>
      <ButtonCon>
        <button
          onClick={() => {
            navigate("/shop"); // 변수명 수정
          }}
        >
          {cartItems.length > 0 ? "계속 쇼핑하기" : "쇼핑하러 가기"}
        </button>
        {cartItems.length > 0 && (
          <button
            onClick={() => {
              alert("구매해주셔서 감사합니다");
              navigate("/shop");
              deleteAllCartItemMutation.mutate(session!.user.id);
            }}
          >
            결제하기
          </button>
        )}
      </ButtonCon>
      <Footer />
    </CartCon>
  );
}

const CartCon = styled.div`
  position: relative;
  width: 75%;
  height: 70vh;
  margin: 150px auto;

  @media (max-width: 1024px) {
    width: 90%;
    height: auto;
    margin: 100px auto;
  }

  @media (max-width: 600px) {
    width: 100%;
    margin: 60px auto;
    padding: 0 14px;
  }
`;

const Title = styled.div`
  margin-bottom: 20px;
  font-size: 1.4rem;
  font-weight: 600;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const CheckHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 6px;
`;

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
`;
const CheckHeaderRight = styled.div`
  cursor: pointer;

  @media (max-width: 600px) {
    font-size: 0.9rem;
  }
`;

const ItemCon = styled.div`
  border-top: 3px solid rgba(20, 20, 20, 1);
  border-bottom: 1px solid rgba(120, 120, 120, 1);

  @media (max-width: 1024px) {
    border-top: 2px solid rgba(20, 20, 20, 1);
  }

  @media (max-width: 600px) {
    border-top: 1px solid rgba(20, 20, 20, 1);
  }
`;

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
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 280px;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const PriceConWrapper = styled.div`
  margin-top: 90px;
  border: 1px solid grey;

  @media (max-width: 1024px) {
    margin-top: 60px;
  }

  @media (max-width: 600px) {
    margin-top: 30px;
    margin-bottom: 40px;
  }
`;

const DetailDesc = styled.div`
  @media (max-width: 1024px) {
    font-size: 0.9rem;
  }

  @media (max-width: 600px) {
    font-size: 0.8rem;
  }
`;

const ButtonCon = styled.div`
  display: flex;
  justify-content: end;
  margin-top: 50px;

  @media (max-width: 1024px) {
    margin-top: 20px;
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

    &:first-of-type {
      background-color: #fff;
      border: 1px solid rgba(150, 150, 150, 1);
      margin-right: 14px;

      @media (max-width: 600px) {
        margin-right: 0;
        margin-bottom: 10px;
      }
    }

    &:last-of-type {
      background-color: rgba(20, 20, 20, 1);
      color: #fff;
      border: none;
    }

    @media (max-width: 600px) {
      width: 100%;
      font-size: 1rem;
    }
  }
`;
const Footer = styled.div`
  width: 100%;
  height: 100px;
`;
